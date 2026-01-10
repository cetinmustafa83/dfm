import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const userDataPath = path.join(process.cwd(), 'db', 'json-data', 'user-data.json')

function readUserData() {
  try {
    const data = fs.readFileSync(userDataPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading user data:', error)
    return { users: [], projectRequests: [], payments: [], purchases: [] }
  }
}

function writeUserData(data: any) {
  try {
    fs.writeFileSync(userDataPath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing user data:', error)
    return false
  }
}

// GET user's project requests
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo_user'

    const data = readUserData()
    const userProjects = data.projectRequests.filter((pr: any) => pr.userId === userId)

    return NextResponse.json({
      success: true,
      data: userProjects,
    })
  } catch (error) {
    console.error('Error in GET /api/user/projects:', error)
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
    const data = readUserData()

    const newProject = {
      id: Date.now().toString(),
      userId: body.userId || 'demo_user',
      type: body.type,
      description: body.description,
      budget: body.budget,
      status: body.status || 'draft',
      submittedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    }

    data.projectRequests.push(newProject)
    
    if (writeUserData(data)) {
      return NextResponse.json({
        success: true,
        data: newProject,
        message: 'Project request created successfully',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save project request' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error in POST /api/user/projects:', error)
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
    const { id, userId } = body
    const data = readUserData()

    const index = data.projectRequests.findIndex(
      (pr: any) => pr.id === id && pr.userId === (userId || 'demo_user')
    )
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Project request not found' },
        { status: 404 }
      )
    }

    data.projectRequests[index] = {
      ...data.projectRequests[index],
      ...body,
      id, // Preserve the original ID
      userId: data.projectRequests[index].userId, // Preserve user ID
    }

    if (writeUserData(data)) {
      return NextResponse.json({
        success: true,
        data: data.projectRequests[index],
        message: 'Project request updated successfully',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update project request' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error in PUT /api/user/projects:', error)
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
    const userId = searchParams.get('userId') || 'demo_user'

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const data = readUserData()
    const initialLength = data.projectRequests.length
    
    data.projectRequests = data.projectRequests.filter(
      (pr: any) => !(pr.id === id && pr.userId === userId)
    )

    if (data.projectRequests.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Project request not found' },
        { status: 404 }
      )
    }

    if (writeUserData(data)) {
      return NextResponse.json({
        success: true,
        message: 'Project request deleted successfully',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Failed to delete project request' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error in DELETE /api/user/projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project request' },
      { status: 500 }
    )
  }
}