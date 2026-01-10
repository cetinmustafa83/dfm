'use client'

import { Button } from '@/components/ui/button'
import { Download, Eye, Mail } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState, useMemo, useRef } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

// Helper functions
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

interface CompanyInfo {
  companyName: string
  address: string
  email: string
  phone: string
  taxId: string
  managingDirector: string
  commercialRegister: string
  siteUrl: string
  logoUrl: string
  invoiceSettings: {
    taxRate: number
    logoWidth: number
    headerText: string
    footerText: string
    showPayPalQR: boolean
    showBankQR: boolean
  }
  bankTransfer?: {
    bankName: string
    accountHolder: string
    iban: string
    bic: string
  }
}

interface InvoicePreviewProps {
  invoiceNumber: string
  invoiceDate: string
  dueDate?: string
  customerNumber: string
  customerName: string
  customerEmail: string
  customerAddress?: string
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes?: string
  paymentLink?: string
}

export default function InvoicePreview(props: InvoicePreviewProps) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [sending, setSending] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchCompanyInfo() {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()
        
        const settings = data.settings
        setCompanyInfo({
          companyName: settings.general.companyName,
          address: settings.general.address,
          email: settings.general.email,
          phone: settings.general.phone,
          taxId: settings.general.taxId,
          managingDirector: settings.general.managingDirector,
          commercialRegister: settings.general.commercialRegister,
          siteUrl: settings.general.siteUrl,
          logoUrl: settings.general.companyLogoUrl || settings.general.websiteLogoUrl,
          invoiceSettings: {
            taxRate: settings.invoice.taxRate,
            logoWidth: settings.invoice.logoWidth || 128,
            headerText: settings.invoice.headerText || 'Unsere Lieferungen/Leistungen stellen wir Ihnen wie folgt in Rechnung.',
            footerText: settings.invoice.footerText || 'Thank you for your business',
            showPayPalQR: settings.invoice.showPayPalQR !== false,
            showBankQR: settings.invoice.showBankQR !== false
          },
          bankTransfer: settings.payment.bankTransfer.enabled ? {
            bankName: settings.payment.bankTransfer.bankName,
            accountHolder: settings.payment.bankTransfer.accountHolder,
            iban: settings.payment.bankTransfer.iban,
            bic: settings.payment.bankTransfer.bic
          } : undefined
        })
      } catch (error) {
        console.error('Failed to fetch company info:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyInfo()
  }, [])

  async function handleDownload() {
    if (!invoiceRef.current) return
    
    setDownloading(true)
    try {
      // Hide action buttons before capturing
      const buttons = invoiceRef.current.querySelector('.print\\:hidden')
      if (buttons) {
        (buttons as HTMLElement).style.display = 'none'
      }

      // Capture the invoice as canvas
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      // Show buttons again
      if (buttons) {
        (buttons as HTMLElement).style.display = ''
      }

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`Rechnung_${props.invoiceNumber}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Fehler beim Erstellen der PDF-Datei')
    } finally {
      setDownloading(false)
    }
  }

  async function handleEmail() {
    setSending(true)
    try {
      // TODO: Implement email sending logic
      // This would typically call an API endpoint to send the invoice via email
      const response = await fetch('/api/invoice/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: props.invoiceNumber,
          customerEmail: props.customerEmail,
          customerName: props.customerName
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send email')
      }

      alert(`Rechnung erfolgreich an ${props.customerEmail} gesendet`)
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Fehler beim Senden der E-Mail')
    } finally {
      setSending(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  // Generate PayPal QR Code URL using QR Server API
  const paypalQRCode = useMemo(() => {
    if (!props.paymentLink) return null
    // Use QR Server API (free, no auth required)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(props.paymentLink)}`
  }, [props.paymentLink])

  // Generate EPC QR Code for SEPA Bank Transfer
  const bankQRCode = useMemo(() => {
    if (!companyInfo?.bankTransfer) return null
    
    // EPC QR Code format for SEPA payments (European Payments Council)
    const epcData = [
      'BCD',                                    // Service Tag
      '002',                                    // Version
      '1',                                      // Character Set (1 = UTF-8)
      'SCT',                                    // Identification
      companyInfo.bankTransfer.bic || '',       // BIC
      companyInfo.bankTransfer.accountHolder || companyInfo.companyName, // Beneficiary Name
      companyInfo.bankTransfer.iban || '',      // Beneficiary Account (IBAN)
      `EUR${props.total.toFixed(2)}`,          // Amount (EUR + value)
      '',                                       // Purpose
      props.invoiceNumber || '',                // Structured Reference (Invoice Number)
      '',                                       // Unstructured Remittance
      'Rechnung ' + props.invoiceNumber         // Beneficiary to Originator Information
    ].join('\n')
    
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(epcData)}`
  }, [companyInfo, props.total, props.invoiceNumber])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4" ref={invoiceRef}>
      {/* Actions */}
      <div className="flex gap-2 print:hidden">
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Vorschau drucken
        </Button>
        <Button onClick={handleDownload} variant="outline" size="sm" disabled={downloading}>
          <Download className="mr-2 h-4 w-4" />
          {downloading ? 'Wird erstellt...' : 'PDF herunterladen'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleEmail} disabled={sending}>
          <Mail className="mr-2 h-4 w-4" />
          {sending ? 'Wird gesendet...' : 'Per E-Mail senden'}
        </Button>
      </div>

      {/* Invoice - Exact Design from Image */}
      <div className="bg-white p-12 shadow-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header with Logos */}
        <div className="flex justify-between items-start mb-12">
          {/* Company Logo */}
          <div className="flex items-center gap-4">
            {companyInfo?.logoUrl && (
              <div className="relative" style={{ width: `${companyInfo.invoiceSettings.logoWidth}px`, height: 'auto' }}>
                <Image
                  src={companyInfo.logoUrl}
                  alt="Company Logo"
                  width={companyInfo.invoiceSettings.logoWidth}
                  height={0}
                  style={{ width: '100%', height: 'auto' }}
                  className="object-contain object-left"
                />
              </div>
            )}
          </div>
          
          {/* Company Info - Right Aligned */}
          <div className="text-right text-sm leading-relaxed">
            <p className="font-bold text-base">{companyInfo?.companyName}</p>
            <p>{companyInfo?.address}</p>
            <p>Tel.: {companyInfo?.phone}</p>
            <p>{companyInfo?.email}</p>
            <p>{companyInfo?.siteUrl}</p>
          </div>
        </div>

        {/* Sender Address (Small) */}
        <div className="text-xs text-gray-600 mb-1">
          {companyInfo?.companyName}, {companyInfo?.address}
        </div>

        {/* Customer Address */}
        <div className="mb-12 text-sm leading-relaxed">
          <p className="font-semibold">{props.customerName}</p>
          {props.customerAddress && (
            <p>{props.customerAddress}</p>
          )}
        </div>

        {/* Invoice Header */}
        <div className="border border-black mb-6">
          <div className="flex">
            <div className="flex-1 p-3">
              <h2 className="text-xl font-bold">Rechnung</h2>
            </div>
            <div className="border-l border-black p-3 text-sm min-w-[140px]">
              <p className="text-gray-600">Rechnungsnr.:</p>
              <p className="font-semibold">{props.invoiceNumber}</p>
            </div>
            <div className="border-l border-black p-3 text-sm min-w-[140px]">
              <p className="text-gray-600">Kundennr.:</p>
              <p className="font-semibold">{props.customerNumber}</p>
            </div>
            <div className="border-l border-black p-3 text-sm min-w-[140px]">
              <p className="text-gray-600">Datum:</p>
              <p className="font-semibold">{formatDate(props.invoiceDate)}</p>
            </div>
            <div className="border-l border-black p-3 text-sm min-w-[140px]">
              <p className="text-gray-600">Lieferdatum:</p>
              <p className="font-semibold">{props.dueDate ? formatDate(props.dueDate) : formatDate(props.invoiceDate)}</p>
            </div>
          </div>
        </div>

        {/* Introduction Text */}
        <p className="text-sm mb-6">
          {companyInfo?.invoiceSettings.headerText || 'Unsere Lieferungen/Leistungen stellen wir Ihnen wie folgt in Rechnung.'}
        </p>

        {/* Items Table */}
        <div className="border border-black mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-black">
                <th className="border-r border-black p-2 text-left font-semibold w-12">Pos.</th>
                <th className="border-r border-black p-2 text-left font-semibold">Bezeichnung</th>
                <th className="border-r border-black p-2 text-center font-semibold w-20">Menge</th>
                <th className="border-r border-black p-2 text-center font-semibold w-20">Einheit</th>
                <th className="border-r border-black p-2 text-right font-semibold w-28">Einzel €</th>
                <th className="border-r border-black p-2 text-right font-semibold w-28">Rabatt %</th>
                <th className="p-2 text-right font-semibold w-28">Gesamt €</th>
              </tr>
            </thead>
            <tbody>
              {props.items.map((item, index) => (
                <tr key={index} className="border-b border-black">
                  <td className="border-r border-black p-2 text-center">{index + 1}</td>
                  <td className="border-r border-black p-2">{item.description}</td>
                  <td className="border-r border-black p-2 text-center">{item.quantity}</td>
                  <td className="border-r border-black p-2 text-center">Stück</td>
                  <td className="border-r border-black p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="border-r border-black p-2 text-right">{formatCurrency(item.discount)}</td>
                  <td className="p-2 text-right font-semibold">{formatCurrency(item.total)}</td>
                </tr>
              ))}
              
              {/* Totals */}
              <tr className="bg-gray-100 border-b border-black">
                <td colSpan={6} className="border-r border-black p-2 font-semibold">Zwischensumme (netto)</td>
                <td className="p-2 text-right font-semibold">{formatCurrency(props.subtotal)}</td>
              </tr>
              <tr className="bg-gray-100 border-b border-black">
                <td colSpan={6} className="border-r border-black p-2 font-semibold">Umsatzsteuer {props.taxRate} %</td>
                <td className="p-2 text-right font-semibold">{formatCurrency(props.taxAmount)}</td>
              </tr>
              <tr className="bg-gray-100">
                <td colSpan={6} className="border-r border-black p-2 font-bold">Gesamtbetrag</td>
                <td className="p-2 text-right font-bold">{formatCurrency(props.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Text - Above QR Codes */}
        {companyInfo?.invoiceSettings.footerText && (
          <div className="text-sm text-gray-600 mb-6 text-center">
            {companyInfo.invoiceSettings.footerText}
          </div>
        )}

        {/* Payment Section with QR Codes */}
        {((props.paymentLink && companyInfo?.invoiceSettings.showPayPalQR) || (companyInfo?.bankTransfer && companyInfo?.invoiceSettings.showBankQR)) && (
          <div className="border-t border-gray-300 pt-8 mb-8">
            <div className="grid grid-cols-2 gap-6">
              {/* PayPal Section */}
              {props.paymentLink && companyInfo?.invoiceSettings.showPayPalQR && (
                <div className="border-2 border-gray-300 p-4 rounded-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="font-semibold mb-2">Bezahlen per PayPal</p>
                      <p className="text-sm mb-2">Ganz bequem Code scannen</p>
                      <p className="text-sm">oder <a href={props.paymentLink} className="underline text-blue-600">Link</a> verwenden.</p>
                      <p className="text-xs text-gray-600 mt-2 break-all">{props.paymentLink}</p>
                    </div>
                    <div className="w-24 h-24 border border-gray-300 bg-white flex items-center justify-center flex-shrink-0">
                      {paypalQRCode ? (
                        <img
                          src={paypalQRCode}
                          alt="PayPal QR Code"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">QR Code</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Section */}
              {companyInfo?.bankTransfer && companyInfo?.invoiceSettings.showBankQR && (
                <div className="border-2 border-gray-300 p-4 rounded-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="font-semibold mb-2">Überweisen per Code</p>
                      <p className="text-sm mb-2">Ganz bequem Code mit der</p>
                      <p className="text-sm">Banking-App scannen.</p>
                    </div>
                    <div className="w-24 h-24 border border-gray-300 bg-white flex items-center justify-center flex-shrink-0">
                      {bankQRCode ? (
                        <img
                          src={bankQRCode}
                          alt="Bank Transfer QR Code"
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <div className="text-xs text-gray-400">QR Code</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Section */}
        <div className="border-t-2 border-gray-300 pt-6 mt-12">
          <div className="grid grid-cols-4 gap-8 text-xs">
            {/* Company Info */}
            <div>
              <p className="font-bold mb-2">{companyInfo?.companyName}</p>
              <p>{companyInfo?.address}</p>
            </div>

            {/* Owner/Representative Info */}
            <div>
              <p className="font-bold mb-2">Inhaberin / Vertreter</p>
              <p>{companyInfo?.managingDirector}</p>
              <p>Steuernummer: {companyInfo?.taxId}</p>
              <p>Erfüllungsort Gerichtsstand {companyInfo?.address?.split(',')[1]?.trim()}</p>
            </div>

            {/* Contact Info */}
            <div>
              <p className="font-bold mb-2">Kontakt</p>
              <p>{companyInfo?.siteUrl}</p>
              <p>{companyInfo?.email}</p>
              <p>Tel: {companyInfo?.phone}</p>
              <p>Mo-Fr: 09:00 - 17:00 (CET)</p>
            </div>

            {/* Bank Details */}
            <div>
              <p className="font-bold mb-2">Bankverbindung</p>
              {companyInfo?.bankTransfer && (
                <>
                  <p>{companyInfo.bankTransfer.bankName}</p>
                  <p>{companyInfo.bankTransfer.iban}</p>
                  <p>{companyInfo.bankTransfer.bic}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Page Number */}
        <div className="text-center text-xs text-gray-600 mt-6">
          Seite 1/1
        </div>
      </div>
    </div>
  )
}