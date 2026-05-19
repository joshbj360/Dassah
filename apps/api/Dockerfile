FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ── Dev target: hot reload with ts-node-dev ───────────────────────────────────
FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# ── Build target ──────────────────────────────────────────────────────────────
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# ── Prod target: minimal image ────────────────────────────────────────────────
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
CMD ["npm", "run", "start"]
