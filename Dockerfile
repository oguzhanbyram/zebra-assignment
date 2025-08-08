FROM node:22.14.0-alpine3.21

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

RUN yarn build
EXPOSE 3000

CMD ["node", "dist/main"]
