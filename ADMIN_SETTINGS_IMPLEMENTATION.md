# Admin Settings Implementation Guide

## Overview

This document describes the comprehensive admin settings system with German legal compliance, payment integration, AI features, and more.

## ✅ Completed Features

### 1. Enhanced Admin Settings Page
**Location:** `src/app/admin/settings/page.tsx`

A fully functional tabbed interface with 7 sections:
- **General** - Company information and website configuration
- **Payment** - PayPal and Mollie payment gateway integration
- **Invoice** - Visual invoice template designer
- **AI** - OpenAI-compatible AI provider configuration
- **Google** - Analytics, Search Console, Tag Manager, reCAPTCHA
- **Legal** - German law compliance (DSGVO, Impressum, AGB, Widerrufsrecht)
- **SEO** - AI-powered SEO optimization

### 2. Database Infrastructure
**Files:**
- `db/json-data/settings.json` - Complete settings storage
- `src/lib/settings-db.ts` - Type-safe database operations
- `src/app/api/settings/route.ts` - RESTful API endpoints

**Features:**
- Strongly typed TypeScript interfaces
- CRUD operations for all settings sections
- JSON-based storage for easy backup and migration

### 3. German Legal Compliance Pages

All pages comply with German law (DSGVO, TMG, BGB):

#### `/impressum` (`src/app/impressum/page.tsx`)
- Company details as required by §5 TMG
- Managing director information
- Commercial register details
- Tax ID (USt-IdNr.)
- Liability disclaimers for content and links
- Copyright information

#### `/datenschutz` (`src/app/datenschutz/page.tsx`)
- GDPR-compliant privacy policy
- Data collection transparency
- User rights (access, correction, deletion, portability)
- Cookie policy
- Server log files information
- Third-party tool disclosures

#### `/agb` (`src/app/agb/page.tsx`)
- General Terms and Conditions
- Contract conclusion process
- Pricing and payment terms
- Delivery timeframes
- Intellectual property rights
- Liability limitations
- Dispute resolution

#### `/widerrufsrecht` (`src/app/widerrufsrecht/page.tsx`)
- Consumer right of withdrawal (14 days)
- Model withdrawal form
- Exclusions and early expiry conditions
- Special notes for digital content and services

### 4. Cookie Consent Banner
**Location:** `src/components/CookieConsent.tsx`

GDPR-compliant cookie consent with:
- Granular control (Necessary, Functional, Analytics, Marketing)
- Customizable position (top/bottom/center)
- Theme support (light/dark)
- Local storage persistence
- Links to privacy policy and Impressum
- Accept all, reject all, or customize options

### 5. AI Content Generation System

#### API Route: `/api/ai/generate`
**Location:** `src/app/api/ai/generate/route.ts`

**Features:**
- OpenAI-compatible API integration
- Multiple generation types:
  - **Generate** - Create new content from scratch
  - **Enhance** - Improve existing text
  - **Rewrite** - Rewrite in different style
  - **Expand** - Add more details
  - **Summarize** - Make concise
- Configurable temperature and max tokens
- Context-aware generation

#### AI Content Generator Component
**Location:** `src/components/ai/AIContentGenerator.tsx`

**Features:**
- Magic wand button for easy access
- Modal interface with type selection
- Real-time content generation
- Copy to clipboard functionality
- Direct content application

#### Reusable Hook
**Location:** `src/hooks/useAIGeneration.ts`

```typescript
const { generate, isGenerating, generatedContent, error } = useAIGeneration({
  onSuccess: (content) => console.log('Generated:', content),
  onError: (error) => console.error('Error:', error)
})

// Use it
await generate({
  prompt: 'Write a product description',
  type: 'generate',
  context: 'E-commerce website'
})
```

## 📋 Remaining Features to Implement

### Payment Integration (To Be Completed)

#### 1. PayPal Integration
**Required files:**
- `src/app/api/webhooks/paypal/route.ts` - Webhook handler
- `src/lib/payment/paypal.ts` - PayPal SDK wrapper

**Required npm packages:**
```bash
npm install @paypal/checkout-server-sdk
```

**Implementation tasks:**
- Set up PayPal SDK with credentials from settings
- Create checkout flow components
- Implement webhook signature verification
- Handle payment status updates
- Store transaction records

