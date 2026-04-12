# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Create runtime config entrypoint script
RUN cat > /docker-entrypoint.sh << 'EOF'
#!/bin/sh
# Generate runtime config.js from environment variable
cat > /usr/share/nginx/html/config.js << CFGEOF
window.__API_URL__ = "${VITE_API_URL:-http://localhost:3001}";
CFGEOF

# Start nginx
exec nginx -g 'daemon off;'
EOF
RUN chmod +x /docker-entrypoint.sh

ENV VITE_API_URL=http://localhost:3001

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
