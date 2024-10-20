FROM node:20 as base
RUN npm i -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run drizzle:generate

RUN pnpm build

FROM base AS deploy
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/dist/ ./dist
COPY --from=build /app/drizzle/ ./drizzle/
COPY --from=build /app/drizzle.config.ts ./
COPY --from=build /app/node_modules ./node_modules

CMD ["pnpm", "run", "start:prod"]
