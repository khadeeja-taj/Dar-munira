# Deploy Dar Munira to Netlify (step by step, error-free)

This app runs great on Netlify, but you **must** give it a hosted PostgreSQL
database. Netlify (like all serverless hosts) has no persistent disk, so the
dev SQLite file cannot be used. Everything else is already configured for you
in `netlify.toml`.

---

## Step 1 — Create a free PostgreSQL database

Pick **one** (all have a free tier). Copy the connection string (URI) it gives
you — it looks like `postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require`.

- **Neon** (recommended, fastest): https://neon.tech → New Project → copy the
  "Connection string".
- **Supabase**: https://supabase.com → New Project → Project Settings →
  Database → Connection string → **URI**.
- **Netlify DB**: in your Netlify site, go to **Extensions** and add
  **Neon** — it provisions a database and sets `DATABASE_URL` for you
  automatically (if you use this, you can skip setting `DATABASE_URL` in Step 3).

> Tip: if your provider offers a "pooled" and a "direct" connection, use the
> **pooled** URL for a serverless host like Netlify.

---

## Step 2 — Connect the repo to Netlify

1. Go to https://app.netlify.com → **Add new site** → **Import an existing project**.
2. Choose **GitHub** and pick the repository **khadeeja-taj/Dar-munira**.
3. Select the branch you want to deploy (e.g. `main`).
4. Netlify reads `netlify.toml`, so the **build command** and **plugin** are
   already filled in. Do **not** change them. Click **Deploy** *after* Step 3.

---

## Step 3 — Set the environment variables

In Netlify: **Site configuration → Environment variables → Add a variable**.
Add these (values are examples — use your own):

| Key              | Value                                                        | Required |
|------------------|-------------------------------------------------------------|----------|
| `DATABASE_URL`   | the PostgreSQL URI from Step 1                               | **Yes**  |
| `JWT_SECRET`     | a long random string — generate with `openssl rand -base64 48` | **Yes** |
| `ADMIN_EMAIL`    | `admin@darmuneerah.edu.pk`                                   | **Yes**  |
| `ADMIN_PASSWORD` | a strong password (you log in with this)                    | **Yes**  |
| `ADMIN_NAME`     | `Administrator`                                              | No       |
| `SEED_SAMPLES`   | `false` for a clean production site (`true` adds demo data) | No       |

> Set these **before** the first deploy. If `DATABASE_URL` or `JWT_SECRET` is
> missing, the build fails — that is the #1 cause of "deploy error".

---

## Step 4 — Deploy

Click **Deploy site** (or **Trigger deploy → Deploy site**). The build will:

1. switch Prisma to PostgreSQL,
2. create the database tables,
3. create your admin account,
4. build and publish the site.

First build takes ~2–4 minutes.

---

## After it's live

- **Site:** the URL Netlify shows (e.g. `https://your-site.netlify.app`).
- **Admin panel:** add `/admin/login` to that URL and sign in with `ADMIN_EMAIL`
  and the `ADMIN_PASSWORD` you set.
- Every future `git push` to the connected branch auto-redeploys.

---

## Troubleshooting

- **"Query engine library ... could not be found"** — already fixed: the Prisma
  schema declares the Lambda `binaryTargets`. Make sure you deployed the latest
  commit.
- **Build fails at `prisma db push`** — `DATABASE_URL` is missing, wrong, or the
  database rejects connections. Re-check Step 1/3 and that the URL ends with
  `?sslmode=require` if your provider needs SSL.
- **Login fails after deploy** — confirm `ADMIN_EMAIL` / `ADMIN_PASSWORD` were
  set before the deploy that ran the seed. If you added them later, trigger a
  new deploy so the seed runs again.
- **Uploaded files** — they are stored inside the database (not on disk), so
  they persist fine on Netlify. No object storage needed.
