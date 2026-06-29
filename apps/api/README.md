# @repo/api — ResumeAI Express Backend

This is the Node.js / Express 5 API gateway and background task execution processor for the ResumeAI engine. It handles user webhook syncs, incoming file uploads, text extraction, rate limiting, task queueing, and LLM structured generation.

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: Express 5 (using custom error handlers and async routers)
- **Authentication**: `@clerk/express` for route guard checks
- **Ingestion & Parsing**:
  - `multer` for memory buffer file uploads
  - `pdf-parse` / `pdf-parse-new` for PDF extraction
  - `mammoth` for DOCX extraction
- **Job Orchestration**: `bullmq` + `ioredis` to manage background jobs and SSE message publishing
- **AI Integration**: `@langchain/core` / `@langchain/google` / `@langchain/openai` for structured schema queries
- **ORM & DB**: Drizzle ORM for PostgreSQL mapping
- **Validation**: Shared Zod schemas (`@repo/validation`)

---

## 📂 Key Directory Layout

```
apps/api/src/
├── config/        # Database initialization, multer config, and env validation
├── controllers/   # Route controllers (auth sync, resume analysis queues, status streaming)
├── middleware/    # Global error handlers, Clerk authentication guards, Zod validators, and rate limiters
├── queues/        # BullMQ Queue instance declarations and helper definitions
├── routes/        # Router tables (/resume, /results, /webhook)
├── services/      # Business logic (LLM integrations and database calls)
├── utils/         # Helper functions (CORS configs, system prompts, error types)
├── workers/       # BullMQ worker loop setup and job handler logic
├── app.ts         # Express app initialization and webhook routing mounts
└── server.ts      # HTTP Server launch script
```

---

## ⚙️ Setup and Configuration

Ensure you have created and populated your local `.env` file within this directory:

```bash
cp .env.example .env
```

### Script Executions (from this directory or via Turbo)

- **Run Development Server** (using `ts-node`):
  ```bash
  pnpm run dev
  ```
- **Build Production Bundle** (using `tsup`):
  ```bash
  pnpm run build
  ```
- **Start Production Server**:
  ```bash
  pnpm run start
  ```

---

## 🔒 Security & Scaling Notes

1. **Synchronous File Parsing**: Ingested files are parsed instantly into raw string text in the controller before queue enqueueing. This ensures Redis never stores binary file buffers, avoiding high memory overhead and serialization blocks.
2. **Graceful Worker Shutdown**: The server monitors `SIGTERM` and `SIGINT` to shut down the BullMQ workers cleanly, preventing database connection leaks and aborted jobs.
3. **SSE Connection Lifespans**: Server-Sent Events streams use HTTP keep-alive settings to prevent proxies (e.g. Nginx, Cloudflare) from prematurely terminating connections during high-latency LLM generations.
