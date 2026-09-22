FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Vite inlines env vars into the bundle at build time, not runtime — Railway
# (and `docker build --build-arg`) must supply this for it to take effect.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
# `npm start` runs `vite preview`, so vite (a devDependency) has to stay
# available at runtime — reusing the build stage's node_modules instead of
# a second `npm ci --omit=dev` here.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json vite.config.ts ./
EXPOSE 3000
CMD ["npm", "start"]
