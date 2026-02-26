# Deploy Guide

## Option A: Vercel (Recommended)

1. Go to https://vercel.com and sign in with GitHub.
2. Create a GitHub repo and upload this folder.
3. In Vercel, click `Add New...` -> `Project`.
4. Import your GitHub repo.
5. Framework preset: `Other` (static site).
6. Build command: empty.
7. Output directory: empty.
8. Click `Deploy`.
9. After deploy, open your Vercel URL.

Notes:
- Do not use Supabase `secret` key in frontend.
- `supabase-config.js` only uses public publishable key.

## Option B: GitHub Pages

1. Create a new GitHub repository.
2. Push all files in this folder to the repo root.
3. In GitHub repo: `Settings` -> `Pages`.
4. Source: `Deploy from a branch`.
5. Branch: `main` and folder `/ (root)`.
6. Save and wait 1-2 minutes.
7. Your URL will be:
   `https://<your-github-username>.github.io/<repo-name>/`

If your repo name is not username.github.io, keep relative links as-is (already compatible).
