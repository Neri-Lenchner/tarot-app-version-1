# node:20-slim (Debian/glibc), not alpine — bcrypt's native binding only
# ships prebuilt binaries for glibc; on alpine's musl libc it falls back to
# compiling from source, which needs a C++ toolchain we'd otherwise have to
# install separately.
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/app.js"]
