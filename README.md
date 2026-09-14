# Dar Al Munira — International Islamic University Islamabad

A modern, elegant, **bilingual (Arabic RTL / English LTR)** web platform for
**Dar Al Munira**, an Islamic learning center at the International Islamic
University Islamabad (IIUI). It provides a premium public website, multi‑step
**student** and **instructor** registration with document uploads, a
**news / announcements** system, and a full **analytics admin dashboard**.

The visual identity follows the provided UI blueprint: an emerald + leaf‑green +
teal palette, glassmorphism surfaces, Marcellus / Manrope / Amiri typography,
rounded cards, soft shadows, and smooth animations.

> Developed by **Roqaya K7an**.

---

## ✨ Features

**Public site**
- Full‑screen glassy **hero** with the building cover image and dark green→teal overlay
- **About** (Vision, Mission, Goals, Islamic Values, Environment, Excellence)
- **Courses** — Tajweed (Beginner/Intermediate/Advanced), Hifz ul Qur'an,
  Understanding Qur'an, Hifz ul Ahadees, Hifz Mutun, Aqeedah, Explanation of Mutun
- **Teachers** cards
- **News & Announcements** (managed from the dashboard)
- **Contact** with form + Google Maps embed
- Instant **language switch** (Arabic ↔ English) with true RTL mirroring

**Registration**
- Multi‑step **student** and **instructor** forms (React Hook Form + Zod)
- **Drag‑and‑drop file uploads** with image/PDF preview, replace & remove,
  size + type validation (PDF, JPG, JPEG, PNG)
- Duplicate‑submission prevention (email / phone / registration or employee no.)
- Friendly validation messages, review step before submit

**Admin dashboard**
- Secure JWT login (httpOnly cookie) + middleware‑protected routes
- KPI cards: students, instructors, registrations, pending, approved, rejected
- **Charts** (Recharts): monthly line trend, status donut, course bar,
  nationality / department / academic‑level breakdowns
- Applications tables with **search, filters, CSV export, print**
- Detail drawer: full profile, **preview & download** uploaded ID cards / CVs / certificates
- Approve / Reject / Archive / Delete
- **Announcements** management (bilingual CRUD, pin, publish/unpublish)
- **Dark mode**, responsive sidebar, smooth animations

**Security & quality**
- Input validation everywhere (Zod), text sanitisation, parameterised queries (Prisma)
- Auth + authorization, protected file downloads, path‑traversal‑safe storage
- Per‑IP rate limiting on public endpoints, security headers
- SEO metadata, accessible markup, lazy‑loaded charts, reduced‑motion support

---

## 🧱 Tech stack

| Layer     | Technology |
|-----------|------------|
| Framework | **Next.js 14** (App Router) + **React 18** + **TypeScript** |
| Styling   | **Tailwind CSS** (custom design tokens), glassmorphism |
| Forms     | **React Hook Form** + **Zod** |
| Animation | **Framer Motion** |
| Icons     | **Lucide** |
| Charts    | **Recharts** |
| Backend   | **Next.js Route Handlers** (Node runtime) — the REST API |
| ORM / DB  | **Prisma** + **SQLite** (dev) → **PostgreSQL / Supabase** (prod) |
| Auth      | **jose** (JWT) + **bcryptjs** |
| Storage   | Local disk (dev) → **Supabase Storage** (prod) |

> **A note on the backend.** The brief mentioned Node/Express. This project uses
> **Next.js Route Handlers**, which run on the same Node runtime and expose a
> conventional REST API — but as a **single deployable unit** (simpler to run,
> host, and secure than a separate Express server). Every handler lives under
> `src/app/api/**/route.ts` and maps 1:1 to an Express route; porting to a
> standalone Express server is straightforward if required.

---

## 🚀 Getting started

### Prerequisites
- Node.js **18.18+** (tested on Node 22)
- npm

### 1. Install
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and set at least `JWT_SECRET` (generate with `openssl rand -base64 48`)
and the seeded admin credentials.

### 3. Create the database & seed
```bash
npm run db:push      # create tables from prisma/schema.prisma
npm run db:seed      # create the admin + sample data
```

### 4. Run
```bash
npm run dev          # http://localhost:3000
```

