# Deploy Dar Munira (easiest — Render, one platform)

The repo includes a `render.yaml` blueprint that creates the database **and** the
app together and connects them automatically. You only click through and set one
password.

## Steps
1. Go to **https://render.com** and sign in with **GitHub**.
2. Click **New +** → **Blueprint**.
3. Select the repository **roqaya-k7an/Dar-AL-Munir** and the branch **main**.
4. Render reads `render.yaml` and shows a database + a web service. Click
   **Apply**.
5. It will ask for the one value marked "set in dashboard":
   - **ADMIN_PASSWORD** → type a strong password (you'll use it to log in).
6. Click **Apply / Create**. Wait for the build to finish (first build ~3–5 min).

## After it's live
- Your site: the URL Render shows (e.g. `https://dar-muneerah.onrender.com`).
- Admin panel: add **`/admin/login`** to that URL and sign in with
  `admin@darmuneerah.edu.pk` and the password you set in step 5.
- Every future `git push` auto-redeploys.

## Notes (free tier)
- The web service **sleeps after ~15 min of inactivity**; the first visit after
  that takes ~30 seconds to wake, then it's fast.
- The free PostgreSQL database is free for 90 days; upgrade or recreate after
  that. For always-on with no sleep, upgrade the web service to a paid instance.

## Alternative: Vercel + Supabase
See the README. Vercel never sleeps (better for production) but needs a separate
Supabase Postgres database. The `vercel-build` script handles the DB setup.
