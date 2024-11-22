FROM node:22 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install
COPY . .

RUN npm run build

FROM node:22 AS production

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

RUN npm install --only=production

ENV NODE_ENV=production

CMD ["npm", "start"]
