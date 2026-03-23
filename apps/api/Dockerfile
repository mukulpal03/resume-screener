FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# ---- prune stage ----
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@2
COPY . .
RUN turbo prune @repo/api --docker

# ---- install + build stage ----
FROM base AS builder
WORKDIR /app

# Copy pruned manifests and lockfile, then install
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Copy full pruned source on top (node_modules already present)
COPY --from=pruner /app/out/full/ .

RUN pnpm --filter @repo/db db:generate || true
RUN pnpm --filter @repo/api build

# ---- production stage ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules 
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json

WORKDIR /app/apps/api

EXPOSE 8080

CMD ["node", "dist/server.js"]