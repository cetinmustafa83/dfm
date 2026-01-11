import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const USER_DATA_FILE = path.join(process.cwd(), 'db/json-data/user-data.json')
const PACKAGES_FILE = path.join(process.cwd(), 'db/json-data/packages.json')
const PROJECTS_FILE = path.join(process.cwd(), 'db/json-data/projects.json')

interface RefundableItem {
  id: string
  type: 'project' | 'package'
  name: string
  amount: number
  date: string
  status: string
  note?: string
}

function readUserData() {
  try {
    const data = fs.readFileSync(USER_DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {
      users: [],
      projectRequests: [],
      payments: [],
      purchases: [],
      paymentMethods: [],
      walletTransactions: [],
      refundRequests: []
    }
  }
}

function readPackages() {
  try {
    const data = fs.readFileSync(PACKAGES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { supportPackages: [], userPackages: [] }
  }
}

function readProjects() {
  try {
    const data = fs.readFileSync(PROJECTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { completedProjects: [] }
  }
}

// GET - Fetch refundable items (active projects and packages only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    const userData = readUserData()
    const packagesData = readPackages()
    const projectsData = readProjects()
    const refundableItems: RefundableItem[] = []

    // Get projects that are refundable
    // BUSINESS RULE: Only projects that have NOT started are refundable
    // Once project status is 'in_progress' or 'draft_approved', the 30% deposit is non-refundable
    const userProjects = userData.projectRequests?.filter(
      (pr: any) => pr.userId === userId &&
        (pr.status === 'pending' || pr.status === 'approved') &&
        pr.status !== 'in_progress' &&
        pr.status !== 'draft_approved' &&
        pr.status !== 'completed' &&
        pr.status !== 'cancelled'
    ) || []

    userProjects.forEach((project: any) => {
      // Find payment for this project (30% deposit)
      const payment = userData.payments?.find((p: any) =>
        p.packageName?.includes(project.type) ||
        p.packageName?.includes('Project')
      )

      // Only 30% deposit is refundable before project starts
      const depositAmount = payment ? parseFloat(payment.amount) : parseFloat(project.budget || 0) * 0.3

      refundableItems.push({
        id: project.id,
        type: 'project',
        name: `${project.type} Project - Deposit`,
        amount: depositAmount,
        date: project.submittedDate || project.createdAt,
        status: project.status,
        note: '30% deposit - Only refundable before project starts'
      })
    })

    // Get user's active packages
    const userPackages = packagesData.userPackages?.filter(
      (up: any) => up.userId === userId && up.status === 'active'
    ) || []

    userPackages.forEach((userPackage: any) => {
      const packageDetails = packagesData.supportPackages?.find(
        (p: any) => p.id === userPackage.packageId
      )

      if (packageDetails) {
        refundableItems.push({
          id: userPackage.id,
          type: 'package',
          name: packageDetails.name,
          amount: parseFloat(packageDetails.price),
          date: userPackage.purchaseDate,
          status: 'active'
        })
      }
    })

    // Filter out items that already have pending refund requests
    const existingRefunds = userData.refundRequests?.filter(
      (r: any) => r.userId === userId && r.status === 'pending'
    ) || []

    const filteredItems = refundableItems.filter(item => {
      return !existingRefunds.some((refund: any) =>
        refund.orderId === item.id
      )
    })

    return NextResponse.json({
      success: true,
      data: filteredItems
    })
  } catch (error) {
    console.error('Error fetching refundable items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch refundable items' },
      { status: 500 }
    )
  }
}