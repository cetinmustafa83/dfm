import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Helper function to read JSON files
function readJsonFile(filePath: string): any {
  const fullPath = path.join(process.cwd(), 'db', 'json-data', filePath)
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`)
    return null
  }
  const data = fs.readFileSync(fullPath, 'utf-8')
  return JSON.parse(data)
}

async function migrateData() {
  console.log('🚀 Starting JSON to SQLite migration...\n')

  try {
    // 1. Migrate Blog Posts
    console.log('📝 Migrating blog posts...')
    const blogData = readJsonFile('blog.json')
    if (blogData?.posts) {
      for (const post of blogData.posts) {
        await prisma.blogPost.upsert({
          where: { slug: post.title.toLowerCase().replace(/\s+/g, '-') },
          update: {},
          create: {
            title: post.title,
            slug: post.title.toLowerCase().replace(/\s+/g, '-'),
            content: post.content,
            excerpt: post.excerpt,
            coverImage: post.image,
            author: post.author,
            status: 'published',
            publishedAt: new Date(post.date),
            views: 0,
          },
        })
      }
      console.log(`✅ Migrated ${blogData.posts.length} blog posts`)
    }

    // 2. Migrate Projects
    console.log('📂 Migrating projects...')
    const projectsData = readJsonFile('projects.json')
    if (projectsData?.projects) {
      for (const project of projectsData.projects) {
        await prisma.project.create({
          data: {
            title: project.title,
            category: project.category,
            description: project.description,
            image: project.image,
            clientUrl: project.clientUrl,
            tags: JSON.stringify(project.tags),
            featured: project.featured,
          },
        })
      }
      console.log(`✅ Migrated ${projectsData.projects.length} projects`)
    }

    // 3. Migrate Services
    console.log('🛠️  Migrating services...')
    const servicesData = readJsonFile('services.json')
    if (servicesData?.services) {
      for (const service of servicesData.services) {
        await prisma.service.create({
          data: {
            title: service.title,
            description: service.description,
            icon: service.icon,
            features: JSON.stringify(service.features),
            order: parseInt(service.id),
          },
        })
      }
      console.log(`✅ Migrated ${servicesData.services.length} services`)
    }

    // 4. Migrate Team Members
    console.log('👥 Migrating team members...')
    const teamData = readJsonFile('team.json')
    if (teamData?.team) {
      for (const member of teamData.team) {
        await prisma.teamMember.create({
          data: {
            name: member.name,
            role: member.role,
            image: member.image,
            bio: member.bio,
            linkedin: member.linkedin,
            twitter: member.twitter,
            order: parseInt(member.id),
          },
        })
      }
      console.log(`✅ Migrated ${teamData.team.length} team members`)
    }

    // 5. Migrate Testimonials
    console.log('💬 Migrating testimonials...')
    const testimonialsData = readJsonFile('testimonials.json')
    if (testimonialsData?.testimonials) {
      for (const testimonial of testimonialsData.testimonials) {
        await prisma.testimonial.create({
          data: {
            name: testimonial.name,
            company: testimonial.company,
            position: testimonial.position,
            image: testimonial.image,
            content: testimonial.content,
            rating: testimonial.rating,
          },
        })
      }
      console.log(`✅ Migrated ${testimonialsData.testimonials.length} testimonials`)
    }

    // 6. Migrate Users and Related Data
    console.log('👤 Migrating users and user data...')
    const userData = readJsonFile('user-data.json')
    if (userData?.users) {
      for (const user of userData.users) {
        const createdUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || 'user',
          },
        })

        // Migrate user project requests
        if (userData.projectRequests) {
          const userRequests = userData.projectRequests.filter((req: any) => req.userId === user.id)
          for (const request of userRequests) {
            await prisma.userProjectRequest.create({
              data: {
                id: request.id,
                userId: createdUser.id,
                type: request.type,
                description: request.description,
                budget: request.budget,
                status: request.status,
                submittedDate: request.submittedDate,
              },
            })
          }
        }

        // Migrate wallet transactions
        if (userData.walletTransactions) {
          const userTransactions = userData.walletTransactions.filter((tx: any) => tx.userId === user.id)
          for (const transaction of userTransactions) {
            await prisma.walletTransaction.create({
              data: {
                id: transaction.id,
                userId: createdUser.id,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                status: transaction.status,
                date: new Date(transaction.date),
              },
            })
          }
        }
      }
      console.log(`✅ Migrated ${userData.users.length} users with related data`)
    }

    // 7. Migrate Settings
    console.log('⚙️  Migrating settings...')
    const settingsData = readJsonFile('settings.json')
    if (settingsData) {
      const settingsEntries = [
        { key: 'general', value: settingsData.general },
        { key: 'payment', value: settingsData.payment },
        { key: 'invoice', value: settingsData.invoice },
        { key: 'ai', value: settingsData.ai },
        { key: 'google', value: settingsData.google },
        { key: 'legal', value: settingsData.legal },
      ]

      for (const setting of settingsEntries) {
        if (setting.value) {
          await prisma.settings.upsert({
            where: { key: setting.key },
            update: { value: JSON.stringify(setting.value) },
            create: {
              key: setting.key,
              value: JSON.stringify(setting.value),
            },
          })
        }
      }
      console.log(`✅ Migrated ${settingsEntries.length} settings`)
    }

    // 8. Migrate SEO Settings
    console.log('🔍 Migrating SEO settings...')
    const seoData = readJsonFile('seo.json')
    if (seoData?.seo) {
      await prisma.sEO.upsert({
        where: { page: 'home' },
        update: {},
        create: {
          page: 'home',
          title: seoData.seo.defaultTitle,
          description: seoData.seo.defaultDescription,
          keywords: JSON.stringify(seoData.seo.keywords),
          ogImage: seoData.seo.ogImage,
        },
      })
      console.log('✅ Migrated SEO settings')
    }

    // 9. Migrate Wallet Settings
    console.log('💰 Migrating wallet settings...')
    const walletSettingsData = readJsonFile('wallet-settings.json')
    if (walletSettingsData) {
      await prisma.settings.upsert({
        where: { key: 'wallet' },
        update: { value: JSON.stringify(walletSettingsData) },
        create: {
          key: 'wallet',
          value: JSON.stringify(walletSettingsData),
        },
      })
      console.log('✅ Migrated wallet settings')
    }

    console.log('\n✨ Migration completed successfully!')
    console.log('\n📊 Migration Summary:')
    
    const counts = await Promise.all([
      prisma.blogPost.count(),
      prisma.project.count(),
      prisma.service.count(),
      prisma.teamMember.count(),
      prisma.testimonial.count(),
      prisma.user.count(),
      prisma.userProjectRequest.count(),
      prisma.walletTransaction.count(),
      prisma.settings.count(),
      prisma.sEO.count(),
    ])

    console.log(`- Blog Posts: ${counts[0]}`)
    console.log(`- Projects: ${counts[1]}`)
    console.log(`- Services: ${counts[2]}`)
    console.log(`- Team Members: ${counts[3]}`)
    console.log(`- Testimonials: ${counts[4]}`)
    console.log(`- Users: ${counts[5]}`)
    console.log(`- User Project Requests: ${counts[6]}`)
    console.log(`- Wallet Transactions: ${counts[7]}`)
    console.log(`- Settings: ${counts[8]}`)
    console.log(`- SEO Pages: ${counts[9]}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateData()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })