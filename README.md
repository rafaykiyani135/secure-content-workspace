# BxTrack Round 3 - Secure Content Management System

A robust Role-Based Access Control (RBAC) Content Management System built with a secure-first approach.

## 🚀 Tech Stack

### Frontend

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Vanilla CSS Variables
- **State Management:** Zustand (with Persist middleware)
- **HTTP Client:** Axios (configured for `withCredentials`)
- **Rich Text:** React-Quill-New
- **UI:** Custom components with dark mode support

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT (HttpOnly Cookies)
- **Validation:** Zod
- **Security:** Bcrypt (hashing), CORS (credentials), Cookie-Parser

---

## 🏗️ Project Architecture

### Backend Structure (`/backend`)

- **`controllers/`**: Handles request logic (`auth`, `article`).
- **`services/`**: Business logic & DB interaction.
- **`middlewares/`**:
  - `auth.middleware.js`: Validates HttpOnly cookies & extracts user.
- **`routes/`**: API definitions.
- **`utils/`**: Helper functions (JWT generation).

### Frontend Structure (`/frontend/my-app`)

- **`app/`**: Next.js App Router pages.
  - `dashboard/`: Protected / Authenticated routes.
  - `feed/`: Public guest routes.
  - `(auth)`: Login/Register pages.
- **`lib/`**:
  - `api.ts`: Central Axios instance & API methods.
  - `store.ts`: Global Auth Store (Zustand).
- **`components/`**: Reusable UI (Navbar, Editor, etc.).

---

## 🔐 Role & Permission Logic

We use a strict **3-Tier Role System**:

| Feature               |    **Admin**    |      **Editor**      |     **Viewer**      |
| :-------------------- | :-------------: | :------------------: | :-----------------: |
| **Login/Register**    |       ✅        |          ✅          |         ✅          |
| **View Public Feed**  |       ✅        |          ✅          |         ✅          |
| **View Dashboard**    |       ✅        |          ✅          |         ✅          |
| **View All Articles** | ✅ (All Drafts) | ❌ (Only Own Drafts) | ❌ (Only Published) |
| **Create Article**    |       ✅        |          ✅          |         ❌          |
| **Edit Article**      |    ✅ (Any)     |    ✅ (Own Only)     |         ❌          |
| **Delete Article**    |    ✅ (Any)     |          ❌          |         ❌          |
| **Publish/Draft**     |       ✅        |          ✅          |         ❌          |

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL (or MySQL if configured)

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env file
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/bxtrack\"" > .env
echo "JWT_SECRET=\"super_secure_secret_key_change_me\"" >> .env
echo "FRONTEND_URL=\"http://localhost:3000\"" >> .env
echo "PORT=4000" >> .env

# Push Database Schema
npx prisma db push

# Start Server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend/my-app
npm install

# Start Client
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## ⚖️ Assumptions and Trade-offs

1.  **HttpOnly Cookies over LocalStorage**
    - _Trade-off:_ Slightly more complex development flow (cannot read token in JS, requires CORS credentials) vs. **Significantly higher security** (XSS protection).
2.  **No Email Verification**
    - _Assumption:_ For this Demo test app, trust-on-registration is acceptable.
3.  **Rich Text Storage**
    - _Assumption:_ Storing raw HTML from the editor. In a production environment, this should be sanitized on display (using `dompurify`) to prevent stored XSS, though the HttpOnly cookie mitigates the impact.
4.  **Session Persistence**
    - _Mechanism:_ Use `GET /auth/me` on app load to re-hydrate state from the cookie, rather than persisting sensitive data in `localStorage`.
