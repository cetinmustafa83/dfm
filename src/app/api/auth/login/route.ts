import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { ApiResponse } from '@/types'

// POST /api/auth/login - Authenticate user
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Validate required fields
    if (!email || !password) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields',
        message: 'Email and password are required'
      }
      
      return NextResponse.json(response, { status: 400 })
    }

    // Authenticate user
    const user = await AuthService.authenticate(email, password)
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      }
      
      return NextResponse.json(response, { status: 401 })
    }

    // Don't return password hash in response
    const { passwordHash, ...userWithoutPassword } = user
    
    const response: ApiResponse<typeof userWithoutPassword> = {
      success: true,
      data: userWithoutPassword,
      message: 'Login successful'
    }
    
    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Login failed',
      message: (error as Error).message
    }
    
    return NextResponse.json(response, { status: 500 })
  }
}