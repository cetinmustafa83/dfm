import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ticketsPath = path.join(process.cwd(), 'db', 'json-data', 'tickets.json')

function readTickets() {
  try {
    const data = fs.readFileSync(ticketsPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading tickets:', error)
    return { tickets: [] }
  }
}

function writeTickets(data: any) {
  try {
    fs.writeFileSync(ticketsPath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing tickets:', error)
    return false
  }
}

// GET user's tickets
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo_user'

    const data = readTickets()
    const userTickets = data.tickets.filter((ticket: any) => ticket.userId === userId)

    return NextResponse.json({
      success: true,
      data: userTickets,
    })
  } catch (error) {
    console.error('Error in GET /api/user/tickets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

// POST - Create new ticket
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = readTickets()

    const newTicket = {
      id: Date.now().toString(),
      userId: body.userId || 'demo_user',
      subject: body.subject,
      category: body.category,
      priority: body.priority,
      message: body.message,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      responses: [],
      attachments: body.attachments || [],
    }

    data.tickets.push(newTicket)
    
    if (writeTickets(data)) {
      return NextResponse.json({
        success: true,
        data: newTicket,
        message: 'Ticket created successfully',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save ticket' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error in POST /api/user/tickets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}

// PUT - Update ticket or add response
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, userId, response } = body
    const data = readTickets()

    const index = data.tickets.findIndex(
      (ticket: any) => ticket.id === id && ticket.userId === (userId || 'demo_user')
    )
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // If adding a response
    if (response) {
      const newResponse = {
        id: `r${Date.now()}`,
        message: response.message,
        author: response.author || 'user',
        createdAt: new Date().toISOString(),
      }
      data.tickets[index].responses.push(newResponse)
      data.tickets[index].updatedAt = new Date().toISOString().split('T')[0]
    } else {
      // Update ticket fields
      data.tickets[index] = {
        ...data.tickets[index],
        ...body,
        id, // Preserve ID
        userId: data.tickets[index].userId, // Preserve user ID
        updatedAt: new Date().toISOString().split('T')[0],
      }
    }

    if (writeTickets(data)) {
      return NextResponse.json({
        success: true,
        data: data.tickets[index],
        message: 'Ticket updated successfully',
      })
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error in PUT /api/user/tickets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}