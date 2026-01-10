/**
 * Centralized Error Handling and Logging System
 * Provides consistent error handling across the application
 */

export enum ErrorType {
  PAYMENT = 'PAYMENT',
  AI = 'AI',
  DATABASE = 'DATABASE',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN'
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

interface ErrorLog {
  timestamp: string
  level: LogLevel
  type: ErrorType
  message: string
  error?: any
  context?: Record<string, any>
  stack?: string
}

interface Logger {
  debug(message: string, context?: Record<string, any>): void
  info(message: string, context?: Record<string, any>): void
  warn(message: string, context?: Record<string, any>): void
  error(message: string, error?: any, context?: Record<string, any>): void
  fatal(message: string, error?: any, context?: Record<string, any>): void
}

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType = ErrorType.UNKNOWN,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Payment-specific error
 */
export class PaymentError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, ErrorType.PAYMENT, statusCode, true)
  }
}

/**
 * AI-specific error
 */
export class AIError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, ErrorType.AI, statusCode, true)
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, ErrorType.VALIDATION, 400, true)
  }
}

/**
 * Log error to console and external service (if configured)
 */
function logError(log: ErrorLog): void {
  const formattedLog = {
    ...log,
    timestamp: new Date().toISOString()
  }

  // Console logging with colors
  const colors = {
    DEBUG: '\x1b[36m',
    INFO: '\x1b[32m',
    WARN: '\x1b[33m',
    ERROR: '\x1b[31m',
    FATAL: '\x1b[35m',
    RESET: '\x1b[0m'
  }

  const color = colors[log.level] || colors.RESET
  console.log(
    `${color}[${log.level}]${colors.RESET} ${log.timestamp} [${log.type}] ${log.message}`,
    log.context || ''
  )

  if (log.error) {
    console.error(log.error)
  }

  // TODO: Send to external logging service (e.g., Sentry, LogRocket)
  // if (process.env.NODE_ENV === 'production') {
  //   sendToLoggingService(formattedLog)
  // }

  // TODO: Store critical errors in database
  // if (log.level === LogLevel.ERROR || log.level === LogLevel.FATAL) {
  //   storeCriticalError(formattedLog)
  // }
}

/**
 * Create logger for specific error type
 */
export function createLogger(type: ErrorType): Logger {
  return {
    debug(message: string, context?: Record<string, any>): void {
      logError({
        timestamp: new Date().toISOString(),
        level: LogLevel.DEBUG,
        type,
        message,
        context
      })
    },

    info(message: string, context?: Record<string, any>): void {
      logError({
        timestamp: new Date().toISOString(),
        level: LogLevel.INFO,
        type,
        message,
        context
      })
    },

    warn(message: string, context?: Record<string, any>): void {
      logError({
        timestamp: new Date().toISOString(),
        level: LogLevel.WARN,
        type,
        message,
        context
      })
    },

    error(message: string, error?: any, context?: Record<string, any>): void {
      logError({
        timestamp: new Date().toISOString(),
        level: LogLevel.ERROR,
        type,
        message,
        error,
        context,
        stack: error?.stack
      })
    },

    fatal(message: string, error?: any, context?: Record<string, any>): void {
      logError({
        timestamp: new Date().toISOString(),
        level: LogLevel.FATAL,
        type,
        message,
        error,
        context,
        stack: error?.stack
      })
    }
  }
}

/**
 * Global error handler for unhandled errors
 */
export function handleError(error: Error | AppError): {
  message: string
  statusCode: number
  type: ErrorType
} {
  const logger = createLogger(ErrorType.UNKNOWN)

  if (error instanceof AppError) {
    // Operational error - log and return
    logger.error(error.message, error, {
      type: error.type,
      statusCode: error.statusCode,
      isOperational: error.isOperational
    })

    return {
      message: error.message,
      statusCode: error.statusCode,
      type: error.type
    }
  }

  // Unknown error - log as fatal
  logger.fatal('Unhandled error occurred', error)

  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
    type: ErrorType.UNKNOWN
  }
}

/**
 * Async error wrapper for API routes
 */
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      const handled = handleError(error as Error)
      throw new AppError(handled.message, handled.type, handled.statusCode)
    }
  }
}

/**
 * Payment logger
 */
export const paymentLogger = createLogger(ErrorType.PAYMENT)

/**
 * AI logger
 */
export const aiLogger = createLogger(ErrorType.AI)

/**
 * Database logger
 */
export const dbLogger = createLogger(ErrorType.DATABASE)

/**
 * Validation logger
 */
export const validationLogger = createLogger(ErrorType.VALIDATION)

/**
 * Format error for API response
 */
export function formatErrorResponse(error: Error | AppError): {
  success: false
  error: string
  type?: ErrorType
  statusCode?: number
} {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      type: error.type,
      statusCode: error.statusCode
    }
  }

  return {
    success: false,
    error: error.message || 'An unexpected error occurred'
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt)
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('Max retries exceeded')
}

/**
 * Rate limiter (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

/**
 * Clear rate limit records (cleanup)
 */
export function clearRateLimitRecords(): void {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

// Cleanup rate limit records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(clearRateLimitRecords, 5 * 60 * 1000)
}