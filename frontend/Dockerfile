# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Store as template; BACKEND_URL is substituted at container startup
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Default for Docker Compose (service name = 'backend')
ENV BACKEND_URL=http://backend:8000

EXPOSE 80

# envsubst replaces ${BACKEND_URL} in the template, then starts nginx
CMD ["/bin/sh", "-c", \
  "envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
