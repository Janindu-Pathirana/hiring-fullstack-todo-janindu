FROM node:22-bookworm AS build

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

ENV NX_DAEMON=false
ENV CI=true

RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm exec nx build server

FROM node:22-bookworm

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/dist/apps/server ./

RUN npm install --omit=dev

ENV PORT=3030

EXPOSE 3030

CMD ["node", "main.js"]
