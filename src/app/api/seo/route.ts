import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const seo = await prisma.sEO.findMany({
      orderBy: { updatedAt: 'desc' }
    })
    return NextResponse.json({ seo: seo.length > 0 ? seo[0] : null })
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
    return NextResponse.json({ seo: null }, { status: 200 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, ...data } = body
    
    await prisma.sEO.upsert({
      where: { page: page || 'home' },
      update: data,
      create: { page: page || 'home', ...data }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating SEO settings:', error)
    return NextResponse.json(
      { error: 'Failed to update SEO settings' },
      { status: 500 }
    )
  }
}
