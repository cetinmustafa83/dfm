import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET all support packages
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'support' // support, language, license
    const activeOnly = searchParams.get('activeOnly') === 'true'
    const status = searchParams.get('status')

    if (type === 'support') {
      const where: any = {}
      if (activeOnly || status) {
        where.status = status || 'active'
      }

      const packages = await prisma.supportPackage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })

      // Parse features JSON string to array
      const formattedPackages = packages.map(pkg => ({
        ...pkg,
        features: JSON.parse(pkg.features || '[]'),
      }))

      return NextResponse.json({
        success: true,
        data: formattedPackages,
      })
    } else if (type === 'language') {
      const where: any = {}
      if (activeOnly || status) {
        where.status = status || 'active'
      }

      const packages = await prisma.languagePackage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({
        success: true,
        data: packages,
      })
    } else if (type === 'license') {
      const where: any = {}
      if (status) {
        where.status = status
      }

      const licenses = await prisma.license.findMany({
        where,
        include: {
          customer: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({
        success: true,
        data: licenses,
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid package type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in GET /api/packages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}

// POST - Create new package
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, ...packageData } = body

    if (type === 'support') {
      const newPackage = await prisma.supportPackage.create({
        data: {
          name: packageData.name,
          description: packageData.description || '',
          price: parseFloat(packageData.price),
          duration: packageData.duration || 1,
          features: JSON.stringify(packageData.features || []),
          status: 'active',
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          ...newPackage,
          features: JSON.parse(newPackage.features),
        },
        message: 'Package created successfully',
      })
    } else if (type === 'language') {
      const newPackage = await prisma.languagePackage.create({
        data: {
          name: packageData.name,
          code: packageData.code,
          flag: packageData.flag || '',
          status: 'active',
          completeness: packageData.completeness || 100,
        },
      })

      return NextResponse.json({
        success: true,
        data: newPackage,
        message: 'Language package created successfully',
      })
    } else if (type === 'license') {
      const license = await prisma.license.create({
        data: {
          customerId: packageData.customerId,
          type: packageData.licenseType || 'extra',
          product: packageData.product,
          key: packageData.key || `LIC-${Date.now()}`,
          status: 'active',
          expiresAt: packageData.expiresAt ? new Date(packageData.expiresAt) : null,
        },
      })

      return NextResponse.json({
        success: true,
        data: license,
        message: 'License created successfully',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid package type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in POST /api/packages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create package' },
      { status: 500 }
    )
  }
}

// PUT - Update package
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, type, ...packageData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Package ID is required' },
        { status: 400 }
      )
    }

    if (type === 'support') {
      const updatedPackage = await prisma.supportPackage.update({
        where: { id },
        data: {
          name: packageData.name,
          description: packageData.description,
          price: packageData.price ? parseFloat(packageData.price) : undefined,
          duration: packageData.duration,
          features: packageData.features ? JSON.stringify(packageData.features) : undefined,
          status: packageData.status,
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          ...updatedPackage,
          features: JSON.parse(updatedPackage.features),
        },
        message: 'Package updated successfully',
      })
    } else if (type === 'language') {
      const updatedPackage = await prisma.languagePackage.update({
        where: { id },
        data: {
          name: packageData.name,
          code: packageData.code,
          flag: packageData.flag,
          status: packageData.status,
          completeness: packageData.completeness,
        },
      })

      return NextResponse.json({
        success: true,
        data: updatedPackage,
        message: 'Language package updated successfully',
      })
    } else if (type === 'license') {
      const updatedLicense = await prisma.license.update({
        where: { id },
        data: {
          type: packageData.licenseType,
          product: packageData.product,
          status: packageData.status,
          expiresAt: packageData.expiresAt ? new Date(packageData.expiresAt) : undefined,
        },
      })

      return NextResponse.json({
        success: true,
        data: updatedLicense,
        message: 'License updated successfully',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid package type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in PUT /api/packages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update package' },
      { status: 500 }
    )
  }
}

// DELETE - Delete package
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type') || 'support'

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Package ID is required' },
        { status: 400 }
      )
    }

    if (type === 'support') {
      await prisma.supportPackage.delete({
        where: { id },
      })
    } else if (type === 'language') {
      await prisma.languagePackage.delete({
        where: { id },
      })
    } else if (type === 'license') {
      await prisma.license.delete({
        where: { id },
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid package type' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    })
  } catch (error) {
    console.error('Error in DELETE /api/packages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete package' },
      { status: 500 }
    )
  }
}