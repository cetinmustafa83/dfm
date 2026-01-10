import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all marketplace items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const productType = searchParams.get('productType')
    const paymentType = searchParams.get('paymentType')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    const where: any = {}

    // Filter by category
    if (category && category !== 'all') {
      where.category = category
    }

    // Filter by product type
    if (productType && productType !== 'all') {
      where.productType = productType
    }

    // Filter by payment type
    if (paymentType && paymentType !== 'all') {
      where.paymentType = paymentType
    }

    // Filter by featured
    if (featured === 'true') {
      where.featured = true
    }

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const items = await prisma.marketplaceItem.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Parse JSON fields
    const formattedItems = items.map(item => ({
      ...item,
      technologies: JSON.parse(item.technologies || '[]'),
      features: JSON.parse(item.features || '[]'),
      includedItems: JSON.parse(item.includedItems || '[]')
    }))

    return NextResponse.json({
      success: true,
      data: formattedItems,
    })
  } catch (error) {
    console.error('Error in GET /api/marketplace:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch marketplace items' },
      { status: 500 }
    )
  }
}

// POST - Create new marketplace item (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newItem = await prisma.marketplaceItem.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        productType: body.productType,
        price: body.price || 0,
        currency: body.currency || 'EUR',
        paymentType: body.paymentType || 'one-time',
        featured: body.featured || false,
        image: body.image || null,
        demoUrl: body.demoUrl || null,
        downloadUrl: body.downloadUrl || null,
        technologies: JSON.stringify(body.technologies || []),
        features: JSON.stringify(body.features || []),
        version: body.version || '1.0.0',
        status: body.status || 'active',
        licenses: body.licenses || 1,
        downloadLimit: body.downloadLimit || 0,
        downloadLimitType: body.downloadLimitType || 'unlimited',
        downloadExpiry: body.downloadExpiry ? new Date(body.downloadExpiry) : null,
        includedItems: JSON.stringify(body.includedItems || [])
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...newItem,
        technologies: JSON.parse(newItem.technologies),
        features: JSON.parse(newItem.features),
        includedItems: JSON.parse(newItem.includedItems)
      },
      message: 'Marketplace item created successfully',
    })
  } catch (error) {
    console.error('Error in POST /api/marketplace:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create marketplace item' },
      { status: 500 }
    )
  }
}

// PUT - Update marketplace item (Admin only)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Prepare update data with JSON stringified arrays
    const data: any = {}
    if (updateData.name !== undefined) data.name = updateData.name
    if (updateData.description !== undefined) data.description = updateData.description
    if (updateData.category !== undefined) data.category = updateData.category
    if (updateData.productType !== undefined) data.productType = updateData.productType
    if (updateData.price !== undefined) data.price = updateData.price
    if (updateData.currency !== undefined) data.currency = updateData.currency
    if (updateData.paymentType !== undefined) data.paymentType = updateData.paymentType
    if (updateData.featured !== undefined) data.featured = updateData.featured
    if (updateData.image !== undefined) data.image = updateData.image
    if (updateData.demoUrl !== undefined) data.demoUrl = updateData.demoUrl
    if (updateData.downloadUrl !== undefined) data.downloadUrl = updateData.downloadUrl
    if (updateData.technologies !== undefined) data.technologies = JSON.stringify(updateData.technologies)
    if (updateData.features !== undefined) data.features = JSON.stringify(updateData.features)
    if (updateData.version !== undefined) data.version = updateData.version
    if (updateData.status !== undefined) data.status = updateData.status
    if (updateData.licenses !== undefined) data.licenses = updateData.licenses
    if (updateData.downloadLimit !== undefined) data.downloadLimit = updateData.downloadLimit
    if (updateData.downloadLimitType !== undefined) data.downloadLimitType = updateData.downloadLimitType
    if (updateData.downloadExpiry !== undefined) data.downloadExpiry = updateData.downloadExpiry ? new Date(updateData.downloadExpiry) : null
    if (updateData.includedItems !== undefined) data.includedItems = JSON.stringify(updateData.includedItems)

    const updatedItem = await prisma.marketplaceItem.update({
      where: { id },
      data
    })

    return NextResponse.json({
      success: true,
      data: {
        ...updatedItem,
        technologies: JSON.parse(updatedItem.technologies),
        features: JSON.parse(updatedItem.features),
        includedItems: JSON.parse(updatedItem.includedItems)
      },
      message: 'Marketplace item updated successfully',
    })
  } catch (error) {
    console.error('Error in PUT /api/marketplace:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update marketplace item' },
      { status: 500 }
    )
  }
}

// DELETE - Delete marketplace item (Admin only)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      )
    }

    await prisma.marketplaceItem.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Marketplace item deleted successfully',
    })
  } catch (error) {
    console.error('Error in DELETE /api/marketplace:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete marketplace item' },
      { status: 500 }
    )
  }
}