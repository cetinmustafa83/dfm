import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET all payments for admin
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type') // customer or all

    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: payments,
    })
  } catch (error) {
    console.error('Error in GET /api/admin/payments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// POST - Create new payment
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
          status: 'active',
        },
      })
    }

    const newPayment = await prisma.payment.create({
      data: {
        customerId: customer.id,
        amount: parseFloat(body.amount),
        currency: body.currency || 'EUR',
        status: body.status || 'pending',
        paymentMethod: body.paymentMethod || 'manual',
        description: body.description || '',
        invoiceUrl: body.invoiceUrl,
      },
      include: {
        customer: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: newPayment,
      message: 'Payment created successfully',
    })
  } catch (error) {
    console.error('Error in POST /api/admin/payments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}

// PUT - Update payment
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...paymentData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (paymentData.amount) updateData.amount = parseFloat(paymentData.amount)
    if (paymentData.status) updateData.status = paymentData.status
    if (paymentData.description !== undefined) updateData.description = paymentData.description
    if (paymentData.invoiceUrl !== undefined) updateData.invoiceUrl = paymentData.invoiceUrl

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedPayment,
      message: 'Payment updated successfully',
    })
  } catch (error) {
    console.error('Error in PUT /api/admin/payments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}

// DELETE - Delete payment
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    await prisma.payment.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Payment deleted successfully',
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/payments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete payment' },
      { status: 500 }
    )
  }
}