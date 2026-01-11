import { settingsDb } from '@/lib/settings-db'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'

/**
 * Invoice PDF Generator
 * Generates PDF invoices using jsPDF
 * 
 * Note: This is a server-side implementation.
 * Install required packages: npm install jspdf jspdf-autotable
 */

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate?: string
  customerName: string
  customerEmail: string
  customerAddress?: string
  customerTaxId?: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes?: string
  paymentTerms?: string
}

/**
 * Generate invoice number
 */
export async function generateInvoiceNumber(): Promise<string> {
  const settings = await settingsDb.getAll()
  const prefix = settings.invoice?.invoicePrefix || 'INV'
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')

  return `${prefix}-${year}${month}-${random}`
}

/**
 * Calculate invoice totals
 */
export function calculateInvoiceTotals(
  items: InvoiceItem[],
  taxRate: number = 19
): {
  subtotal: number
  taxAmount: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  }
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('de-DE').format(d)
}

/**
 * Generate invoice PDF (Browser implementation)
 * This uses jsPDF which works in both browser and Node.js
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Blob> {
  // Dynamic import for browser compatibility
  const jsPDF = (await import('jspdf')).default
  const autoTable = (await import('jspdf-autotable')).default

  const settings = await settingsDb.getAll()
  const {
    invoiceNumber,
    invoiceDate,
    dueDate,
    customerName,
    customerEmail,
    customerAddress,
    customerTaxId,
    items,
    subtotal,
    taxRate,
    taxAmount,
    total,
    notes,
    paymentTerms
  } = data

  // Create PDF
  const doc = new jsPDF()

  // Get invoice settings
  const primaryColor = settings.invoice?.primaryColor || '#3b82f6'
  const secondaryColor = settings.invoice?.secondaryColor || '#64748b'
  const fontFamily = settings.invoice?.fontFamily || 'helvetica'

  // Set font
  doc.setFont(fontFamily)

  // Company logo (if available)
  if (settings.invoice?.logoUrl) {
    try {
      doc.addImage(settings.invoice.logoUrl, 'PNG', 15, 15, 40, 20)
    } catch (error) {
      console.error('Failed to add logo to PDF:', error)
    }
  }

  // Company details (right side)
  doc.setFontSize(10)
  doc.setTextColor(secondaryColor)
  const companyDetails = [
    settings.general?.companyName || 'Your Company',
    settings.general?.address || '',
    `${settings.general?.postalCode || ''} ${settings.general?.city || ''}`,
    settings.general?.country || '',
    '',
    `Email: ${settings.general?.email || ''}`,
    `Phone: ${settings.general?.phone || ''}`,
    `Tax ID: ${settings.general?.taxId || ''}`
  ].filter(line => line.trim() !== '')

  let yPos = 15
  companyDetails.forEach(line => {
    doc.text(line, 200, yPos, { align: 'right' })
    yPos += 5
  })

  // Invoice title
  yPos = 60
  doc.setFontSize(24)
  doc.setTextColor(primaryColor)
  doc.text('INVOICE', 15, yPos)

  // Invoice details
  yPos += 10
  doc.setFontSize(10)
  doc.setTextColor('#000000')
  doc.text(`Invoice Number: ${invoiceNumber}`, 15, yPos)
  yPos += 6
  doc.text(`Invoice Date: ${formatDate(invoiceDate)}`, 15, yPos)
  if (dueDate) {
    yPos += 6
    doc.text(`Due Date: ${formatDate(dueDate)}`, 15, yPos)
  }

  // Customer details
  yPos += 15
  doc.setFontSize(12)
  doc.setTextColor(primaryColor)
  doc.text('Bill To:', 15, yPos)

  yPos += 7
  doc.setFontSize(10)
  doc.setTextColor('#000000')
  doc.text(customerName, 15, yPos)
  yPos += 5
  if (customerEmail) {
    doc.text(customerEmail, 15, yPos)
    yPos += 5
  }
  if (customerAddress) {
    doc.text(customerAddress, 15, yPos)
    yPos += 5
  }
  if (customerTaxId) {
    doc.text(`Tax ID: ${customerTaxId}`, 15, yPos)
    yPos += 5
  }

  // Items table
  yPos += 10
  const tableData = items.map(item => [
    item.description,
    item.quantity.toString(),
    formatCurrency(item.unitPrice),
    formatCurrency(item.total)
  ])

  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'Quantity', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: '#ffffff',
      fontStyle: 'bold'
    },
    styles: {
      font: fontFamily
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' }
    }
  })

  // Get final Y position after table
  yPos = (doc as any).lastAutoTable.finalY + 10

  // Totals
  const totalsX = 150
  doc.setFontSize(10)

  doc.text('Subtotal:', totalsX, yPos)
  doc.text(formatCurrency(subtotal), 190, yPos, { align: 'right' })

  yPos += 6
  doc.text(`Tax (${taxRate}%):`, totalsX, yPos)
  doc.text(formatCurrency(taxAmount), 190, yPos, { align: 'right' })

  yPos += 8
  doc.setFontSize(12)
  doc.setFont(fontFamily, 'bold')
  doc.text('Total:', totalsX, yPos)
  doc.text(formatCurrency(total), 190, yPos, { align: 'right' })

  // Notes
  if (notes) {
    yPos += 15
    doc.setFontSize(10)
    doc.setFont(fontFamily, 'normal')
    doc.setTextColor(secondaryColor)
    doc.text('Notes:', 15, yPos)
    yPos += 5
    doc.setTextColor('#000000')
    const splitNotes = doc.splitTextToSize(notes, 180)
    doc.text(splitNotes, 15, yPos)
  }

  // Payment terms
  if (paymentTerms) {
    yPos += 15
    doc.setFontSize(10)
    doc.setTextColor(secondaryColor)
    doc.text('Payment Terms:', 15, yPos)
    yPos += 5
    doc.setTextColor('#000000')
    const splitTerms = doc.splitTextToSize(paymentTerms, 180)
    doc.text(splitTerms, 15, yPos)
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(secondaryColor)
  doc.text(
    settings.invoice?.footerText || 'Thank you for your business!',
    105,
    pageHeight - 15,
    { align: 'center' }
  )

  // Return as blob
  return doc.output('blob')
}

/**
 * Generate invoice PDF and download
 */
