import { z } from 'zod'

/**
 * Zod Validation Schemas
 * Comprehensive validation for all settings forms
 */

// ============================================================================
// General Settings Schema
// ============================================================================

export const generalSettingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  taxId: z.string().optional(),
  commercialRegister: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().max(500, 'Description must be less than 500 characters').optional()
})

export type GeneralSettings = z.infer<typeof generalSettingsSchema>

// ============================================================================
// Payment Settings Schema
// ============================================================================

export const paypalSettingsSchema = z.object({
  enabled: z.boolean(),
  clientId: z.string().min(1, 'PayPal Client ID is required').optional(),
  clientSecret: z.string().min(1, 'PayPal Client Secret is required').optional(),
  webhookId: z.string().optional(),
  testMode: z.boolean()
})

export const mollieSettingsSchema = z.object({
  enabled: z.boolean(),
  apiKey: z.string().min(1, 'Mollie API Key is required').optional(),
  testMode: z.boolean()
})

export const paymentSettingsSchema = z.object({
  paypal: paypalSettingsSchema,
  mollie: mollieSettingsSchema
})

export type PaymentSettings = z.infer<typeof paymentSettingsSchema>

// ============================================================================
// Invoice Settings Schema
// ============================================================================

export const invoiceSettingsSchema = z.object({
  prefix: z.string().min(1, 'Invoice prefix is required').max(10),
  nextNumber: z.number().int().positive(),
  taxRate: z.number().min(0).max(100),
  currency: z.enum(['EUR', 'USD', 'GBP']),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  fontFamily: z.enum(['helvetica', 'times', 'courier', 'arial']),
  logoUrl: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  footerText: z.string().max(200).optional(),
  paymentTerms: z.string().max(500).optional(),
  notes: z.string().max(500).optional()
})

export type InvoiceSettings = z.infer<typeof invoiceSettingsSchema>

// ============================================================================
// AI Settings Schema
// ============================================================================

export const aiSettingsSchema = z.object({
  enabled: z.boolean(),
  apiKey: z.string().min(1, 'AI API Key is required').optional(),
  baseUrl: z.string().url('Invalid base URL').optional(),
  model: z.string().min(1, 'Model name is required').optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
  contentGeneration: z.boolean(),
  seoOptimization: z.boolean(),
  autoBlog: z.boolean()
})

export type AISettings = z.infer<typeof aiSettingsSchema>

// ============================================================================
// Google Settings Schema
// ============================================================================

export const googleSettingsSchema = z.object({
  analyticsId: z.string().regex(/^G-[A-Z0-9]+$/, 'Invalid Google Analytics ID').optional().or(z.literal('')),
  tagManagerId: z.string().regex(/^GTM-[A-Z0-9]+$/, 'Invalid Tag Manager ID').optional().or(z.literal('')),
  searchConsoleId: z.string().optional(),
  recaptchaSiteKey: z.string().optional(),
  recaptchaSecretKey: z.string().optional()
})

export type GoogleSettings = z.infer<typeof googleSettingsSchema>

// ============================================================================
// Legal Settings Schema
// ============================================================================

export const legalSettingsSchema = z.object({
  impressum: z.string().min(1, 'Impressum content is required'),
  datenschutz: z.string().min(1, 'Privacy policy content is required'),
  agb: z.string().min(1, 'Terms and conditions content is required'),
  widerrufsrecht: z.string().min(1, 'Right of withdrawal content is required'),
  cookieConsent: z.object({
    enabled: z.boolean(),
    position: z.enum(['top', 'bottom', 'center']),
    theme: z.enum(['light', 'dark'])
  })
})

export type LegalSettings = z.infer<typeof legalSettingsSchema>

// ============================================================================
// SEO Settings Schema
// ============================================================================

export const seoSettingsSchema = z.object({
  aiOptimization: z.boolean(),
  defaultTitle: z.string().max(60, 'Title must be 60 characters or less').optional(),
  defaultDescription: z.string().max(160, 'Description must be 160 characters or less').optional(),
  keywords: z.array(z.string()).max(10, 'Maximum 10 keywords allowed')
})

export type SEOSettings = z.infer<typeof seoSettingsSchema>

// ============================================================================
// Complete Settings Schema
// ============================================================================

export const settingsSchema = z.object({
  general: generalSettingsSchema,
  payment: paymentSettingsSchema,
  invoice: invoiceSettingsSchema,
  ai: aiSettingsSchema,
  google: googleSettingsSchema,
  legal: legalSettingsSchema,
  seo: seoSettingsSchema
})

export type Settings = z.infer<typeof settingsSchema>

// ============================================================================
// Payment Request Schemas
// ============================================================================

export const createPaymentSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format'),
  description: z.string().min(1, 'Description is required').max(200),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  returnUrl: z.string().url('Invalid return URL'),
  cancelUrl: z.string().url('Invalid cancel URL'),
  orderId: z.string().optional()
})

export type CreatePayment = z.infer<typeof createPaymentSchema>

// ============================================================================
// Invoice Data Schema
// ============================================================================

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  unitPrice: z.number().positive('Unit price must be positive'),
  total: z.number().positive('Total must be positive')
})

export const invoiceDataSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().optional(),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid customer email'),
  customerAddress: z.string().optional(),
  customerTaxId: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  subtotal: z.number().nonnegative('Subtotal cannot be negative'),
  taxRate: z.number().min(0).max(100),
  taxAmount: z.number().nonnegative('Tax amount cannot be negative'),
  total: z.number().positive('Total must be positive'),
  notes: z.string().max(500).optional(),
  paymentTerms: z.string().max(500).optional()
})

export type InvoiceData = z.infer<typeof invoiceDataSchema>

// ============================================================================
// AI Request Schemas
// ============================================================================

export const aiGenerateSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(2000),
  context: z.string().max(5000).optional(),
  type: z.enum(['generate', 'enhance', 'rewrite', 'expand', 'summarize']),
  maxTokens: z.number().int().positive().optional()
})

export type AIGenerate = z.infer<typeof aiGenerateSchema>

export const seoOptimizeSchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000),
  title: z.string().max(100).optional(),
  keywords: z.array(z.string()).max(10).optional(),
  targetLength: z.object({
    title: z.number().int().positive().optional(),
    description: z.number().int().positive().optional()
  }).optional()
})

export type SEOOptimize = z.infer<typeof seoOptimizeSchema>

export const blogGenerateSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(200),
  keywords: z.array(z.string()).max(10).optional(),
  tone: z.enum(['professional', 'casual', 'technical', 'friendly']).optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
  includeImages: z.boolean().optional(),
  research: z.boolean().optional(),
  sources: z.array(z.string().url()).max(5).optional()
})

export type BlogGenerate = z.infer<typeof blogGenerateSchema>

// ============================================================================
// Logo Upload Schema
// ============================================================================

export const logoUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      file => ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type),
      'File must be PNG, JPEG, or WebP'
    )
})

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate data against schema
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: z.ZodError
} {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

/**
 * Format Zod errors for display
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  
  error.errors.forEach(err => {
    const path = err.path.join('.')
    errors[path] = err.message
  })
  
  return errors
}

/**
 * Safe parse with error handling
 */
export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string>
} {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  return {
    success: false,
    error: 'Validation failed',
    fieldErrors: formatZodErrors(result.error)
  }
}