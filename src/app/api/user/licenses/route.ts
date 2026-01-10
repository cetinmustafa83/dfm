import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'db/json-data/licenses.json')

interface License {
  id: string
  projectId: string
  projectName: string
  licenseKey: string
  licenseType: 'single' | 'multi-site' | 'commercial'
  status: 'active' | 'expired' | 'suspended'
  issuedDate: string
  expiryDate: string
  lastUsed: string
  maxSites: number
  currentSites: number
  downloadUrl: string
}

interface LicensesData {
  licenses: License[]
}

function readLicenses(): LicensesData {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { licenses: [] }
  }
}

function writeLicenses(data: LicensesData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// GET - Fetch all licenses
export async function GET() {
  try {
    const data = readLicenses()
    return NextResponse.json({ licenses: data.licenses })
  } catch (error) {
    console.error('Error fetching licenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch licenses' },
      { status: 500 }
    )
  }
}

// POST - Create new license
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = readLicenses()

    const newLicense: License = {
      id: Date.now().toString(),
      projectId: body.projectId,
      projectName: body.projectName,
      licenseKey: `LIC-${Date.now()}-XXXX`,
      licenseType: body.licenseType || 'single',
      status: 'active',
      issuedDate: new Date().toISOString().split('T')[0],
      expiryDate: body.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastUsed: new Date().toISOString().split('T')[0],
      maxSites: body.maxSites || 1,
      currentSites: 0,
      downloadUrl: body.downloadUrl || ''
    }

    data.licenses.push(newLicense)
    writeLicenses(data)

    return NextResponse.json(newLicense, { status: 201 })
  } catch (error) {
    console.error('Error creating license:', error)
    return NextResponse.json(
      { error: 'Failed to create license' },
      { status: 500 }
    )
  }
}

// PUT - Update license
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const data = readLicenses()

    const index = data.licenses.findIndex((l) => l.id === body.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      )
    }

    data.licenses[index] = {
      ...data.licenses[index],
      ...body
    }

    writeLicenses(data)
    return NextResponse.json(data.licenses[index])
  } catch (error) {
    console.error('Error updating license:', error)
    return NextResponse.json(
      { error: 'Failed to update license' },
      { status: 500 }
    )
  }
}

// DELETE - Delete license
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'License ID required' },
        { status: 400 }
      )
    }

    const data = readLicenses()
    data.licenses = data.licenses.filter((l) => l.id !== id)
    writeLicenses(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting license:', error)
    return NextResponse.json(
      { error: 'Failed to delete license' },
      { status: 500 }
    )
  }
}