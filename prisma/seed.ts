import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.message.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.license.deleteMany()
  await prisma.languagePackage.deleteMany()
  await prisma.template.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.supportPackage.deleteMany()
  await prisma.projectRequest.deleteMany()
  await prisma.customer.deleteMany()

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        phone: '+49 123 456789',
        company: 'Tech Solutions GmbH',
        status: 'active',
      },
    }),
    prisma.customer.create({
      data: {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        phone: '+49 987 654321',
        company: 'Digital Innovations',
        status: 'active',
      },
    }),
    prisma.customer.create({
      data: {
        email: 'mike.johnson@example.com',
        name: 'Mike Johnson',
        phone: '+49 555 123456',
        status: 'active',
      },
    }),
    prisma.customer.create({
      data: {
        email: 'sarah.williams@example.com',
        name: 'Sarah Williams',
        company: 'Creative Studio',
        status: 'active',
      },
    }),
    prisma.customer.create({
      data: {
        email: 'david.brown@example.com',
        name: 'David Brown',
        phone: '+49 444 789012',
        company: 'StartUp Inc',
        status: 'active',
      },
    }),
  ])

  console.log(`✅ Created ${customers.length} customers`)

  // Create Project Requests
  const projectRequests = await Promise.all([
    prisma.projectRequest.create({
      data: {
        customerId: customers[0].id,
        title: 'E-Commerce Website Development',
        description: 'Need a modern e-commerce platform with payment integration',
        budget: 15000,
        status: 'pending',
        priority: 'high',
      },
    }),
    prisma.projectRequest.create({
      data: {
        customerId: customers[1].id,
        title: 'Mobile App Development',
        description: 'iOS and Android app for our business',
        budget: 25000,
        status: 'pending',
        priority: 'urgent',
      },
    }),
    prisma.projectRequest.create({
      data: {
        customerId: customers[2].id,
        title: 'Website Redesign',
        description: 'Modernize our existing corporate website',
        budget: 8000,
        status: 'pending',
        priority: 'medium',
      },
    }),
    prisma.projectRequest.create({
      data: {
        customerId: customers[3].id,
        title: 'Custom CMS Development',
        description: 'Need a custom content management system',
        budget: 12000,
        status: 'in_progress',
        priority: 'high',
      },
    }),
    prisma.projectRequest.create({
      data: {
        customerId: customers[4].id,
        title: 'API Integration',
        description: 'Integrate third-party APIs into our system',
        budget: 5000,
        status: 'pending',
        priority: 'low',
      },
    }),
  ])

  console.log(`✅ Created ${projectRequests.length} project requests`)

  // Create Support Packages
  const supportPackages = await Promise.all([
    prisma.supportPackage.create({
      data: {
        name: 'Basic Support',
        description: 'Essential support for small businesses',
        price: 99.99,
        duration: 1,
        status: 'active',
        features: JSON.stringify(['Email Support', '5 Hours/Month', 'Bug Fixes']),
      },
    }),
    prisma.supportPackage.create({
      data: {
        name: 'Professional Support',
        description: 'Advanced support for growing businesses',
        price: 299.99,
        duration: 1,
        status: 'active',
        features: JSON.stringify(['Priority Email Support', '20 Hours/Month', 'Bug Fixes', 'Feature Updates']),
      },
    }),
    prisma.supportPackage.create({
      data: {
        name: 'Enterprise Support',
        description: 'Premium support for large organizations',
        price: 999.99,
        duration: 1,
        status: 'active',
        features: JSON.stringify(['24/7 Phone Support', 'Unlimited Hours', 'Dedicated Account Manager', 'Custom Development']),
      },
    }),
    prisma.supportPackage.create({
      data: {
        name: 'Quarterly Support',
        description: '3-month support package',
        price: 799.99,
        duration: 3,
        status: 'active',
        features: JSON.stringify(['Email Support', '50 Hours Total', 'Priority Bug Fixes']),
      },
    }),
    prisma.supportPackage.create({
      data: {
        name: 'Annual Support',
        description: 'Best value yearly support',
        price: 2999.99,
        duration: 12,
        status: 'active',
        features: JSON.stringify(['All Features Included', '200 Hours/Year', 'Free Minor Updates']),
      },
    }),
  ])

  console.log(`✅ Created ${supportPackages.length} support packages`)

  // Create Payments
  const payments = await Promise.all([
    ...Array.from({ length: 23 }, (_, i) => {
      const customer = customers[i % customers.length]
      return prisma.payment.create({
        data: {
          customerId: customer.id,
          amount: Math.floor(Math.random() * 5000) + 500,
          currency: 'EUR',
          status: i % 5 === 0 ? 'pending' : 'completed',
          paymentMethod: ['paypal', 'mollie', 'stripe'][i % 3],
          description: `Payment for services #${i + 1}`,
          createdAt: new Date(2024, 11, Math.floor(Math.random() * 24) + 1),
        },
      })
    }),
  ])

  console.log(`✅ Created ${payments.length} payments`)

  // Create Templates
  const templates = await Promise.all([
    ...Array.from({ length: 42 }, (_, i) => {
      const categories = ['business', 'portfolio', 'blog', 'ecommerce', 'landing']
      return prisma.template.create({
        data: {
          name: `Template ${i + 1}`,
          description: `Professional ${categories[i % categories.length]} template`,
          category: categories[i % categories.length],
          price: Math.floor(Math.random() * 200) + 29,
          status: i % 10 === 0 ? 'draft' : 'active',
          downloads: Math.floor(Math.random() * 1000),
          rating: 3 + Math.random() * 2,
        },
      })
    }),
  ])

  console.log(`✅ Created ${templates.length} templates`)

  // Create Language Packages
  const languagePackages = await Promise.all([
    prisma.languagePackage.create({
      data: { name: 'English', code: 'en', flag: '🇺🇸', status: 'active', completeness: 100 },
    }),
    prisma.languagePackage.create({
      data: { name: 'German', code: 'de', flag: '🇩🇪', status: 'active', completeness: 100 },
    }),
    prisma.languagePackage.create({
      data: { name: 'French', code: 'fr', flag: '🇫🇷', status: 'active', completeness: 95 },
    }),
    prisma.languagePackage.create({
      data: { name: 'Spanish', code: 'es', flag: '🇪🇸', status: 'active', completeness: 98 },
    }),
    prisma.languagePackage.create({
      data: { name: 'Italian', code: 'it', flag: '🇮🇹', status: 'active', completeness: 90 },
    }),
    prisma.languagePackage.create({
      data: { name: 'Portuguese', code: 'pt', flag: '🇵🇹', status: 'active', completeness: 85 },
    }),
    prisma.languagePackage.create({
      data: { name: 'Dutch', code: 'nl', flag: '🇳🇱', status: 'active', completeness: 92 },
    }),
    prisma.languagePackage.create({
      data: { name: 'Polish', code: 'pl', flag: '🇵🇱', status: 'active', completeness: 88 },
    }),
    prisma.languagePackage.create({
      data: { name: 'Russian', code: 'ru', flag: '🇷🇺', status: 'active', completeness: 80 },
    }),
    prisma.languagePackage.create({
      data: { name: 'Japanese', code: 'ja', flag: '🇯🇵', status: 'active', completeness: 75 },
    }),
    prisma.languagePackage.create({
      data: { name: 'Chinese', code: 'zh', flag: '🇨🇳', status: 'active', completeness: 70 },
    }),
    prisma.languagePackage.create({
      data: { name: 'Korean', code: 'ko', flag: '🇰🇷', status: 'active', completeness: 65 },
    }),
  ])

  console.log(`✅ Created ${languagePackages.length} language packages`)

  // Create Licenses
  const licenses = await Promise.all([
    ...customers.slice(0, 5).map((customer, i) =>
      prisma.license.create({
        data: {
          customerId: customer.id,
          type: ['extra', 'premium', 'enterprise'][i % 3],
          product: `Product ${i + 1}`,
          key: `LIC-${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
          status: 'active',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      })
    ),
    ...customers.slice(0, 2).map((customer, i) =>
      prisma.license.create({
        data: {
          customerId: customer.id,
          type: 'extra',
          product: `Extra Product ${i + 1}`,
          key: `LIC-${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
          status: 'active',
        },
      })
    ),
  ])

  console.log(`✅ Created ${licenses.length} licenses`)

  // Create Blog Posts
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: 'Getting Started with Web Development',
        slug: 'getting-started-web-development',
        content: 'Learn the basics of web development...',
        excerpt: 'A comprehensive guide for beginners',
        author: 'Admin Team',
        status: 'published',
        publishedAt: new Date(),
        views: 1250,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Best Practices for React Development',
        slug: 'react-best-practices',
        content: 'Explore React development patterns...',
        excerpt: 'Improve your React skills',
        author: 'Admin Team',
        status: 'published',
        publishedAt: new Date(),
        views: 980,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Introduction to TypeScript',
        slug: 'intro-typescript',
        content: 'TypeScript basics and advanced features...',
        excerpt: 'Learn TypeScript from scratch',
        author: 'Admin Team',
        status: 'published',
        publishedAt: new Date(),
        views: 756,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Modern CSS Techniques',
        slug: 'modern-css-techniques',
        content: 'CSS Grid, Flexbox, and more...',
        excerpt: 'Master modern CSS',
        author: 'Admin Team',
        status: 'published',
        publishedAt: new Date(),
        views: 642,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'API Design Best Practices',
        slug: 'api-design-best-practices',
        content: 'Design RESTful APIs the right way...',
        excerpt: 'Build better APIs',
        author: 'Admin Team',
        status: 'published',
        publishedAt: new Date(),
        views: 890,
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Database Optimization Tips',
        slug: 'database-optimization',
        content: 'Optimize your database queries...',
        excerpt: 'Speed up your database',
        author: 'Admin Team',
        status: 'published',
        publishedAt: new Date(),
        views: 534,
      },
    }),
  ])

  console.log(`✅ Created ${blogPosts.length} blog posts`)

  // Create Messages
  const messages = await Promise.all([
    prisma.message.create({
      data: {
        name: 'Alice Cooper',
        email: 'alice@example.com',
        subject: 'Question about pricing',
        message: 'I would like to know more about your pricing plans.',
        status: 'unread',
      },
    }),
  ])

  console.log(`✅ Created ${messages.length} messages`)

  console.log('✨ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })