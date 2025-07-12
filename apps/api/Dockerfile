FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:20 AS prod
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY package*.json ./

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
