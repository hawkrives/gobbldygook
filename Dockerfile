FROM node:10-slim AS build

WORKDIR /app
COPY ./modules ./modules
COPY ./package.json ./yarn.lock ./

RUN yarn install

COPY ./.babelrc ./

RUN yarn build

#########

FROM node:10-alpine AS prod

WORKDIR /public
COPY --from=build /app/modules/gob-web/build/* ./
