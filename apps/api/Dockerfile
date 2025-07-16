FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
COPY . .
RUN npm ci
RUN npx prisma generate
RUN npm run build

FROM node:20 AS prod
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
