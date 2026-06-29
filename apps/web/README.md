# web — ResumeAI Frontend Client

This is the user-facing frontend client for ResumeAI, built on Next.js 16 (App Router) and React 19. It provides user authentication, drag-and-drop file upload capabilities, real-time job processing states via Server-Sent Events (SSE), and a detailed results dashboard.

---

## 🛠️ Tech Stack & Styling

- **Framework**: Next.js 16 (App Router) + React 19
- **Authentication**: `@clerk/nextjs` for Client-side page protection and identity management
- **Forms**: `react-hook-form` + `@hookform/resolvers` (Zod integration)
- **Animations**: `framer-motion` for responsive micro-interactions and status progress transitions
- **Icons & Components**: `lucide-react` icons & Radix UI primitives
- **Styling**: Tailwind CSS v4 featuring CSS-variable based fluid design systems

---

## 📂 Key Directory Layout

```
apps/web/
├── app/
│   ├── layout.tsx       # Root layout containing Clerk providers and global styles
│   ├── page.tsx         # Marketing Landing page (Hero, features, CTA, stack overview)
│   ├── results/
│   │   ├── page.tsx     # Past analyses history dashboard
│   │   └── [id]/        # Full evaluation breakdown report
│   └── components/      # Reusable UI widgets (Layouts, file uploaders, skeleton loaders)
├── public/              # Static assets and graphic media
└── services/            # API client wrapper scripts for talking to @repo/api
```

---

## ⚙️ Environment and Scripts

Ensure you have created and populated your local `.env` file within this directory:

```bash
cp .env.example .env
```

### Script Executions (from this directory or via Turbo)

- **Run Local Next Dev Server** (on port `3001`):
  ```bash
  pnpm run dev
  ```
- **Build Next Production Artifact**:
  ```bash
  pnpm run build
  ```
- **Start Production Built Server**:
  ```bash
  pnpm run start
  ```
- **Lint Codebase**:
  ```bash
  pnpm run lint
  ```
- **Static Typecheck**:
  ```bash
  pnpm run check-types
  ```

---

## ⚡ Key Frontend Design Patterns

1. **SSE Hooks (`use-resume.ts`)**: Employs a custom client hook that opens an `EventSource` connection to the API status endpoint. It decodes JSON events (`parsing`, `llm_analysis`, `done`), updates step statuses with transition animations, and automatically cleans up sockets on unmount or component completion.
2. **Skeleton Screen Indicators**: Utilizes customized Radix-based skeleton state screens to optimize perceived load times while results are fetched from Postgres.
3. **Route Guards**: Next.js custom middleware guards the `/results` dashboard routing, prompting users to authenticate using Clerk integration before querying past evaluations.