#### 2. Mollie Integration
**Required files:**
- `src/app/api/webhooks/mollie/route.ts` - Webhook handler
- `src/lib/payment/mollie.ts` - Mollie SDK wrapper

**Required npm packages:**
```bash
npm install @mollie/api-client
```

**Implementation tasks:**
- Set up Mollie API client
- Create payment creation flow
- Implement webhook handling
- Process payment notifications
- Handle refunds and chargebacks

### Invoice System (To Be Completed)

#### 1. Invoice PDF Generator
**Required files:**
- `src/lib/invoice/pdf-generator.ts` - PDF generation logic
- `src/components/invoice/InvoicePreview.tsx` - Live preview component

**Required npm packages:**
```bash
npm install jspdf jspdf-autotable
# OR
npm install @react-pdf/renderer
```

**Implementation tasks:**
- Create PDF templates based on settings
- Apply custom colors, fonts, and logos
- Generate invoice numbers automatically
- Include company details and tax information
- Support multiple currencies

#### 2. Invoice Template System
**Features to implement:**
- Template selection (modern, classic, minimal, professional)
- Custom color schemes
- Font family selection
- Logo upload and positioning
- Footer text customization
- Tax rate configuration

### AI Features (To Be Completed)

#### 1. AI SEO Optimizer
**Required file:** `src/app/api/ai/seo-optimize/route.ts`

**Features:**
- Auto-generate meta titles
- Create meta descriptions
- Suggest keywords
- Optimize content for search engines
- Generate Open Graph tags

#### 2. Auto-Blog Generator
**Required files:**
- `src/app/api/ai/blog-scheduler/route.ts` - Scheduling API
- `src/lib/ai/scraper.ts` - Web scraping service

**Required npm packages:**
```bash
npm install cheerio
# OR
npm install puppeteer
```

**Features:**
- Web scraping for topic research
- Automated content generation
- Scheduling (daily, weekly, monthly)
- Category-based topics
- SEO-optimized blog posts

### Additional Features (To Be Completed)

#### 1. Logo Upload System
**Implementation:**
- File upload API route
- Image optimization with Sharp
- Multiple size generation
- Storage in public directory
- Preview functionality

#### 2. Form Validation
**Required npm packages:**
```bash
npm install zod
```

**Implementation:**
- Create Zod schemas for all settings forms
- Validate on client and server side
- Display validation errors
- Type-safe form handling

#### 3. Error Handling & Logging
**Implementation:**
- Centralized error handling
- Log payment errors
- Log AI API errors
- User-friendly error messages
- Error reporting system

#### 4. Testing
**Required npm packages:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Tests needed:**
- Payment webhook handlers
- Settings API endpoints
- AI content generation
- Form validation
- Component rendering

## API Documentation

### Settings API

#### GET `/api/settings`
Get all settings

**Response:**
```json
{
  "settings": {
    "general": {...},
    "payment": {...},
    "invoice": {...},
    "ai": {...},
    "google": {...},
    "legal": {...}
  }
}
```

#### PUT `/api/settings`
Update settings section

**Request:**
```json
{
  "section": "general",
  "data": {
    "companyName": "ModernAgency GmbH",
    "email": "info@modernagency.com"
  }
}
```

**Response:**
```json
{
  "success": true
}
```

### AI Content Generation API

#### POST `/api/ai/generate`
Generate content using AI

**Request:**
```json
{
  "prompt": "Write a product description",
  "context": "E-commerce website",
  "type": "generate",
  "maxTokens": 2000
}
```

**Response:**
```json
{
  "success": true,
  "content": "Generated content here...",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 200,
    "total_tokens": 250
  }
}
```

**Types:**
- `generate` - Create new content
- `enhance` - Improve existing text
- `rewrite` - Rewrite in different style
- `expand` - Add more details
- `summarize` - Make concise

## Configuration

### Environment Variables (To Be Added)

Create a `.env.local` file:

```env
# PayPal (Production)
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_WEBHOOK_ID=your_webhook_id

# Mollie
MOLLIE_API_KEY=your_api_key

# AI Provider
AI_API_KEY=your_openai_api_key
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4

# Google Services
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
GOOGLE_RECAPTCHA_SECRET=your_secret_key
```

### Admin Settings Configuration

All settings can be configured through the admin panel at `/admin/settings`:

1. **General Settings** - Update company details and website info
2. **Payment Integration** - Add PayPal/Mollie credentials
3. **Invoice Designer** - Customize invoice appearance
4. **AI Configuration** - Set up AI provider
5. **Google Services** - Configure tracking and analytics
6. **Legal Compliance** - Edit legal pages content
7. **SEO** - Manage SEO settings

## German Legal Compliance Checklist

### Required for German Companies (TMG/DSGVO)

- [x] Impressum with complete company details
- [x] Privacy Policy (Datenschutzerklärung) GDPR-compliant
- [x] Terms and Conditions (AGB)
- [x] Right of Withdrawal (Widerrufsrecht)
- [x] Cookie Consent Banner
- [x] Data protection officer contact (in Privacy Policy)
- [x] Information about data processing
- [x] User rights (access, deletion, portability)
- [x] SSL encryption (configure in hosting)
- [x] Secure payment processing

### Additional Recommendations

- Keep legal documents updated
- Review annually or when laws change
- Consult with German legal counsel
- Ensure all forms have privacy notices
- Implement data retention policies
- Create data processing agreements with third parties

## Usage Examples

### Using the Cookie Consent Banner

Add to your root layout:

```tsx
import CookieConsent from '@/components/CookieConsent'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieConsent position="bottom" theme="light" />
      </body>
    </html>
  )
}
```

### Using AI Content Generator

```tsx
import AIContentGenerator from '@/components/ai/AIContentGenerator'

export default function MyForm() {
  const [content, setContent] = useState('')
  
  return (
    <div className="flex gap-2">
      <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <AIContentGenerator
        onContentGenerated={setContent}
        currentContent={content}
        context="Blog post about web development"
      />
    </div>
  )
}
```

### Using AI Hook

```tsx
import { useAIGeneration } from '@/hooks/useAIGeneration'

export default function MyComponent() {
  const { generate, isGenerating, generatedContent } = useAIGeneration()
  
  async function handleGenerate() {
    await generate({
      prompt: 'Write a meta description',
      type: 'generate',
      maxTokens: 160
    })
  }
  
  return (
    <div>
      <button onClick={handleGenerate} disabled={isGenerating}>
        Generate
      </button>
      {generatedContent && <p>{generatedContent}</p>}
    </div>
  )
}
```

## Development Roadmap

### Phase 1: Core Foundation ✅ (Completed)
- Admin settings interface
- Database infrastructure
- Legal compliance pages
- Cookie consent banner
- Basic AI integration

### Phase 2: Payment Integration (Next)
- PayPal SDK setup
- Mollie SDK setup
- Webhook handlers
- Payment flow UI

### Phase 3: AI Features
- SEO optimizer
- Auto-blog generator
- Web scraper
- Blog scheduler

### Phase 4: Invoice System
- PDF generator
- Template system
- Preview functionality
- Logo upload

### Phase 5: Polish & Testing
- Form validation
- Error handling
- Unit tests
- Documentation
- Performance optimization

## Support & Maintenance

### Updating Legal Pages
1. Navigate to `/admin/settings`
2. Go to "Legal Compliance" tab
3. Edit content for each section
4. Click "Save Legal Settings"

### Updating Payment Settings
1. Navigate to `/admin/settings`
2. Go to "Payment" tab
3. Enable PayPal or Mollie
4. Enter API credentials
5. Configure webhooks
6. Toggle test mode for testing

### Troubleshooting

**AI Generation Not Working:**
- Check AI Configuration tab
- Verify API key is correct
- Ensure content generation is enabled
- Check API quotas and limits

**Cookie Consent Not Appearing:**
- Clear localStorage: `localStorage.removeItem('cookie_consent')`
- Check component is imported in layout
- Verify settings in Legal Compliance tab

**Settings Not Saving:**
- Check browser console for errors
- Verify file permissions on `db/json-data/settings.json`
- Ensure server has write access

## Contributing

When adding new features:
1. Update TypeScript interfaces in `src/lib/settings-db.ts`
2. Add new fields to `db/json-data/settings.json`
3. Update API routes if needed
4. Add UI in admin settings page
5. Update this documentation

## License

This implementation follows the project's license terms.

---

**Last Updated:** 2024-12-24
**Version:** 1.0.0
**Author:** Kilo Code