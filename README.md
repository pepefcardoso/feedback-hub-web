<!-- README.md -->

# Feedback Hub — Web

Web client for Feedback Hub: submit, browse, and vote on feature requests, with an admin dashboard to triage and update status.

## Problem

Feedback Hub's [API](https://github.com/pepefcardoso/feedback-hub) has no UI of its own — this app is the surface end users and admins actually interact with, covering public browsing, authenticated voting/commenting, and an admin-only status board.

## Stack

| Layer         | Technology                                         |
| ------------- | -------------------------------------------------- |
| Framework     | Next.js 16 (App Router), React 19, TypeScript      |
| Styling       | Tailwind CSS 4, shadcn/ui, Radix UI                |
| Forms         | React Hook Form + Zod                              |
| Data fetching | Custom `apiClient` wrapper (`fetch`, cookie-based) |

## Architecture

```
Browser
   │
   ▼
Next.js App Router (Server + Client Components)
   │
   ├── AuthContext ──▶ GET /users/me (on mount, via apiClient)
   │
   └── apiClient (lib/api-client.ts)
         - injects cookies (server + client)
         - unwraps { status, data } envelope
         - redirects to /login on 401 (unless skipRedirect)
         │
         ▼
   Feedback Hub API (NEXT_PUBLIC_API_URL)
```

`apiClient` is the single entry point for all API calls — server components call it directly during render, client components call it from event handlers and effects. It throws a typed `AppError` on non-2xx responses.

## Key features

| Domain   | Features                                                     |
| -------- | ------------------------------------------------------------ |
| Public   | Landing page, roadmap, about, privacy pages                  |
| Auth     | Login, register, session bootstrap via `AuthContext`         |
| Feedback | List with sort, create (modal), detail page, upvote/downvote |
| Comments | List and add comments on a feedback item                     |
| Profile  | View own account                                             |
| Admin    | Feedback table with inline status update (role-gated)        |

## Project structure

```
app/
  page.tsx              # landing
  login/ register/       # auth pages
  feedback/[id]/           # feedback detail
  admin/                     # admin dashboard (status triage)
  profile/                     # user profile
  about/ roadmap/ privacy/       # static pages
components/
  feedback/             # feedback-list, feedback-card, feedback-sort, vote-button, create-feedback-modal
  comment/               # comment-list, comment-form
  admin/                   # admin-feedbacks-table
  layout/                    # navbar, sidebar, footer, user-nav
  ui/                          # shadcn/ui primitives
context/
  AuthContext.tsx        # session state, fetched via /users/me on mount
lib/
  api-client.ts         # fetch wrapper: cookies, envelope unwrap, 401 redirect
  utils.ts
types/
  feedback.ts / comment.ts   # shared DTOs matching the API
docs/                # architecture-guidelines, security-guidelines, design-docs, ui-ux-guidelines
```

## Getting started

### Prerequisites

- Node.js 20+
- The [feedback-hub API](https://github.com/pepefcardoso/feedback-hub) running locally

### Install

```bash
git clone https://github.com/pepefcardoso/feedback-hub-web.git
cd feedback-hub-web
npm install
cp .env.example .env
npm run dev
```

App runs at `http://localhost:3000`.

## Environment variables

| Variable              | Description                                         | Example / Required          |
| --------------------- | --------------------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the Feedback Hub API, no trailing slash | `http://localhost:3333/api` |

## Testing

No automated test suite is configured yet (no `test` script, no test files). Current gate before commit:

```bash
npm run lint
```

## Deployment

Deploys as a standalone Next.js project (Vercel):

1. Import the repo, framework preset auto-detects Next.js.
2. Set `NEXT_PUBLIC_API_URL` to the deployed backend's URL (e.g. `https://feedback-hub-api.onrender.com/api`, no trailing slash).
3. Deploy, then set the backend's `FRONTEND_URL` to this app's production URL and redeploy the backend so CORS picks it up.

Auth cookies are cross-domain in this setup (`.vercel.app` ↔ `.onrender.com`) — both must be served over HTTPS or the browser will reject the cookie. See the backend's [deployment notes](https://github.com/pepefcardoso/feedback-hub#deployment) for the cookie configuration this depends on.

## Non-negotiable rules

See [`docs/architecture-guidelines.md`](./docs/architecture-guidelines.md) and [`docs/security-guidelines.md`](./docs/security-guidelines.md) — shared with the backend repo.

## License

No `LICENSE` file is present in the repository.
