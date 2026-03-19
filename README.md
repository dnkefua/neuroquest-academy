# NeuroQuest Academy 🧠

AI-powered adaptive learning platform for neurodiverse students, built with Next.js 14, Firebase, and Gemini AI.

---

## Prerequisites

- Node.js 18+
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase project (already configured: `neuroquest-academy-2026`)

---

## 1. Firebase Project Setup

In the [Firebase Console](https://console.firebase.google.com/project/neuroquest-academy-2026):

### Enable Authentication
1. Go to **Authentication → Sign-in method**
2. Enable **Email/Password**
3. Enable **Google**

### Enable Firestore
1. Go to **Firestore Database → Create database**
2. Start in **production mode** (rules are in `firestore.rules`)
3. Choose region: `europe-west1` (or nearest to Dubai)

### Deploy Firestore Rules & Indexes
```bash
firebase deploy --only firestore
```

### Enable Firebase Hosting
```bash
firebase deploy --only hosting
```

---

## 2. Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **Create API key**
3. Copy the key — it's already set in `.env.local`

---

## 3. Install & Run Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 4. Build & Deploy to Firebase Hosting

```bash
# Build Next.js (static export)
npm run build

# Deploy everything
firebase deploy
```

> **Note:** For full SSR/API routes support, use [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) or deploy API routes as Cloud Functions separately.

---

## 5. Seed Test Accounts

### Option A — Use the Sign Up page
1. Go to `/auth` → Sign Up
2. Create a **student** account: `student@test.com` / `password123`
3. Create a **parent** account: `parent@test.com` / `password123`

### Option B — Firebase Console
1. **Authentication → Add user** for each test account
2. In **Firestore → users/{uid}**, manually create:

**Student document:**
```json
{
  "uid": "<student-uid>",
  "name": "Zara",
  "email": "student@test.com",
  "role": "student",
  "grade": 5,
  "language": "EN",
  "xp": 45,
  "streak": 3,
  "currentEmotion": "happy",
  "createdAt": "2026-03-19T00:00:00Z"
}
```

**Parent document:**
```json
{
  "uid": "<parent-uid>",
  "name": "Ahmed",
  "email": "parent@test.com",
  "role": "parent",
  "grade": 0,
  "language": "EN",
  "xp": 0,
  "streak": 0,
  "currentEmotion": "happy",
  "childUid": "<student-uid>",
  "createdAt": "2026-03-19T00:00:00Z"
}
```

---

## Project Structure

```
src/
├── app/
│   ├── auth/          # Sign in / Sign up
│   ├── onboarding/    # First-time setup (role, name, grade, language)
│   ├── dashboard/     # Student dashboard with emotion widget
│   ├── lesson/[subject]/  # AI-generated lesson + quiz
│   ├── social-skills/ # Social scenarios mini-game
│   ├── parent/        # Parent analytics dashboard
│   └── api/
│       ├── generate-lesson/   # Gemini lesson generation
│       └── tutor-explanation/ # Gentle wrong-answer explanations
├── components/
│   ├── BrainBreakModal.tsx    # Breathing, grounding, movement tabs
│   └── BreathingCircle.tsx    # Animated breathing exercise
├── lib/
│   ├── firebase.ts       # Firebase init
│   ├── firestore.ts      # Firestore helpers
│   ├── constants.ts      # Emotions, subjects, activities
│   └── translations.ts   # EN/AR translation helper
└── types/index.ts        # TypeScript interfaces
```

---

## Features

| Feature | Status |
|---------|--------|
| Email/Password + Google Auth | ✅ |
| Multi-step onboarding | ✅ |
| Student dashboard with emotion widget | ✅ |
| XP + streak tracking | ✅ |
| AI lesson generator (Gemini 1.5 Flash) | ✅ |
| Emotion-aware lesson prompting | ✅ |
| Wrong-answer tutor explanations | ✅ |
| Session logging to Firestore | ✅ |
| Brain Break modal (breathing/grounding/movement) | ✅ |
| Social Skills mini-game (3 scenarios) | ✅ |
| Parent dashboard with recharts | ✅ |
| Emotion log timeline | ✅ |
| Firestore security rules | ✅ |
| EN/AR language support + RTL layout | ✅ |
| Confetti on quiz completion | ✅ |

---

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
GEMINI_API_KEY=...     # Server-side only — never exposed to client
```
