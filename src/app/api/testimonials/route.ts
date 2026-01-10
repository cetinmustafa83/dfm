import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        status: 'active'
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, company, position, image, content, rating, featured } = body

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        company: company || null,
        position: position || null,
        image: image || null,
        content,
        rating: rating || 5,
        featured: featured || false,
        status: 'active'
      }
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}