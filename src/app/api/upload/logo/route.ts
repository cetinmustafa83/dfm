import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

/**
 * Logo Upload API
 * Handles company logo upload with image optimization
 * 
 * Note: For production, consider using a CDN or cloud storage
 * Install sharp for image optimization: npm install sharp
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'logos')

/**
 * Ensure upload directory exists
 */
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

/**
 * Generate unique filename
 */
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName)
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `logo-${timestamp}-${random}${ext}`
}

/**
 * Optimize image using sharp (if available)
 */
async function optimizeImage(buffer: Buffer, filename: string): Promise<Buffer> {
  try {
    // Dynamic import sharp (may not be installed)
    const sharp = await import('sharp')

    const ext = path.extname(filename).toLowerCase()
    let optimized = sharp.default(buffer)
      .resize(800, 400, {
        fit: 'inside',
        withoutEnlargement: true
      })

    // Convert based on format
    if (ext === '.png') {
      optimized = optimized.png({ quality: 90, compressionLevel: 9 })
    } else if (ext === '.jpg' || ext === '.jpeg') {
      optimized = optimized.jpeg({ quality: 85, progressive: true })
    } else if (ext === '.webp') {
      optimized = optimized.webp({ quality: 85 })
    }

    return await optimized.toBuffer()
  } catch (error) {
    console.log('Sharp not available, using original image')
    return buffer
  }
}

/**
 * POST /api/upload/logo
 * Upload and optimize company logo
 */
export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData()
    const file = formData.get('logo') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`
        },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
        },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Generate filename
    const filename = generateFilename(file.name)
    const filepath = path.join(UPLOAD_DIR, filename)

    // Get file buffer
    const arrayBuffer = await file.arrayBuffer()
    let buffer = Buffer.from(new Uint8Array(arrayBuffer))

    // Optimize image
    buffer = await optimizeImage(buffer as any, filename) as any

    // Save file
    await writeFile(filepath, buffer)

    // Generate URL
    const url = `/uploads/logos/${filename}`

    console.log('Logo uploaded:', {
      filename,
      originalSize: file.size,
      optimizedSize: buffer.length,
      savings: `${(((file.size - buffer.length) / file.size) * 100).toFixed(1)}%`
    })

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: buffer.length
    })
  } catch (error) {
    console.error('Logo upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload logo'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/upload/logo
 * Delete logo file
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      )
    }

    // Validate filename (security)
    if (filename.includes('..') || filename.includes('/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid filename' },
        { status: 400 }
      )
    }

    const filepath = path.join(UPLOAD_DIR, filename)

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete file
    const fs = await import('fs/promises')
    await fs.unlink(filepath)

    console.log('Logo deleted:', filename)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logo deletion error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete logo' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/upload/logo
 * Get upload info
 */
export async function GET() {
  return NextResponse.json({
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeMB: MAX_FILE_SIZE / 1024 / 1024,
    allowedTypes: ALLOWED_TYPES,
    uploadPath: '/uploads/logos/'
  })
}