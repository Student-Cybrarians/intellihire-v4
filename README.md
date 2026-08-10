# IntelliHire v4

**AI-Based Placement Trainer — Train Smart. Perform Better. Get Placed.**

IntelliHire uses a Next.js BFF architecture. Google OpenID Connect is the only authentication provider; sessions are server-managed and stored in PostgreSQL through Prisma. NVIDIA APIs are server-side only and reserved for future AI capabilities.

## Current status

The authentication foundation provides:

- Google OAuth 2.0 + OpenID Connect with Authorization Code + PKCE
- Signed OAuth state cookie with nonce validation
- Google issuer, audience, expiration and `email_verified` validation
- PostgreSQL user, profile, device, session, login-history, security-event and audit-log models
- HttpOnly session cookies with server-side session revocation
- User/Admin RBAC foundation
- Current-session, all-session and individual-session logout APIs
- Protected user and admin dashboards
- Health endpoint at `/api/health`
- GitHub Actions CI

## Local setup

### 1. Requirements

- Node.js 20+
- PostgreSQL 14+
- Google Cloud OAuth Web Client

### 2. Install

```bash
npm ci
npx prisma generate
```

### 3. Configure environment

Copy `.env.example` to `.env` and set:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
DATABASE_URL=
SESSION_SECRET=
APP_URL=http://localhost:3000
NODE_ENV=development
```

Generate a strong session secret with a cryptographically secure generator. Never commit `.env` or provider credentials.

For the first authentication milestone, NVIDIA and Redis variables can remain empty; they are used by later modules.

### 4. Database

```bash
npx prisma migrate dev --name auth-foundation
```

### 5. Run

```bash
npm run dev
```

Open `http://localhost:3000` and select **Continue with Google**.

## Google Cloud configuration

Create an OAuth 2.0 Web application client and add this authorized redirect URI for local development:

```text
http://localhost:3000/api/auth/google/callback
```

For production, add the exact HTTPS callback URL used by the deployed application.

## Verification

```bash
npm run format
npm run lint
npm run typecheck
npm test
npm run build
```

## Deployment

The repository is designed for GitHub-connected Vercel deployment. Add the production environment variables in Vercel rather than committing secrets. Run Prisma migrations against the production PostgreSQL database before enabling Google login in production.

See `docs/auth-ai-architecture.md` for the detailed security and AI-provider architecture.
