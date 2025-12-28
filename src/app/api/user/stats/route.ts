import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const userDataPath = path.join(process.cwd(), 'db', 'json-data', 'user-data.json')
const packagesPath = path.join(process.cwd(), 'db', 'json-data', 'packages.json')

function readUserData() {
  try {
    const data = fs.readFileSync(userDataPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading user data:', error)
    return { users: [], projectRequests: [], payments: [], purchases: [] }
  }
}

function readPackages() {
  try {
    const data = fs.readFileSync(packagesPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading packages:', error)
    return { supportPackages: [], userPackages: [] }
  }
}

// GET user dashboard statistics
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo_user'

    const userData = readUserData()
    const packagesData = readPackages()

    // Count project requests for this user
    const projectRequests = userData.projectRequests.filter(
      (pr: any) => pr.userId === userId
    ).length

    // Count active support packages for this user
    const supportPackages = packagesData.userPackages.filter(
      (up: any) => up.userId === userId && up.status === 'active'
    ).length

    // Count payments this month for this user
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const payments = userData.payments.filter((payment: any) => {
      if (payment.userId !== userId) return false
      const paymentDate = new Date(payment.date)
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear
    }).length

    // Count total purchases for this user
    const purchases = userData.purchases.filter(
      (purchase: any) => purchase.userId === userId
    ).length

    return NextResponse.json({
      success: true,
      data: {
        projectRequests,
        supportPackages,
        payments,
        purchases,
      },
    })
  } catch (error) {
    console.error('Error in GET /api/user/stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user statistics' },
      { status: 500 }
    )
  }
}