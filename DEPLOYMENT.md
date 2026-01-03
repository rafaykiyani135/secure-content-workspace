# Deployment Guide 🚀

This guide attempts to take your **BxTrack** application to production using **Render** (Backend + Database) and **Netlify** (Frontend).

---

## Part 1: Database (Render)

1.  Log in to [Render.com](https://render.com/).
2.  Click **New +** -> **PostgreSQL**.
3.  **Name:** `bxtrack-db` (or similar).
4.  **Region:** Choose one close to you (e.g., _Frankfurt_ or _Oregon_).
5.  **Plan:** Select **Free** (if available) or the cheapest plan.
6.  Click **Create Database**.
7.  **Wait** for it to be created.
8.  **Copy** the `Internal Connection String` (Looks like `postgres://user:pass@hostname...`). You will need this for the Backend.

---

## Part 2: Backend (Render)

1.  Push your code to **GitHub** (if you haven't already).
2.  In Render, click **New +** -> **Web Service**.
3.  Connect your GitHub Repository.
4.  **Configuration:**
    - **Name:** `bxtrack-backend`
    - **Root Directory:** `backend` (Important! This tells Render to look in the backend folder).
    - **Environment:** Node
    - **Build Command:** `npm install && npx prisma generate`
      - _Note:_ `prisma generate` creates the client files needed for the code to run.
    - **Start Command:** `npx prisma migrate deploy && npm start`
      - _Note:_ This automatically applies any pending database migrations every time you deploy.
5.  **Environment Variables** (Scroll down to "Advanced"):
    - `DATABASE_URL` = Paste the **Internal Connection String** from Part 1.
    - `JWT_SECRET` = Generate a long random string (e.g. `bxtracksolutionsdemoroundthree`).
    - `FRONTEND_URL` = `https://your-netlify-site-name.netlify.app`
      - _Note:_ You don't have this URL yet. For now, enter `http://localhost:3000` or `*` (asterisk) to allow all. **You MUST update this after deploying the frontend.**
6.  Click **Create Web Service**.
7.  **Copy** your Backend URL (e.g., `https://bxtrack-backend.onrender.com`).

---

## Part 3: Frontend (Netlify)

1.  Log in to [Netlify.com](https://www.netlify.com/).
2.  Click **Add new site** -> **Import from Git**.
3.  Connect your GitHub Repository.
4.  **Configuration:**
    - **Base directory:** `frontend/my-app`
    - **Build command:** `npm run build`
    - **Publish directory:** `.next`
    - _Note:_ I have added a `netlify.toml` file in `frontend/my-app`. Netlify should detect this and automatically configure the **Essential Next.js** plugin.

### **Important: Fixing "Page not found" (404)**

If you saw a 404 on all paths, it's usually because:

1.  **Publish Directory was "Not set":** Netlify didn't know the built files were inside `.next`.
2.  **Missing Redirects:** Next.js uses client-side routing. Without the Next.js plugin, Netlify tries to find a physical `.html` file for every URL (like `/dashboard`) and fails.

**The Fix:** The `netlify.toml` I just added tells Netlify exactly what to do and ensures the Next.js plugin is active. Re-deploy your site and it should work! 5. **Environment Variables:** - Click "Add environment variable". - Key: `NEXT_PUBLIC_API_URL` - Value: Your **Render Backend URL** (e.g., `https://bxtrack-backend.onrender.com`). - **Important:** Do NOT add a trailing slash `/` at the end. 6. Click **Deploy site**. 7. Netlify will give you a URL (e.g., `https://amazing-app-123.netlify.app`).

---

## Part 4: Final Connection (CORS Fix)

1.  Go back to **Render Dashboard** > **bxtrack-backend** > **Environment**.
2.  Update `FRONTEND_URL` to your actual Netlify URL (e.g., `https://amazing-app-123.netlify.app`). **Remove any trailing slash.**
3.  **Save Changes**. Render will automatically restart the backend.

---

## Troubleshooting

**Migrations Failed?**
If the Start Command fails on migration, ensure you have committed your `prisma/migrations` folder to GitHub.
If you don't have migrations yet, run `npx prisma migrate dev --name init` locally, commit the generated files, and push again.
