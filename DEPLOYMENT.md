# NeuroQuest Deployment Guide

## Firebase App Hosting Setup

This document covers deploying NeuroQuest Academy to Firebase App Hosting with full backend support.

---

## Prerequisites

1. **Firebase Project** with Blaze (pay-as-you-go) plan
2. **Google Cloud SDK** installed and authenticated
3. **Firebase CLI** (`npm install -g firebase-tools`)
4. **Domain configured** (optional for custom domain)

---

## Step 1: Enable Firebase App Hosting

### Via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`neuroquest-academy-2026`)
3. Navigate to **Build > App Hosting**
4. Click **Get started**
5. Follow the wizard to connect your GitHub repository

### Via Firebase CLI

```bash
# Login
firebase login

# Initialize App Hosting
firebase init apphosting

# Link to your GitHub repo
firebase init github
```

---

## Step 2: Configure Environment Variables

Create secrets in Firebase App Hosting:

```bash
# Core Firebase
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_PROJECT_ID
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_APP_ID

# AI Services (Gemma4/Gemini)
firebase apphosting:secrets:set GEMINI_API_KEY
firebase apphosting:secrets:set GCP_PROJECT_ID
firebase apphosting:secrets:set GCP_LOCATION
firebase apphosting:secrets:set GCP_API_KEY

# Optional: Ollama for local inference
firebase apphosting:secrets:set OLLAMA_BASE_URL
firebase apphosting:secrets:set OLLAMA_GEMMA_MODEL

# Text-to-Speech
firebase apphosting:secrets:set GOOGLE_APPLICATION_CREDENTIALS
```

---

## Step 3: Firebase App Hosting Configuration

The `firebase.app-hosting.json` file is already configured with:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Server Directory**: `.next` (Next.js standalone output)
- **Regions**: `us-central1`
- **Cloud Run Settings**:
  - Min instances: 0 (scale to zero when idle)
  - Max instances: 10
  - Concurrency: 80
  - Memory: 512Mi
  - CPU: 1
  - Timeout: 60s

---

## Step 4: Update next.config.ts

The `next.config.ts` is configured for Firebase App Hosting with:

- Standalone output mode for serverless deployment
- Security headers
- API route caching disabled
- Image optimization for Firebase Storage

---

## Step 5: Deploy

### Option A: Automatic via GitHub

Push to `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "feat: Configure for Firebase App Hosting"
git push origin main
```

### Option B: Manual Deploy

```bash
# Build locally
npm run build

# Deploy via Firebase CLI
firebase deploy --only apphosting
```

---

## API Routes Available After Deployment

### AI-Powered Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate-lesson` | POST | Generate AI lesson with Gemma4 |
| `/api/tutor-explanation` | POST | Get AI tutor explanation |
| `/api/npc-reaction` | POST | NPC game interactions |
| `/api/tts` | POST | Text-to-speech generation |
| `/api/health` | GET | AI provider status |

### Admin API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/schools` | GET/POST | School management |
| `/api/users` | GET/POST | User management |
| `/api/analytics` | GET | Platform analytics |

---

## Security Configuration

### Content Security Policy

Headers configured in `firebase.app-hosting.json`:

- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()
- Strict-Transport-Security: max-age=31536000

### Rate Limiting

API routes include rate limiting:
- 100 requests per minute per IP
- Configurable in `/api/*` routes

---

## Troubleshooting

### API routes not working

1. Check `next.config.ts` has `output: standalone`
2. Verify `firebase.app-hosting.json` has `serverDirectory: .next`
3. Ensure environment variables are set in Firebase App Hosting

### AI endpoints failing

1. Verify `GEMINI_API_KEY` is set
2. Check GCP project has Vertex AI API enabled
3. Test locally with `DEMO_MODE=true`

### Build failures

1. Run `npm run build` locally first
2. Check TypeScript errors: `npm run type-check`
3. Verify all dependencies installed: `npm install`

---

## Demo Mode

To test without AI services:

```bash
NEXT_PUBLIC_DEMO_MODE=true npm run build
```

Or access with `?demo` query parameter:

```
https://neuroquest-academy-2026.firebaseapp.com/?demo
```

---

## Monitoring

### Firebase Console
- App Hosting dashboard shows deployment status
- Cloud Run logs accessible from Firebase Console
- Custom metrics available via Cloud Monitoring

### Health Check Endpoint

```bash
curl https://your-domain/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-05-05T12:00:00.000Z",
  "aiProvider": "gemini",
  "aiAvailable": true,
  "aiLatency": 245,
  "demoMode": false
}
```

---

## Rollback

To rollback to a previous deployment:

```bash
# List releases
firebase apphosting:releases:list

# Rollback to specific release
firebase apphosting:releases:rollback [release-id]
```

---

## Cost Estimation

For a school pilot with 100 students:

- **Cloud Run**: ~$5-15/month (based on usage)
- **Firestore**: ~$1-5/month (based on reads/writes)
- **Firebase Hosting CDN**: Included in Firebase plan

For production with 1000+ students:
- Budget ~$50-100/month for Cloud Run
- Consider Cloud Run min instances = 1 for consistency

---

## Next Steps

1. ✅ Deploy to Firebase App Hosting
2. Configure custom domain (optional)
3. Set up monitoring and alerts
4. Configure CI/CD for automatic deployments
5. Set up production analytics
