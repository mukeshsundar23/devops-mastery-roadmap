#!/bin/bash
set -e

REGISTRY="localhost:32000"

echo "🔨 Building backend..."
docker build -t devops-roadmap-backend:latest ./backend
docker tag devops-roadmap-backend:latest $REGISTRY/devops-roadmap-backend:latest
docker push $REGISTRY/devops-roadmap-backend:latest

echo "🔨 Building frontend..."
docker build -t devops-roadmap-frontend:latest ./frontend
docker tag devops-roadmap-frontend:latest $REGISTRY/devops-roadmap-frontend:latest
docker push $REGISTRY/devops-roadmap-frontend:latest

echo "✅ Both images pushed to $REGISTRY"