- Public site: **http://localhost:3000**
- Admin login: **http://localhost:3000/admin/login**
  - Email / password come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`
  - Defaults: `admin@darmuneerah.edu.pk` / `ChangeMe!2026` — **change these**

### Production
```bash
npm run build
npm start
```

### Useful scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm start` | Start the production server |
| `npm run db:push` | Sync schema to the database |
| `npm run db:seed` | Seed admin + sample data |
| `npm run db:reset` | Drop, recreate and re‑seed |
| `npm run db:studio` | Open Prisma Studio |
| `npm run lint` | Lint |

---

## 🖼️ Brand assets

The site renders fully with built‑in **SVG placeholders** for both logos and the
building cover, so nothing is broken on first run. To use the real assets:

- **Hero building photo** → drop your image at `public/images/building.jpg`.
  The hero picks it up automatically (falls back to `building.svg` until then).
- **Logos** → the IIUI and Dar Al Munira logos are inline SVGs in
  `src/components/ui/Logo.tsx`. To use real image files, place
  `public/images/dar-logo.png` / `iiui-logo.png` and swap the `<svg>` for `<img>`.

Set your real social links in `.env`
(`NEXT_PUBLIC_FACEBOOK_URL`, `NEXT_PUBLIC_WHATSAPP_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, …).

---

## 🗂️ Project structure

```
prisma/
  schema.prisma          # DB models (SQLite dev / Postgres prod)
  seed.ts                # admin + sample data
public/images/           # building + logo assets (placeholders included)
src/
  app/
    layout.tsx           # fonts, <html dir/lang>, providers
    page.tsx             # landing (hero, about, courses, teachers, news, contact)
    register/student|instructor/    # multi-step registration pages
    admin/
      login/             # admin sign-in
      (panel)/           # protected: dashboard, students, instructors, announcements
    api/                 # REST API (route handlers)
      register/student|instructor/
      auth/login|logout/
      admin/stats | applications | files | announcements/
      announcements/ contact/
  components/
    site/                # navbar, hero, about, courses, teachers, news, contact, footer
    forms/               # StudentForm, InstructorForm
    admin/               # AdminShell, Charts, StatCard, ApplicationsTable
    ui/                  # Field, FileUpload, Stepper, Logo, Social, LanguageSwitch, Reveal
  lib/
    db.ts auth.ts api.ts storage.ts uploads.ts validations.ts constants.ts utils.ts
    i18n/                # dictionary.ts (EN/AR) + provider.tsx
  middleware.ts          # protects /admin/**
```

---

## 🔌 API overview

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/api/register/student` | — | Create student application (multipart + files) |
| POST | `/api/register/instructor` | — | Create instructor application (multipart + files) |
| POST | `/api/contact` | — | Contact message |
| GET  | `/api/announcements` | — | Published announcements |
| POST | `/api/auth/login` | — | Admin login (sets cookie) |
| POST | `/api/auth/logout` | — | Sign out |
| GET  | `/api/admin/stats` | ✅ | Dashboard analytics |
| GET  | `/api/admin/applications` | ✅ | List + search/filter |
| PATCH / DELETE | `/api/admin/applications/{kind}/{id}` | ✅ | Update status / delete |
| GET  | `/api/admin/files/{id}` | ✅ | Preview / download an upload |
| GET/POST | `/api/admin/announcements` | ✅ | List / create |
| PATCH / DELETE | `/api/admin/announcements/{id}` | ✅ | Update / delete |

---

## 🐘 Switching to PostgreSQL / Supabase (production)

1. In `prisma/schema.prisma` set:
   ```prisma
   datasource db { provider = "postgresql"  url = env("DATABASE_URL") }
   ```
   (Optionally promote the `status` string fields to native `enum`s.)
2. Set `DATABASE_URL` to your Supabase/Postgres connection string.
3. `npm run db:push && npm run db:seed`.

### Supabase Storage (files)
`src/lib/storage.ts` isolates all file I/O behind `saveFile` / `readFile` /
`deleteFile`. Replace their bodies with Supabase Storage calls
(`supabase.storage.from(bucket).upload/download/remove`) using
`SUPABASE_SERVICE_ROLE_KEY`; no callers change.

---

## 🚢 Deployment

- **Vercel** (recommended): import the repo, add the env vars, and set
  `DATABASE_URL` to a hosted Postgres/Supabase instance. Use Supabase Storage
  for uploads (Vercel's filesystem is read‑only at runtime).
- **Node host / Docker**: `npm run build && npm start`; mount a writable volume
  for `UPLOAD_DIR` if keeping local disk storage.

---

## 📄 License

Built for Dar Al Munira, IIUI. All rights reserved.
