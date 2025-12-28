import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all templates
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status') || 'active'

    const where: any = {}

    // Filter by status
    if (status !== 'all') {
      where.status = status
    }

    // Filter by category
    if (category && category !== 'all') {
      where.category = category
    }

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: templates,
    })
  } catch (error) {
    console.error('Error in GET /api/templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST - Create new template (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newTemplate = await prisma.template.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price || 0,
        previewUrl: body.previewUrl || null,
        downloadUrl: body.downloadUrl || null,
        status: body.status || 'active',
        downloads: 0,
        rating: body.rating || null,
      }
    })

    return NextResponse.json({
      success: true,
      data: newTemplate,
      message: 'Template created successfully',
    })
  } catch (error) {
    console.error('Error in POST /api/templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create template' },
      { status: 500 }
    )
  }
}

// PUT - Update template (Admin only)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      )
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
      message: 'Template updated successfully',
    })
  } catch (error) {
    console.error('Error in PUT /api/templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update template' },
      { status: 500 }
    )
  }
}

// DELETE - Delete template (Admin only)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      )
    }

    await prisma.template.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    })
  } catch (error) {
    console.error('Error in DELETE /api/templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}