# Task Manager

A full-stack student task management application built with Next.js, PostgreSQL, and Prisma. Students can sign up, log in, and manage their personal tasks with priorities, due dates, search, and progress tracking.

## Live Demo

**[http://task-manager-orcin-omega-30.vercel.app/](http://task-manager-orcin-omega-30.vercel.app/)**

---

## Features

### Core Requirements
- **Create** tasks with a title, description, priority, and due date
- **Edit** task titles inline
- **Delete** tasks
- **Mark tasks as completed** with a toggle
- **View pending and completed tasks** separately via filter pills
- **Filter** tasks by All / Pending / Completed
- **PostgreSQL database** via Prisma ORM — all data is persisted

### Bonus Features Implemented
- **Authentication** — JWT-based signup, login, and logout with `httpOnly` cookies
- **Search** — real-time search across task titles
- **Task Priority** — Low / Medium / High with colour-coded badges
- **Due Dates** — optional due date picker per task
- **Dashboard / Statistics** — total, pending, and completed task counts with a live progress bar
- **Deployment** — live on Vercel
- **Form Validation** — email format, minimum password length (6 chars), required title
- **Error Handling** — user-friendly error banners for all API failures

---

## Architecture & Approach

### Frontend
- **Next.js 16 (App Router)** — single-page client component (`page.js`) managing all UI state with React hooks
- **Tailwind CSS 4** — dark-themed, responsive layout that works on mobile and desktop
- Auth state is checked on load via `/api/auth/me`. If not logged in, a login/signup form is shown. If logged in, the full task dashboard is shown.

### Backend
- **Next.js API Routes** (server-side, running on Vercel):
  - `POST /api/auth/signup` — creates user with hashed password
  - `POST /api/auth/login` — validates credentials, sets JWT cookie
  - `POST /api/auth/logout` — clears the cookie
  - `GET /api/auth/me` — returns the current user from the JWT cookie
  - `GET /api/tasks` — returns all tasks for the logged-in user
  - `POST /api/tasks` — creates a new task
  - `PUT /api/tasks/[id]` — updates a task (edit title, toggle complete, etc.)
  - `DELETE /api/tasks/[id]` — deletes a task

### Database
- **PostgreSQL** hosted on Prisma Postgres (Prisma Data Platform)
- **Prisma ORM** for schema management and type-safe queries
- Two models: `User` (id, email, hashed password) and `Task` (id, title, description, priority, dueDate, completed, userId)
- Tasks are scoped to users — you can only access your own tasks

### Authentication
- Passwords hashed with **bcryptjs** (salt rounds: 10)
- Sessions managed with **JSON Web Tokens** (7-day expiry) stored in `httpOnly` cookies — not accessible by JavaScript, preventing XSS attacks

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   ├── logout/route.js
│   │   │   ├── me/route.js
│   │   │   └── signup/route.js
│   │   └── tasks/
│   │       ├── route.js
│   │       └── [id]/route.js
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── lib/
│   ├── auth.js        # JWT sign/verify helpers
│   └── prisma.js      # Prisma client singleton
prisma/
├── schema.prisma      # Database schema
└── migrations/        # Migration history
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- A PostgreSQL database (or a free [Prisma Postgres](https://www.prisma.io/postgres) instance)

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/priyasdharshini641/task-manager.git
cd task-manager
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:
```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key"
```

**4. Run database migrations**
```bash
npx prisma migrate deploy
npx prisma generate
```

**5. Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | Next.js API Routes (server-side) |
| Database | PostgreSQL (Prisma Postgres) |
| ORM | Prisma 6 |
| Auth | JWT (`jsonwebtoken`), bcryptjs |
| Deployment | Vercel |

---

## AI Tools Used

As required by the assignment brief, I am transparently disclosing AI tool usage:

- **Google Antigravity (Gemini)** — used for debugging, code review and identifying deployment issues. All code was reviewed and understood before use.
- **Claude** — used to code generation and running trials.
---

## Submission
**Live URL:** [http://task-manager-orcin-omega-30.vercel.app/](http://task-manager-orcin-omega-30.vercel.app/)
**GitHub:** [github.com/priyasdharshini641/task-manager](https://github.com/priyasdharshini641/task-manager)

