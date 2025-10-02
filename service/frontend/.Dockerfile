FROM oven/bun:1-alpine AS build
WORKDIR /app

# Устанавливаем зависимости и собираем фронтенд (Bun)
COPY ./web/package.json ./package.json
COPY ./web/bun.lock ./bun.lock
RUN bun install --frozen-lockfile
COPY ./web ./
RUN bun run build

FROM nginx:stable

# Складываем сборку в образ
COPY --from=build /app/dist /opt/app/dist

EXPOSE 80
# Копируем сборку в примонтированный www и запускаем nginx
CMD ["/bin/sh", "-c", "cp -rf /opt/app/dist/* /usr/share/nginx/html/ && nginx -g 'daemon off;'" ]
