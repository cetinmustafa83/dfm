# DFM Solutions - Next.js Admin Dashboard

A comprehensive Next.js 15.5.2 admin dashboard with PWA capabilities, analytics, SEO integration, and all core business modules for dfmsolutions.de.

## 🚀 Features

### Core Admin Dashboard
- ✅ Responsive layout with modern sidebar navigation
- ✅ Secure authentication with bcrypt password hashing
- ✅ File-based JSON database (LevelDB style)
- ✅ Role-based access control

### Dashboard Modules
1. **Content Management** - Pages, services, SEO meta data
2. **Project Management** - Project creation, tracking, updates
3. **Customer Management** - Accounts, permissions, assignments
4. **SEO Dashboard** - AI-powered keyword reports and suggestions
5. **Analytics** - Traffic, conversion, engagement metrics
6. **Settings** - Notification preferences, PWA configuration

### PWA Features
- ✅ Service Worker for offline capabilities
- ✅ Web App Manifest for Add to Home Screen
- ✅ Push Notifications for real-time alerts
- ✅ Background Sync for automatic data synchronization
- ✅ Offline Mode for cached project access

## 🛠️ Tech Stack
- Next.js 15.5.2 with App Router + TypeScript
- TailwindCSS + shadcn/ui for modern UI
- Radix UI for accessible components
- Classic LevelDB for JSON storage
- OpenAI API integration for SEO automation

## 📦 Installation

```bash
npm install
npm run dev
```

## 🚀 Development

The development server runs on http://localhost:3001

## 📱 PWA Features

This application is a Progressive Web App with:
- Offline functionality
- Push notifications
- Add to Home Screen capability
- Background sync

## 🔧 Configuration

See `src/components/pwa/PWAProvider.tsx` for notification settings and `public/manifest.json` for PWA configuration.

## 🤖 GitHub Actions Automation

This repository includes automated workflows for dependency management:

### Dependabot Auto Merge
- **Location**: `.github/workflows/dependabot-auto-merge.yml`
- **Purpose**: Automatically merges Dependabot pull requests when tests pass
- **Trigger**: Pull requests from Dependabot ([bot] or [preview])
- **Actions**: 
  - Checks out code
  - Sets up Node.js environment
  - Installs dependencies
  - Runs tests (if available)
  - Auto-merges successful PRs using squash method

This ensures that security updates and dependency patches are automatically applied while maintaining code quality.
