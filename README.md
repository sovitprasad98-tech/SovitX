# SovitX Digital — Deployment Guide

## Project Structure
```
sovitx-project/
├── api/
│   ├── config.js          ← serves Firebase config securely
│   ├── create-order.js    ← ZapUPI order proxy
│   └── verify-order.js    ← ZapUPI status check
├── public/
│   ├── index.html
│   ├── store.html
│   ├── product.html
│   ├── admin.html
│   └── ...other pages
├── .env.example           ← copy to .env, fill values
├── .gitignore             ← .env is gitignored
├── vercel.json
└── package.json
```

## Deploy to Vercel (Step by Step)

### Step 1 — GitHub mein push karo
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/sovitx-digital.git
git push -u origin main
```

### Step 2 — Vercel pe deploy karo
1. https://vercel.com pe jaao → Login with GitHub
2. "New Project" → apna repo select karo
3. Deploy click karo

### Step 3 — Environment Variables add karo
Vercel Dashboard → Project → Settings → Environment Variables mein ye sab add karo:

| Key | Value |
|-----|-------|
| FIREBASE_API_KEY | AIzaSy... |
| FIREBASE_AUTH_DOMAIN | codexhub-b0501.firebaseapp.com |
| FIREBASE_DATABASE_URL | https://codexhub-b0501-default-rtdb.firebaseio.com |
| FIREBASE_PROJECT_ID | codexhub-b0501 |
| FIREBASE_STORAGE_BUCKET | codexhub-b0501.firebasestorage.app |
| FIREBASE_MESSAGING_SENDER_ID | 243876360897 |
| FIREBASE_APP_ID | 1:243876... |
| FIREBASE_MEASUREMENT_ID | G-LLVSJBBY7Q |
| ZAP_KEY | zapeb67bd8c953316fdbb75e97a4c44c795 |
| ALLOWED_ORIGIN | https://your-project.vercel.app |

### Step 4 — Redeploy
Vercel Dashboard → Deployments → Redeploy

## Firebase Firestore Rules
Paste these in Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Products — public read, no write from frontend
    match /products/{id} {
      allow read: if true;
      allow write: if false;
    }

    // Orders — anyone can create, nobody can read/edit from frontend
    match /orders/{id} {
      allow create: if request.resource.data.keys().hasAll(['productId','amount','ref','status'])
                    && request.resource.data.amount is number
                    && request.resource.data.amount > 0;
      allow read, update, delete: if false;
    }

    // Coupons — public read (for validation), no frontend write
    match /coupons/{id} {
      allow read: if true;
      allow write: if false;
    }

    // Settings — public read only
    match /settings/{id} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

> Admin panel Firebase Auth se protected hai — wahan se hi products/orders/coupons manage karo.