export async function downloadInvoicePDF(data: InvoiceData, filename?: string): Promise<void> {
  const blob = await generateInvoicePDF(data)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `invoice-${data.invoiceNumber}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate invoice preview (Base64)
 */
export async function generateInvoicePreview(data: InvoiceData): Promise<string> {
  const jsPDF = (await import('jspdf')).default
  const autoTable = (await import('jspdf-autotable')).default

  // Generate PDF (same as above but return base64)
  const blob = await generateInvoicePDF(data)

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Send invoice via email (placeholder)
 */
export async function sendInvoiceEmail(
  data: InvoiceData,
  recipientEmail: string
): Promise<boolean> {
  try {
    const pdfBlob = await generateInvoicePDF(data)
    const arrayBuffer = await pdfBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await sendEmail({
      to: recipientEmail,
      subject: `Invoice ${data.invoiceNumber} from ${data.customerName}`,
      text: `Please find attached your invoice ${data.invoiceNumber}.`,
      attachments: [
        {
          filename: `invoice-${data.invoiceNumber}.pdf`,
          content: buffer
        }
      ]
    })

    return result.success
  } catch (error) {
    console.error('Failed to send invoice email:', error)
    return false
  }
}

/**
 * Save invoice to database (placeholder)
 */
export async function saveInvoiceToDatabase(
  data: InvoiceData,
  paymentId?: string
): Promise<string> {
  try {
    console.log('Saving invoice:', data.invoiceNumber)

    // Since there's no explicit Invoice model, we update the Payment record with the invoice number/details
    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          invoiceUrl: `/api/invoice/${data.invoiceNumber}`, // Placeholder URL
          description: `Invoice ${data.invoiceNumber} for ${data.customerName}`
        }
      })
    }

    return data.invoiceNumber
  } catch (error) {
    console.error('Failed to save invoice:', error)
    throw error
  }
}