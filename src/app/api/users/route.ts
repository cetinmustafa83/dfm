import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { User, ApiResponse } from '@/types'

// GET /api/users - Get all users
export async function GET() {
  try {
    // In a real application, you would add authentication and authorization here
    // For now, we'll just return all users (not recommended for production)
    
    const response: ApiResponse = {
      success: false,
      error: 'Not implemented',
      message: 'User listing requires authentication'
    }
    
    return NextResponse.json(response, { status: 401 })
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to retrieve users',
      message: (error as Error).message
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const { email, name, password, role, isActive } = await request.json()
    
    // Validate required fields
    if (!email || !name || !password) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields',
        message: 'Email, name, and password are required'
      }
      
      return NextResponse.json(response, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await AuthService.getUserByEmail(email)
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: 'User already exists',
        message: 'A user with this email already exists'
      }
      
      return NextResponse.json(response, { status: 409 })
    }

    // Create user
    const user = await AuthService.createUser({
      email,
      name,
      password,
      role: role || 'customer',
      isActive: isActive !== undefined ? isActive : true
    })

    // Don't return password hash in response
    const { passwordHash, ...userWithoutPassword } = user
    
    const response: ApiResponse<typeof userWithoutPassword> = {
      success: true,
      data: userWithoutPassword,
      message: 'User created successfully'
    }
    
    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create user',
      message: (error as Error).message
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}