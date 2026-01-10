# Database Migration Guide

This guide documents the comprehensive migration from JSON-based storage to SQLite database using Prisma ORM.

## Overview

All data previously stored in `/db/json-data/*.json` files has been migrated to a SQLite database located at `prisma/dev.db`.

## Migration Summary

### Successfully Migrated:
- ✅ **Blog Posts**: 12 posts (6 from JSON + 6 from seed)
- ✅ **Projects**: 6 portfolio projects
- ✅ **Services**: 6 service offerings
- ✅ **Team Members**: 4 team members
- ✅ **Testimonials**: 3 client testimonials
- ✅ **Users**: 1 user with related data
- ✅ **User Project Requests**: 1 request
- ✅ **Settings**: 7 configuration sets (general, payment, invoice, AI, Google, legal, wallet)
- ✅ **SEO**: 1 SEO configuration
- ✅ **Customers**: 5 customers (from seed)
- ✅ **Project Requests**: 5 requests (from seed)
- ✅ **Support Packages**: 5 packages (from seed)
- ✅ **Payments**: 23 payments (from seed)
- ✅ **Templates**: 42 marketplace templates (from seed)
- ✅ **Language Packages**: 12 language packs (from seed)
- ✅ **Licenses**: 7 licenses (from seed)
- ✅ **Messages**: 1 contact message (from seed)

## Database Schema

The complete Prisma schema includes the following models:

### Core Business Models
- `Customer` - Customer management
- `ProjectRequest` - Project requests from customers
- `SupportPackage` - Support package offerings
- `Payment` - Payment transactions
- `Template` - Marketplace templates
- `LanguagePackage` - Multi-language support
- `License` - License management
- `BlogPost` - Blog content
- `Message` - Contact form messages

### User Management Models
- `User` - User accounts
- `UserProjectRequest` - User-submitted project requests
- `UserPayment` - User payment history
- `Purchase` - User purchases
- `PaymentMethod` - Saved payment methods
- `WalletTransaction` - Wallet credits/debits
- `RefundRequest` - Refund requests
- `Ticket` - Support tickets

### Content Models
- `Service` - Service offerings
- `Project` - Portfolio projects
- `CompletedProject` - Completed project showcase
- `TeamMember` - Team member profiles
- `Testimonial` - Client testimonials

### Configuration Models
- `Settings` - System settings (JSON storage)
- `SEO` - SEO configurations per page

## Running the Migration

### Initial Setup
```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm prisma generate

# Push schema to database
pnpm prisma db push
```

### Migrate JSON Data
```bash
# Run the migration script
pnpm db:migrate-json
```

### Seed Additional Data
```bash
# Add sample data for testing
pnpm db:seed
```

## API Endpoints Updated

The following API endpoints now use Prisma instead of JSON files:

### Admin Dashboard
- `GET /api/admin/stats` - Real-time dashboard statistics from database

### Content APIs (To be updated)
- `/api/blog` - Blog posts
- `/api/services` - Services
- `/api/projects` - Projects
- `/api/team` - Team members
- `/api/messages` - Contact messages
- `/api/settings` - System settings
- `/api/seo` - SEO settings

### User APIs (To be updated)
- `/api/user/projects` - User project requests
- `/api/user/payments` - User payments
- `/api/user/wallet` - Wallet transactions
- `/api/user/tickets` - Support tickets

## Database Management Commands

```bash
# View database in Prisma Studio
pnpm prisma studio

# Reset database (WARNING: deletes all data)
pnpm prisma db push --force-reset

# Re-run migrations
pnpm db:migrate-json

# Re-seed sample data
pnpm db:seed
```

## Next Steps

1. ✅ Database schema created
2. ✅ JSON data migrated to SQLite
3. ✅ Admin dashboard updated to use real data
4. 🔄 Update remaining API endpoints to use Prisma
5. 🔄 Update frontend components to use new API structure
6. 🔄 Test all functionality end-to-end
7. 🔄 Remove old JSON files after verification
8. 🔄 Update documentation

## Rollback Plan

If issues arise, the original JSON files are still available in `/db/json-data/`. To rollback:

1. Stop using Prisma endpoints
2. Revert API changes to use JSON files
3. Delete `prisma/dev.db`
4. Keep using JSON-based system

## Notes

- The SQLite database is ideal for development and small-scale production
- For larger scale, consider migrating to PostgreSQL or MySQL
- All relationships are properly set up with cascade deletes
- Prisma Client provides type-safe database access
- The database file (`prisma/dev.db`) should be added to `.gitignore` for production

## Support

For issues or questions:
1. Check Prisma documentation: https://www.prisma.io/docs
2. Review the schema: `prisma/schema.prisma`
3. Check migration logs in console output