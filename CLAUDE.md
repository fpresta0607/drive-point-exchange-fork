# Drive Point Exchange

## Overview

Nationwide auto financing platform built with Next.js 16 (App Router), React 19, Supabase, and Tailwind CSS 4. Services include auto loan refinancing, vehicle coverage, home refinancing, credit consultations, life insurance, and auto insurance consulting.

**Live site**: https://www.drivepointexchange.com
**Brand**: Drive Point Exchange (nationwide, not location-specific)

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, Turbopack dev)
- **Styling**: Tailwind CSS 4, tw-animate-css, class-variance-authority
- **Database**: Supabase (PostgreSQL with RLS)
- **Auth**: Supabase magic links (admin panel only)
- **Email**: Resend (primary), Gmail SMTP (fallback), nodemailer
- **Analytics**: Vercel Analytics + Speed Insights, Google Tag Manager
- **Animations**: Framer Motion, WebGL shaders (lightning, nebula backgrounds)
- **i18n**: Custom context-based system (en, es, pl, it, fr)
- **Deployment**: Vercel

## Project Structure

```
app/
  (home)/page.tsx          # Landing page with calculator, reviews, social feed
  about-us/                # About page
  benefits/                # Vehicle coverage benefits
  calculator/              # Standalone calculator page
  contact/                 # Contact form with FAQ structured data
  services/                # Service pages (6 sub-routes with SEO layouts)
  admin/                   # Admin panel (auth-gated)
  api/                     # API routes (email, leads, social, auth)
  layout.tsx               # Root layout with fonts, SEO, structured data
  manifest.ts, robots.ts, sitemap.ts  # SEO/PWA files
components/
  ui/                      # UI primitives (calculator, shaders, animations)
  calculator/              # Calculator sub-components (EmailModal)
  admin/                   # Admin panel components
  social/                  # Social embed components
hooks/
  use-is-mobile.ts         # Shared `<768px` viewport detector via useSyncExternalStore
lib/
  supabase.ts              # Supabase clients (browser, service, server)
  structured-data.ts       # JSON-LD schema generators
  email-templates.ts       # HTML email templates
  i18n/                    # Internationalization system
  social/                  # Social feed oEmbed utilities
```

## Environment Setup

Copy `.env.example` to `.env.local`. Key variables:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (admin operations only) |
| `RESEND_API_KEY` | Resend email API key |
| `MAIL_FROM` | Verified sender address |
| `OWNER_EMAIL` | Receives lead notifications |
| `NEXT_PUBLIC_TRUSTPILOT_TOKEN` | Trustpilot widget token |
| `META_APP_TOKEN` | Facebook/Instagram oEmbed |

## Commands

```bash
npm run dev              # Start dev server (Turbopack)
npm run build            # Production build
npm run lint             # ESLint
npm run create-admin     # Create admin user
npm run list-admins      # List admin users
```

## Key Architecture Patterns

- **Dynamic imports**: Calculator, shader backgrounds, TrustpilotReviews, and SocialFeed are dynamically imported with `ssr: false` for bundle splitting
- **WebGL shaders**: Lightning and nebula backgrounds use IntersectionObserver to pause when off-screen, `requestAnimationFrame` throttled to 30fps. On mobile (`<768px` via `useIsMobile`) the canvas is skipped and a CSS gradient renders instead — saves GPU on phones.
- **Structured data**: Organization schema in root layout; per-service breadcrumb + service schemas in service layouts; FAQ schema on contact page
- **Supabase clients**: `createBrowserClient()` for public reads, `createServiceClient()` for admin-only operations (never on public endpoints), `createServerSupabaseClient()` for cookie-based auth
- **Email**: Resend primary with Gmail SMTP fallback via nodemailer
- **Consent-gated scripts**: GTM, Trustpilot, Facebook SDK, Instagram embed loaded only after cookie consent

## SEO

- Per-page metadata in layout.tsx files
- JSON-LD structured data (Organization, Service, BreadcrumbList, FAQPage)
- Programmatic sitemap.ts and robots.ts
- `llms.txt` and `llms-full.txt` for LLM discovery
- Keywords are nationwide-focused (no location-specific terms)
