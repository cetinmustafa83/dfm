import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const message = await prisma.message.update({
      where: { id },
      data: {
        deleted: false,
        deletedAt: null
      }
    })
    return NextResponse.json(message)
  } catch (error) {
    console.error('Error restoring message:', error)
    return NextResponse.json(
      { error: 'Failed to restore message' },
      { status: 500 }
    )
  }
}