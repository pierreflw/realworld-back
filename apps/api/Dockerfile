FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
COPY . .
RUN npm ci
RUN npx prisma generate
RUN npm run build
RUN apt-get update && apt-get install -y vim nano procps

FROM node:20-slim AS prod
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma/seed.ts ./prisma/seed.ts
COPY --from=build /app/prisma/tsconfig.seed.json ./prisma/tsconfig.seed.json
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]