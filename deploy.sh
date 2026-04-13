#!/bin/bash
set -e

REGISTRY="localhost:32000"

echo "🔨 Building backend (Python FastAPI)..."
docker build -t devops-roadmap-backend:latest ./backend
docker tag devops-roadmap-backend:latest $REGISTRY/devops-roadmap-backend:latest
docker push $REGISTRY/devops-roadmap-backend:latest

echo "🔨 Building frontend (React + Nginx)..."
docker build -t devops-roadmap-frontend:latest ./frontend
docker tag devops-roadmap-frontend:latest $REGISTRY/devops-roadmap-frontend:latest
docker push $REGISTRY/devops-roadmap-frontend:latest

echo "✅ Both images pushed to $REGISTRY"

kubectl="microk8s kubectl"

echo "🚀 Applying K8s manifests..."
$kubectl apply -f k8s-manifests/

echo "🔄 Restarting deployments..."
$kubectl rollout restart deployment/frontend-deployment -n devops-roadmap
$kubectl rollout restart deployment/backend-deployment -n devops-roadmap

echo "⏳ Waiting for rollout..."
$kubectl rollout status deployment/backend-deployment -n devops-roadmap
$kubectl rollout status deployment/frontend-deployment -n devops-roadmap

echo "✅ Deploy complete!"
