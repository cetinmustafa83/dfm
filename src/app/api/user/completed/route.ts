import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'db/json-data/completed-projects.json')

interface CompletedProject {
  id: string
  title: string
  category: string
  description: string
  price: number
  licenseKey: string
  licenseType: string
  licenseStatus: string
  expiryDate: string
  lastUsed: string
  downloadUrl: string
  completedAt: string
}

interface CompletedProjectsData {
  completedProjects: CompletedProject[]
}

function readCompletedProjects(): CompletedProjectsData {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { completedProjects: [] }
  }
}

function writeCompletedProjects(data: CompletedProjectsData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// GET - Fetch all completed projects
export async function GET() {
  try {
    const data = readCompletedProjects()
    return NextResponse.json({ completedProjects: data.completedProjects })
  } catch (error) {
    console.error('Error fetching completed projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch completed projects' },
      { status: 500 }
    )
  }
}

// POST - Create new completed project
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = readCompletedProjects()

    const newProject: CompletedProject = {
      id: Date.now().toString(),
      title: body.title,
      category: body.category,
      description: body.description,
      price: body.price,
      licenseKey: `LIC-${Date.now()}-XXXX`,
      licenseType: body.licenseType || 'single',
      licenseStatus: 'active',
      expiryDate: body.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastUsed: new Date().toISOString().split('T')[0],
      downloadUrl: body.downloadUrl || '',
      completedAt: new Date().toISOString().split('T')[0]
    }

    data.completedProjects.push(newProject)
    writeCompletedProjects(data)

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('Error creating completed project:', error)
    return NextResponse.json(
      { error: 'Failed to create completed project' },
      { status: 500 }
    )
  }
}

// PUT - Update completed project
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const data = readCompletedProjects()

    const index = data.completedProjects.findIndex((p) => p.id === body.id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Completed project not found' },
        { status: 404 }
      )
    }

    data.completedProjects[index] = {
      ...data.completedProjects[index],
      ...body
    }

    writeCompletedProjects(data)
    return NextResponse.json(data.completedProjects[index])
  } catch (error) {
    console.error('Error updating completed project:', error)
    return NextResponse.json(
      { error: 'Failed to update completed project' },
      { status: 500 }
    )
  }
}

// DELETE - Delete completed project
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID required' },
        { status: 400 }
      )
    }

    const data = readCompletedProjects()
    data.completedProjects = data.completedProjects.filter((p) => p.id !== id)
    writeCompletedProjects(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting completed project:', error)
    return NextResponse.json(
      { error: 'Failed to delete completed project' },
      { status: 500 }
    )
  }
}