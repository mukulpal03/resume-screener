FROM node:20-alpine AS base
RUN npm install -g pnpm@9.0.0

# ---- prune stage ----
# turborepo prune creates a minimal subset of the monorepo
# containing only apps/api and its workspace dependencies
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@2
COPY . .
RUN turbo prune @repo/api --docker

# ---- install stage ----
FROM base AS installer
WORKDIR /app

# Copy the pruned lockfile + package manifests (no source yet)
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install only the deps needed for api + its workspace packages
RUN pnpm install --frozen-lockfile

# ---- build stage ----
FROM base AS builder
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .

# Generate Prisma client (if db package uses Prisma)
RUN pnpm --filter @repo/db db:generate || true

# Build the api (compiles TypeScript → dist/)
RUN pnpm --filter @repo/api build

# ---- production stage ----
FROM node:20-alpine AS runner
RUN npm install -g pnpm@9.0.0
WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed to run
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

WORKDIR /app/apps/api

EXPOSE 8080

CMD ["node", "dist/server.js"]