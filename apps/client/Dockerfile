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

ARG VITE_API_URL=http://localhost:3030
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm exec nx build client

FROM nginx:alpine

COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/apps/client /usr/share/nginx/html

EXPOSE 3000
