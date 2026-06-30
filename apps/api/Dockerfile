FROM node:22-alpine AS base
RUN npm install -g pnpm

WORKDIR /app

# Copy all files from the workspace
COPY . .

# Install all dependencies (including devDependencies required for compile)
RUN pnpm install --frozen-lockfile

# Build only the backend API
RUN pnpm build --filter=@repo/api

EXPOSE 3000

# Run migrations and start the server
CMD ["sh", "-c", "pnpm --filter @repo/db db:migrate && pnpm --filter @repo/api start"]
