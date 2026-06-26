# Ethics & Compliance Portal — Utthunga Technologies

Confidential whistleblower reporting platform: anonymous submission, encrypted storage,
report tracking, and an Ethics Officer case-management console.

## Stack
- **Client**: React 18 + TypeScript + Vite + Tailwind CSS
- **Server**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- Auth: JWT + bcrypt · Encryption: AES-256-GCM for report content/PII at rest

## Setup

### Server
```
cd server
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, ENCRYPTION_KEY, SMTP
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed            # creates ethics.officer@utthunga.com / Admin@123
npm run dev              # http://localhost:5050
```

### Client
```
cd client
cp .env.example .env
npm install
npm run dev               # http://localhost:5190
```

## Default login
`ethics.officer@utthunga.com` / `Admin@123` — change immediately after first login.
# Whistleblower-project
