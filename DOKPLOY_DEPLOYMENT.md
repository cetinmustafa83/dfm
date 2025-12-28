# Dokploy Deployment Guide

## GitHub Repository
https://github.com/cetinmustafa83/dfm

## Environment Variables for Dokploy

Add these in Dokploy → Application → Environment Variables:

### Required Variables

```bash
# Database (Production - PostgreSQL recommended)
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth (IMPORTANT: Update with your domain)
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="j+H2e1MM65T4wWmzmbMgzG5+UDONMnCKCdUOXcmSPdM="

# Node Environment
NODE_ENV="production"
```

### Optional Variables

```bash
# AI Services (for blog generation)
AI_API_KEY="your-openai-api-key"
AI_BASE_URL="https://api.openai.com/v1"
AI_MODEL="g-4"

# Google Search API (for web scraping)
GOOGLE_SEARCH_API_KEY="your-google-search-api-key"
GOOGLE_SEARCH_ENGINE_ID="your-search-engine-id"

# Email Service
EMAIL_API_KEY="your-email-service-api-key"

# Payment Services
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_WEBHOOK_ID="your-paypal-webhook-id"
MOLLIE_API_KEY="your-mollie-api-key"
```

## Deployment Steps

### 1. Create Application in Dokploy
- Go to https://cp.project-url.eu
- Create new application
- Connect GitHub repository: cetinmustafa83/dfm
- Branch: main

### 2. Configure Build Settings
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`
- **Node Version**: 20.x or higher

### 3. Add Environment Variables
Copy the required variables above into Dokploy's environment variables section.

### 4. Database Setup
**Option 1: SQLite (Default - Good for testing)**
```bash
DATABASE_URL="file:./dev.db"
```

**Option 2: PostgreSQL (Recommended for production)**
- Create PostgreSQL database in Dokploy
- Use connection string:
```bash
DATABASE_URL="postgresql://postgres:password@postgres-service:5432/dfm"
```

### 5. Deploy
- Click "Deploy" button
- Wait for build to complete
- Access your application

## Post-Deployment Steps

1. **Run Prisma Migrations**
```bash
npx prisma migrate deploy
```

2. **Access Admin Panel**
- Go to: `https://your-domain.com/en/admin`
- Default credentials (check database)

3. **Configure Settings**
- Go to Admin → Settings
- Update payment gateways
- Configure AI services
- Set up email service

## Troubleshooting

### Build Fails
- Check Node.js version (must be 20+)
- Verify pnpm is installed
- Check build logs in Dokploy

### Database Connection Error
- Verify DATABASE_URL is correct
- Check database service is running
- Ensure network access

### 404 Errors on Locale Routes
- Ensure middleware is configured correctly
- Check build completed successfully
- Verify environment variables

### Environment Variables Not Working
- Make sure to add them in Dokploy UI
- Restart application after adding variables
- Check for typos in variable names

## Current Project Status

✅ Multi-language support (11 languages)
✅ Locale routing: /en, /de, /tr, etc.
✅ Admin panel with full features
✅ Database schema ready
✅ Payment gateway integrations
✅ AI blog generation
✅ Email service integration

## Support

For issues, check:
- Dokploy logs
- Application logs
- GitHub issues: https://github.com/cetinmustafa83/dfm/issues
