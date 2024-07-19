FROM node:20.12.0-alpine AS build

ARG PORT
ARG SOURCE_COMMIT
ENV PORT=${PORT:-7000}

LABEL maintainer="Mango Habanero <main@mango-habanero.dev>"
LABEL description="A sample backend REST API application to showcase fullstack abilities for the jungopharm interview process."
LABEL repository="https://github.com:mango-habanero/jp-backend.git"
LABEL homepage="https://jp.mango-habanero.dev"
LABEL revision=${SOURCE_COMMIT:-unknown}

RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM build

WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist /app/dist

EXPOSE $PORT

CMD ["npm", "start"]

