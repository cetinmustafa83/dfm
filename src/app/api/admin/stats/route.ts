import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // Fetch all counts in parallel for better performance
    const [
      customersCount,
      projectRequestsCount,
      supportPackagesCount,
      paymentsThisMonth,
      templatesCount,
      languagePackagesCount,
      licensesCount,
      blogPostsCount,
      messagesCount,
    ] = await Promise.all([
      prisma.customer.count({
        where: { status: 'active' }
      }),
      prisma.projectRequest.count({
        where: { status: 'pending' }
      }),
      prisma.supportPackage.count({
        where: { status: 'active' }
      }),
      prisma.payment.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.template.count({
        where: { status: 'active' }
      }),
      prisma.languagePackage.count({
        where: { status: 'active' }
      }),
      prisma.license.count({
        where: { status: 'active' }
      }),
      prisma.blogPost.count({
        where: { status: 'published' }
      }),
      prisma.message.count({
        where: { status: 'unread' }
      }),
    ])

    return NextResponse.json({
      customers: customersCount,
      projectRequests: projectRequestsCount,
      supportPackages: supportPackagesCount,
      payments: paymentsThisMonth,
      templates: templatesCount,
      languagePackages: languagePackagesCount,
      extraLicenses: licensesCount,
      blogPosts: blogPostsCount,
      messages: messagesCount,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}