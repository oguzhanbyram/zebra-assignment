FROM node:22.14.0-alpine3.21

WORKDIR /app
COPY package*.json yarn.lock ./
RUN --mount=type=cache,target=/root/.cache/yarn yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3000

CMD ["node", "dist/main"]
