import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all project requests for admin
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const projectRequests = await prisma.projectRequest.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: projectRequests,
    })
  } catch (error) {
    console.error('Error in GET /api/admin/project-requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project requests' },
      { status: 500 }
    )
  }
}

// POST - Create new project request
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // First check if customer exists, if not create one
    let customer = await prisma.customer.findUnique({
      where: { email: body.customerEmail },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: body.customerName,
          email: body.customerEmail,
          phone: body.customerPhone,
          status: 'active',
        },
      })
    }

    const newRequest = await prisma.projectRequest.create({
      data: {
        customerId: customer.id,
        title: body.title || body.projectType,
        description: body.description,
        budget: body.budget ? parseFloat(body.budget) : null,
        status: body.status || 'pending',
        priority: body.priority || 'medium',
      },
      include: {
        customer: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: newRequest,
      message: 'Project request created successfully',
    })
  } catch (error) {
    console.error('Error in POST /api/admin/project-requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project request' },
      { status: 500 }
    )
  }
}

// PUT - Update project request
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...requestData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Project request ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (requestData.title) updateData.title = requestData.title
    if (requestData.description) updateData.description = requestData.description
    if (requestData.budget !== undefined) {
      updateData.budget = requestData.budget ? parseFloat(requestData.budget) : null
    }
    if (requestData.status) updateData.status = requestData.status
    if (requestData.priority) updateData.priority = requestData.priority

    const updatedRequest = await prisma.projectRequest.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: 'Project request updated successfully',
    })
  } catch (error) {
    console.error('Error in PUT /api/admin/project-requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project request' },
      { status: 500 }
    )
  }
}

// DELETE - Delete project request
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Project request ID is required' },
        { status: 400 }
      )
    }

    await prisma.projectRequest.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Project request deleted successfully',
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/project-requests:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project request' },
      { status: 500 }
    )
  }
}