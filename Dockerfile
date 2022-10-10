# syntax=docker/dockerfile:1

FROM node:alpine

WORKDIR /app

COPY --link package.json .
COPY --link yarn.lock .
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v6 \
    yarn install --frozen-lockfile

COPY --link . .

ENTRYPOINT yarn start
