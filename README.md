# ResumeAI — Resume Screener & Evaluation Engine

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-red.svg)](https://turbo.build/)
[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2016-black.svg)](https://nextjs.org/)
[![Express 5](https://img.shields.io/badge/Backend-Express%205-green.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Queue-Redis%20%2F%20BullMQ-red.svg)](https://redis.io/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle-yellowgreen.svg)](https://orm.drizzle.team/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF.svg)](https://clerk.com/)

ResumeAI is an asynchronous, LLM-powered resume evaluation engine designed to screen resumes against specific job descriptions. Instead of simple pattern matching, it extracts semantic context, measures alignment across multiple dimensions (skills, experience, education), and generates structured, actionable suggestions.

Built as a **production-grade PNPM monorepo**, the application showcases asynchronous job queue architectures, shared schema validations, Server-Sent Events (SSE) for real-time progress streaming, and strict engineering hygiene.

---

## 🏗️ System Architecture & Data Flow

Below is the high-level architecture showing how the client, API gateway, job queue, background worker, database, and LLM services interact:

```mermaid
sequenceDiagram
    autonumber
    actor User as Client (Next.js)
    participant API as API Gateway (Express 5)
    participant Queue as Redis Queue (BullMQ)
    participant DB as PostgreSQL (Drizzle)
    participant LLM as LLM Provider (Gemini/OpenAI)

    User->>API: POST /resume/analyze (Resume File + JD) [Clerk Token]
    Note over API: 1. Validate auth token<br/>2. Check monthly usage quota<br/>3. Parse PDF/DOCX to text
    API-->>User: 2022 Accepted (Returns jobId)

    API->>Queue: Enqueue analysis job { jobId, userId, text }
    User->>API: GET /resume/status/:jobId (Listen via SSE)

    activate Queue
    Note over Queue: Worker picks up job
    Queue->>LLM: Send context & prompt with Structured Zod Schema
    LLM-->>Queue: Return Validated JSON Output
    Queue->>DB: Store Resume Result (Postgres)
    Queue->>API: Publish status (done + resultId)
    deactivate Queue

    API-->>User: Stream event update via SSE (Done + resultId)
    User->>API: GET /results/:id
    API->>DB: Fetch Analysis Details
    DB-->>API: Return Result
    API-->>User: Display Report UI
```

---

## 🚀 Key Architectural Highlights

### 1. Monorepo Organization

The repository uses **Turborepo** and **PNPM Workspaces** to enforce a clean separation of concerns while sharing code, schemas, and configurations:

- **`apps/web`**: Next.js 16 (App Router) user interface utilizing Tailwind CSS v4, Framer Motion, and Clerk client authentication.
- **`apps/api`**: Express 5 server orchestrating API routes, file parsing, and hosting the background task worker.
- **`packages/db`**: Database schema declarations and migrations powered by Drizzle ORM.
- **`packages/types`**: Shared TypeScript definitions, ensuring compile-time contracts between frontend and backend.
- **`packages/validation`**: Shared Zod validation schemas. A single source of truth for request payloads, database inputs, and LLM structured outputs.
- **Shared Configs**: Standardized compiler settings (`@repo/typescript-config`), lint rules (`@repo/eslint-config`), and styling defaults (`@repo/tailwind-config`).

### 2. Event-Driven Asynchronous Processing

LLM API calls are high-latency and prone to timeout or failure. The pipeline is split to ensure a reliable user experience:

- **Fast Ingestion**: The HTTP request is parsed, the text extracted, and a job enqueued using **BullMQ** and **Redis**. The client immediately receives a `202 Accepted` response.
- **Unidirectional Streaming (SSE)**: The client opens a lightweight **Server-Sent Events (SSE)** stream. The background worker publishes job events (`parsing`, `llm_analysis`, `done`) which are instantly broadcast to the client.
- **Graceful Worker Shutdown**: The API process intercepts `SIGTERM` and `SIGINT` to gracefully shutdown active BullMQ workers, ensuring jobs are safe-failed or requeued rather than lost.

### 3. Type-Safe Structured LLM Integration

Many AI projects suffer from flaky prompt engineering and regex-based JSON parsing. ResumeAI implements a deterministic contract:

- Uses LangChain's `.withStructuredOutput` coupled with our shared `@repo/validation` Zod schema to enforce that the LLM returns exactly the required JSON structure.
- Implements a retry-with-backoff mechanism (up to 2 retries) if the model yields invalid structures or times out.

### 4. Database Syncing via Webhooks

User identities are securely managed through Clerk. To maintain local copy consistency:

- Clerk triggers webhooks on user creation, update, or deletion.
- The webhook endpoint validates payload authenticity using `svix` raw-body checks.
- A local user row is synced in PostgreSQL, maintaining referential integrity for resume results.

---

## 📁 Repository Structure

```
resume-screener/
├── apps/
│   ├── api/             # Express API, controllers, & in-process BullMQ workers
│   └── web/             # Next.js App Router UI
├── packages/
│   ├── db/              # Drizzle ORM schemas, migration setup, and client
│   ├── types/           # Shared TypeScript interfaces & API shapes
│   ├── validation/      # Shared Zod schemas (API payload, DB inputs, LLM outputs)
│   ├── eslint-config/   # Monorepo lint configurations
│   └── typescript-config/ # Shared tsconfig bases
├── docker-compose.yml   # Docker configuration (primarily Redis container)
├── package.json         # Workspace root package settings
└── turbo.json           # Turborepo task pipeline configuration
```

---

## 🛠️ Getting Started & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18.0.0)
- [PNPM](https://pnpm.io/) (>= 9.0.0)
- A running [PostgreSQL](https://www.postgresql.org/) Database
- A running [Redis](https://redis.io/) instance

### 1. Environment Variable Setup

Create `.env` files in both the API and Web applications using the templates below.

#### API Environment Variables (`apps/api/.env`)

Create `apps/api/.env` using the fields outlined in [apps/api/.env.example](file:///e:/resume-screener/apps/api/.env.example):

```env
PORT=3000
NODE_ENV="development"
FRONTEND_URL=http://localhost:3001
CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
CLERK_WEBHOOK_SECRET="your_clerk_webhook_secret"

# LLM Config — Supports "openai" or "gemini"
LLM_PROVIDER="openai"
OPENAI_API_KEY="your_openai_api_key"
OPENAI_MODEL="gpt-4o-mini"
GOOGLE_API_KEY="your_google_api_key"
GOOGLE_MODEL="gemini-2.5-flash"

# Redis Connection URL
REDIS_URL="redis://localhost:6379"

# PostgreSQL Connection URL
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

#### Frontend Environment Variables (`apps/web/.env`)

Create `apps/web/.env` using the fields outlined in [apps/web/.env.example](file:///e:/resume-screener/apps/web/.env.example):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 2. Local Installation

```bash
# Clone the repository
git clone https://github.com/your-username/resume-screener.git
cd resume-screener

# Install all dependencies across the monorepo
pnpm install
```

### 3. Database Initial Setup

From the root directory, run database migrations to prepare your Postgres schema:

```bash
# Generate Drizzle migration files
pnpm --filter=@repo/db db:generate

# Execute the migrations onto the active Database
pnpm --filter=@repo/db db:push
```

### 4. Running the Development Servers

Spin up the Turborepo development pipeline. This starts the Next.js frontend on port `3001` and the Express API on port `3000`:

```bash
pnpm dev
```

---

## 🔌 API Documentation

All request payloads are validated via Zod on the server.

### 1. File Upload & Analysis Queue

- **Endpoint**: `POST /resume/analyze`
- **Headers**: `Authorization: Bearer <clerk_token>`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `resume` _(File: .pdf, .docx)_
  - `jobDescription` _(String, min length: 50, max length: 5000)_
- **Response**: `202 Accepted`

```json
{
  "success": true,
  "message": "Resume uploaded and analysis queued",
  "jobId": "job-abc-123"
}
```

### 2. Real-Time Status Stream

- **Endpoint**: `GET /resume/status/:jobId`
- **Headers**: `Authorization: Bearer <clerk_token>`
- **Protocol**: Server-Sent Events (SSE)
- **Emitted Events**:
  - `parsing`: File is being ingested and text extracted.
  - `llm_analysis`: Prompt context assembled and sent to LLM provider.
  - `done`: Analysis successfully resolved. Payload includes `resultId`.
  - `failed`: Execution encountered an error.

### 3. Retrieve Analysis Result

- **Endpoint**: `GET /results/:id`
- **Headers**: `Authorization: Bearer <clerk_token>`
- **Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "result-xyz",
    "jobTitle": "Senior Backend Developer",
    "overallScore": 85,
    "skillsMatchScore": 90,
    "experienceScore": 80,
    "educationScore": 85,
    "matchedKeywords": ["Node.js", "Redis", "TypeScript"],
    "missingKeywords": ["Docker", "Kubernetes"],
    "suggestions": {
      "summary": ["Highlight experience with container orchestration..."],
      "experience": ["Quantify accomplishments in scaling background queues..."],
      "skills": ["Add Docker explicitly under technical skills..."]
    }
  }
}
```

---

## 🛠️ Key Engineering Decisions & Trade-Offs

During development, several critical design decisions were made to prioritize system efficiency and robustness:

### Q: Why parse resume text before adding jobs to the Redis queue?

- **Problem**: PDF/DOCX uploads create large binary buffers. Storing these large files inside Redis queues degrades performance, causes significant network latency during serialization/deserialization, and spikes memory usage (Redis is an in-memory store).
- **Solution**: The API parses the file content into plain text _synchronously_ in the route handler. Only the parsed plain-text string and metadata are placed inside the Redis queue payload, keeping Redis memory footprint extremely light.

### Q: Why use Server-Sent Events (SSE) over WebSockets?

- **Problem**: Displaying the real-time stages of asynchronous LLM processing is a UX requirement. WebSockets require managing stateful TCP handshakes, maintaining active connection pools, and handling complex connection drops on the API server.
- **Solution**: Since the state transitions flow strictly from server to client (one-way updates), SSE is the optimal choice. It operates natively over HTTP/2, utilizes automatic reconnection protocols, and is far lighter to maintain at scale compared to bidirectional WebSockets.

### Q: Why run workers in-process for the MVP?

- **Problem**: Designing a multi-service structure can complicate deployment pipelines on services like Railway or Render for a MVP project.
- **Solution**: The queue worker is booted on the same process as the Express app. However, it is fully isolated in `apps/api/src/workers` and is designed to build into its own target. This allows quick splitting of the worker into an autonomous `@repo/worker` container for independent horizontal scaling under heavy loads.

---

## 🎯 Production Roadmap

To transition this from a portfolio project to an enterprise SaaS, the following additions are scheduled:

1. **LLM Evaluation Suite**: Integrate an evaluation framework (like Braintrust or LangSmith) with mock fixtures in the CI pipeline. This ensures updates to system prompts do not cause regression in scoring or suggestion qualities.
2. **Hybrid Keywording (Embeddings)**: Supplement standard keyword string search with semantic keyword comparisons using vector embeddings (e.g., `text-embedding-3-small` comparing resume vectors and JD vectors).
3. **Dedicated Worker Scaling**: Extract the background queue runner into a completely separate container cluster, allowing it to scale independently of the API endpoints.
