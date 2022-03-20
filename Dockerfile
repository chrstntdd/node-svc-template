FROM node:lts-alpine as base
ENV DOCKER_BUILDKIT=1
ENV PNPM_VERSION 6.32.3
RUN npm --no-update-notifier --no-fund --global install pnpm@${PNPM_VERSION}
WORKDIR /var/app

FROM base AS dev
WORKDIR /var/app
COPY ["package.json", "."]
COPY ["pnpm-lock.yaml", "."]
COPY ["tsconfig.json", "."]
COPY ["scripts/", "./scripts"]
COPY ["src/", "./src"]
# Cache the store
RUN --mount=type=cache,id=pnpm-store,target=/var/.pnpm-store\
    pnpm install --frozen-lockfile --dev
RUN pnpm build

FROM dev AS assets
WORKDIR /var/app
# Cleanup dev deps
RUN rm -rf node_modules && pnpm recursive exec -- rm -rf ./src ./node_modules

FROM base AS prod
ENV NODE_ENV="production"
WORKDIR /var/app
COPY ["package.json", "."]
COPY ["pnpm-lock.yaml", "."]
RUN --mount=type=cache,id=pnpm-store,target=/var/.pnpm-store\
    pnpm install --frozen-lockfile --prod
COPY --from=assets ["/var/app/dist", "./dist"]

EXPOSE 8080
USER node
ENTRYPOINT [ "node", "dist/main.js" ]