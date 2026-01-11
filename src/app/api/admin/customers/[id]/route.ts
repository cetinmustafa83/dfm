import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AppError } from '@/lib/error-handler'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                projectRequests: true,
                payments: true
            }
        })

        if (!customer) {
            return NextResponse.json(
                { error: 'Customer not found' },
                { status: 404 }
            )
        }

        // Transform data to match frontend expectations
        // Note: We might need to adjust frontend interfaces or this transform
        // For now, we return what we have, plus placeholders for missing relations if needed

        // Determine status based on projects or logic
        const status = customer.status || 'active'

        const transformedData = {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone || '',
            company: customer.company || '',
            address: '', // Address field does not exist in schema
            joinedDate: customer.createdAt.toISOString().split('T')[0],
            status,
            // Map projectRequests to projects
            projects: customer.projectRequests.map(p => ({
                id: p.id,
                type: p.title,
                budget: p.budget ? `${p.budget} €` : 'N/A',
                status: p.status,
                submittedDate: p.createdAt.toISOString().split('T')[0]
            })),
            invoices: [], // Pending Invoice model
            licenses: [], // Pending License model
            supportPackages: [] // Pending SupportPackage model
        }

        return NextResponse.json({ success: true, data: transformedData })
    } catch (error) {
        console.error('Error fetching customer:', error)
        return NextResponse.json(
            { error: 'Failed to fetch customer' },
            { status: 500 }
        )
    }
}
