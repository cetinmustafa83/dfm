// User types
export interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  role: 'admin' | 'customer'
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  isActive: boolean
}

// Project types
export interface Project {
  id: string
  name: string
  description: string
  status: 'draft' | 'in_progress' | 'completed' | 'archived'
  ownerId: string // User ID
  teamMembers?: string[] // User IDs
  createdAt: Date
  updatedAt: Date
  deadline?: Date
  progress: number // 0-100
  licenseId?: string
}

// License types
export interface License {
  id: string
  projectId: string
  customerId: string
  type: 'trial' | 'basic' | 'premium' | 'enterprise'
  status: 'active' | 'expired' | 'suspended' | 'pending'
  createdAt: Date
  expiresAt: Date
  features: string[]
  usageLimits: {
    maxUsers?: number
    maxProjects?: number
    storageGB?: number
  }
}

// Content types
export interface Content {
  id: string
  title: string
  slug: string
  content: string
  type: 'page' | 'blog' | 'service' | 'faq'
  status: 'draft' | 'published' | 'archived'
  authorId: string
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  seoData?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

// Support request types
export interface SupportRequest {
  id: string
  customerId: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  assignedTo?: string // Admin user ID
}

// Analytics types
export interface Analytics {
  id: string
  type: 'page_view' | 'event' | 'conversion'
  userId?: string
  pageUrl: string
  timestamp: Date
  data?: Record<string, any>
}

// Settings types
export interface AppSettings {
  id: string
  key: string
  value: any
  description?: string
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}