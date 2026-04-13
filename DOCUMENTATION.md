# DevOps Mastery Project — Complete Documentation

A step-by-step guide documenting how this full-stack DevOps Roadmap app was built, containerized, orchestrated, and deployed to production with a custom domain and Cloudflare Tunnel.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Application Architecture](#2-application-architecture)
3. [Dockerizing the App](#3-dockerizing-the-app)
4. [Docker Compose Orchestration](#4-docker-compose-orchestration)
5. [Setting Up Ubuntu Server VM in UTM](#5-setting-up-ubuntu-server-vm-in-utm)
6. [Installing & Configuring MicroK8s](#6-installing--configuring-microk8s)
7. [Deploying to Kubernetes](#7-deploying-to-kubernetes)
8. [Secret Management](#8-secret-management)
9. [Domain Purchase & Cloudflare Setup](#9-domain-purchase--cloudflare-setup)
10. [Cloudflare Tunnel Configuration](#10-cloudflare-tunnel-configuration)
11. [CI/CD Deployment Script](#11-cicd-deployment-script)
12. [Accessing the Live Application](#12-accessing-the-live-application)

---

## 1. Project Overview

### What This Project Is

An interactive 20-week DevOps curriculum tracker with user authentication and per-user progress persistence, built as a full-stack web application.

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite + Nginx | SPA served as static files via Nginx |
| **Backend** | Python 3.12 + FastAPI | REST API with JWT authentication |
| **ORM** | SQLAlchemy 2.0 | Database models and queries |
| **Database** | PostgreSQL 15 | Persistent storage for users and progress |
| **Auth** | JWT (python-jose) + bcrypt | Stateless authentication |
| **Local Dev** | Docker Compose | Orchestrates all three services |
| **Production** | MicroK8s | Kubernetes distribution on Ubuntu VM |
| **Tunnel** | Cloudflare Tunnel | Exposes VM to the internet without open ports |

---

## 2. Application Architecture

### Request Flow

```
Browser (https://devops-roadmap.mukeshdev.online)
  ↓
Cloudflare Edge (SSL termination + DDoS protection)
  ↓
Cloudflare Tunnel (cloudflared daemon on VM)
  ↓
MicroK8s Nginx Ingress (port 80)
  ↓
frontend-service → Nginx pod (port 80)
  ├── GET /* → serves React static files
  └── /api/* → proxy_pass to backend-service:8000
                  ↓
              FastAPI (Python)
                  ↓
              PostgreSQL 15
```

### Key Design Decision: Nginx Proxy

The frontend Nginx container proxies all `/api/*` requests to the Python backend internally. This means:

- **React code uses relative URLs** — `fetch('/api/progress')` — never an absolute URL
- **No CORS** — browser sees all requests going to the same origin
- **No mixed content** — no `http://` vs `https://` issues
- **No environment variables in JavaScript** — the backend URL is only in Nginx config

### Directory Structure

```
devops-mastery-roadmap/
├── frontend/
│   ├── src/
│   │   ├── main.jsx                    — React entry point
│   │   ├── App.jsx                     — Auth gate (Login vs Roadmap)
│   │   ├── Login.jsx                   — Login/Register UI
│   │   └── devops-mastery-roadmap.jsx  — Main roadmap component
│   ├── nginx.conf                      — Nginx with /api/ proxy_pass
│   ├── Dockerfile                      — Multi-stage build + envsubst
│   └── index.html
├── backend/
│   ├── main.py       — FastAPI routes
│   ├── models.py     — SQLAlchemy models (User, Progress)
│   ├── database.py   — DB engine and session
│   ├── auth.py       — JWT + bcrypt helpers
│   ├── requirements.txt
│   └── Dockerfile
├── k8s-manifests/
│   ├── namespace.yaml
│   ├── db.yaml       — PostgreSQL + PVC
│   ├── backend.yaml  — FastAPI deployment + service
│   ├── frontend.yaml — Nginx deployment + service
│   └── ingress.yaml  — Single-host ingress
├── docker-compose.yml
├── deploy.sh
└── .env              — Local dev secrets (gitignored)
```

---

## 3. Dockerizing the App

### 3.1 Backend Dockerfile

**File:** [`backend/Dockerfile`](backend/Dockerfile)

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**How it works:**
1. Uses `python:3.12-slim` — minimal Debian + Python 3.12
2. Installs Python dependencies from `requirements.txt` (layer-cached)
3. Copies application code
4. Runs FastAPI via Uvicorn on port 8000

**Key dependencies:**
- `fastapi` — async web framework
- `uvicorn[standard]` — ASGI server with uvloop
- `sqlalchemy` — ORM for PostgreSQL
- `psycopg2-binary` — PostgreSQL driver
- `python-jose[cryptography]` — JWT encoding/decoding
- `bcrypt` — password hashing (replaces unmaintained `passlib`)

### 3.2 Frontend Dockerfile

**File:** [`frontend/Dockerfile`](frontend/Dockerfile)

```dockerfile
# Stage 1: Build React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx + proxy config
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
ENV BACKEND_URL=http://backend:8000
EXPOSE 80
CMD ["/bin/sh", "-c", \
  "envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
```

**How it works:**
1. **Build stage** — installs all npm deps and runs `npm run build`, producing optimized static files in `/app/dist`
2. **Production stage** — copies static files to Nginx, the config template is stored with `${BACKEND_URL}` placeholder
3. At **container startup**, `envsubst` replaces `${BACKEND_URL}` in the Nginx template with the actual backend URL (e.g., `http://backend:8000` for Docker Compose, `http://backend-service:8000` for K8s) and writes the final config
4. Nginx starts and serves the app

### 3.3 Nginx Config

**File:** [`frontend/nginx.conf`](frontend/nginx.conf)

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;

    # Proxy API calls to FastAPI backend
    location /api/ {
        proxy_pass ${BACKEND_URL};  # replaced at container startup
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # HTML — never cached (ensure fresh deploys)
    location ~* \.(html|svg|ico)$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        try_files $uri $uri/ /index.html;
    }

    # JS/CSS — cached with immutable (content-hashed filenames)
    location ~* \.(js|css|woff2?)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # SPA fallback — all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 4. Docker Compose Orchestration

**File:** [`docker-compose.yml`](docker-compose.yml)

### Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `db` | `postgres:15-alpine` | 5432 (internal) | PostgreSQL database |
| `backend` | built from `./backend` | 8000 (internal) | FastAPI REST API |
| `frontend` | built from `./frontend` | 80 → host | React + Nginx proxy |

### Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `POSTGRES_PASSWORD` | db, backend | Database password (from `.env`) |
| `DATABASE_URL` | backend | Full PostgreSQL connection string |
| `JWT_SECRET` | backend | Secret key for signing JWT tokens |
| `BACKEND_URL` | frontend | Internal URL for Nginx proxy (e.g., `http://backend:8000`) |

### Starting Locally

```bash
# First time
cp .env.example .env   # fill in POSTGRES_PASSWORD and JWT_SECRET
docker compose up --build

# Subsequent runs (no code changes)
docker compose up

# Stop and remove volumes (full reset)
docker compose down -v
```

Access at [http://localhost](http://localhost). Register an account, then start tracking progress.

---

## 5. Setting Up Ubuntu Server VM in UTM

### 5.1 High-Level Flow

```
Create UTM VM → Install Ubuntu Server → Enable SSH → Install Docker + MicroK8s
→ Enable addons → Clone repo → Create K8s secrets → Deploy → Cloudflare Tunnel → Live
```

### 5.2 What is UTM?

UTM is a virtual machine emulator for macOS (free, open source) supporting QEMU + Apple Hypervisor. It runs Ubuntu Server on Apple Silicon (M1/M2/M3) or Intel Macs.

### 5.3 Step 1 — Create the VM

1. **Download UTM** from [mac.getutm.app](https://mac.getutm.app)
2. **Download Ubuntu Server ISO** — ARM64 for Apple Silicon / AMD64 for Intel from [ubuntu.com/download/server](https://ubuntu.com/download/server)
3. **Create New VM:**
   - Open UTM → Click `+` → Select **Virtualize**
   - Choose **Linux** → Browse ISO
   - Allocate: **4–8 GB RAM**, **4 CPU cores**, **50 GB+ disk**
4. **Boot and Install Ubuntu:**
   - Follow wizard → Language, keyboard, network (DHCP)
   - Create user account
   - **Install OpenSSH server** ← critical for `ssh` access
   - Reboot when prompted

### 5.4 Step 2 — Prepare the VM

```bash
# SSH into VM from Mac
ssh <username>@<vm-ip-address>

# Update system
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y curl wget git
```

### 5.5 Step 3 — Install Docker

```bash
# Install Docker Engine (not Docker Desktop)
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
```

### 5.6 Step 4 — Install MicroK8s

```bash
sudo snap install microk8s --classic
sudo usermod -a -G microk8s $USER
newgrp microk8s

# Enable required addons
microk8s enable dns ingress storage registry

# Verify
microk8s status --wait-ready
```

| Addon | Purpose |
|-------|---------|
| **dns** | CoreDNS for service-name resolution within the cluster |
| **ingress** | Nginx Ingress controller for routing by hostname |
| **storage** | Hostpath provisioner for PersistentVolumeClaims |
| **registry** | Local Docker registry on port 32000 |

### 5.7 Step 5 — Clone the Repo

```bash
git clone https://github.com/mukeshsundar23/devops-mastery-roadmap.git
cd devops-mastery-roadmap
```

---

## 6. Installing & Configuring MicroK8s

### 6.1 Configure kubectl Access

```bash
# Option A: use the built-in alias
microk8s kubectl get nodes

# Option B: export kubeconfig for plain kubectl
microk8s config > ~/.kube/config
kubectl get nodes
```

### 6.2 Access Local Registry

The registry runs on port `32000`:

```bash
# Verify registry is running
microk8s kubectl get svc -n container-registry

# Test connectivity
curl http://localhost:32000/v2/
```

### 6.3 Useful alias

Add this to `~/.bashrc` or `~/.zshrc` to avoid typing `microk8s kubectl` every time:

```bash
alias k='microk8s kubectl'
```

---

## 7. Deploying to Kubernetes

### 7.1 Kubernetes Manifest Files

```
k8s-manifests/
├── namespace.yaml   — devops-roadmap namespace
├── db.yaml          — PostgreSQL PVC + Deployment + Service
├── backend.yaml     — FastAPI Deployment + Service
├── frontend.yaml    — Nginx Deployment + Service
└── ingress.yaml     — Single-host Ingress rule
```

### 7.2 First-Time Deployment

```bash
# 1. Create namespace
microk8s kubectl create namespace devops-roadmap

# 2. Create K8s Secret with your actual credentials (see Section 8)
microk8s kubectl create secret generic backend-secrets \
  --namespace devops-roadmap \
  --from-literal=postgres-password='<your-db-password>' \
  --from-literal=database-url='postgresql://postgres:<your-db-password>@postgres-service:5432/devops_roadmap' \
  --from-literal=jwt-secret='<your-jwt-secret>'

# 3. Build, push, and deploy
./deploy.sh
```

### 7.3 How Services Communicate in K8s

Within the `devops-roadmap` namespace:

| From | To | DNS Name |
|------|----|---------|
| frontend Nginx | FastAPI | `backend-service:8000` |
| FastAPI | PostgreSQL | `postgres-service:5432` |

Kubernetes automatically resolves service names within the same namespace — no hardcoded IPs needed.

### 7.4 Ingress Configuration

The Ingress now routes a **single hostname** to the frontend service. All API traffic is handled internally by Nginx proxying to the backend — no separate API subdomain required:

```yaml
rules:
- host: devops-roadmap.mukeshdev.online
  http:
    paths:
    - path: /
      pathType: Prefix
      backend:
        service:
          name: frontend-service
          port:
            number: 80
```

### 7.5 Useful Commands

```bash
# Check all resources
microk8s kubectl get all -n devops-roadmap

# View logs
microk8s kubectl logs -f deployment/backend-deployment -n devops-roadmap
microk8s kubectl logs -f deployment/frontend-deployment -n devops-roadmap
microk8s kubectl logs -f deployment/postgres-deployment -n devops-roadmap

# Exec into backend pod
microk8s kubectl exec -it deployment/backend-deployment -n devops-roadmap -- bash

# Check persistent volumes
microk8s kubectl get pvc -n devops-roadmap

# Full wipe and fresh deploy
microk8s kubectl delete namespace devops-roadmap
microk8s kubectl create namespace devops-roadmap
# → re-create secret, then ./deploy.sh
```

---

## 8. Secret Management

### 8.1 Why K8s Secrets

Hardcoding passwords in YAML manifests that are committed to Git is a security risk. Instead, secrets are stored in a Kubernetes `Secret` object — applied directly on the server and never in source control.

### 8.2 Creating the K8s Secret

```bash
microk8s kubectl create secret generic backend-secrets \
  --namespace devops-roadmap \
  --from-literal=postgres-password='<strong-password>' \
  --from-literal=database-url='postgresql://postgres:<strong-password>@postgres-service:5432/devops_roadmap' \
  --from-literal=jwt-secret='<long-random-string>' \
  --save-config --dry-run=client -o yaml | microk8s kubectl apply -f -
```

> The `--dry-run=client -o yaml | apply -f -` pattern is idempotent — it creates OR updates the secret safely.

### 8.3 How Manifests Reference the Secret

In `backend.yaml` and `db.yaml`, environment variables are pulled from the secret via `secretKeyRef`:

```yaml
env:
- name: JWT_SECRET
  valueFrom:
    secretKeyRef:
      name: backend-secrets
      key: jwt-secret
- name: DATABASE_URL
  valueFrom:
    secretKeyRef:
      name: backend-secrets
      key: database-url
```

### 8.4 Local Development

For local Docker Compose, secrets are in `.env` (gitignored):

```bash
POSTGRES_PASSWORD=yourpassword
JWT_SECRET=your-long-random-secret
```

---

## 9. Domain Purchase & Cloudflare Setup

### 9.1 Buying a Domain

1. Purchase `mukeshdev.online` (or your domain) from any registrar (Namecheap, GoDaddy, etc.)

### 9.2 Connecting Domain to Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Create free account
2. **Add a Site** → enter your domain → select **Free plan**
3. **Update nameservers at registrar** — Cloudflare provides two nameservers (e.g., `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`) — replace your registrar's nameservers with these
4. Wait 5–60 min for propagation; Cloudflare emails when active

---

## 10. Cloudflare Tunnel Configuration

### 10.1 What is Cloudflare Tunnel?

Cloudflare Tunnel (`cloudflared`) creates a secure, outbound-only connection from your infrastructure to Cloudflare's edge — **no open inbound ports, no public IP needed**. Free on the Zero Trust plan.

### 10.2 Why Use a Tunnel?

- VM is behind NAT — no port forwarding needed
- Free TLS/HTTPS certificates automatically
- DDoS protection included
- Outbound-only = inherently secure

### 10.3 Installing cloudflared

```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared-linux-arm64.deb  # use amd64 on Intel
cloudflared --version
```

### 10.4 Creating and Configuring the Tunnel

```bash
# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create devops-roadmap
# → Note the tunnel UUID in the output

# Create DNS record (one subdomain routes all traffic now)
cloudflared tunnel route dns devops-roadmap devops-roadmap.mukeshdev.online
```

**Config file** (`~/.cloudflared/config.yml`):

```yaml
tunnel: devops-roadmap
credentials-file: /home/<username>/.cloudflared/<tunnel-UUID>.json

ingress:
  - hostname: devops-roadmap.mukeshdev.online
    service: http://localhost:80     # MicroK8s Ingress
  - service: http_status:404
```

> **Note:** Only one hostname is needed now. The previous `devops-roadmap-api` subdomain is no longer required — `/api/*` is proxied internally by Nginx.

### 10.5 Running as a System Service

```bash
sudo cloudflared service install
sudo cp ~/.cloudflared/config.yml /etc/cloudflared/
sudo cp ~/.cloudflared/*.json /etc/cloudflared/
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

---

## 11. CI/CD Deployment Script

**File:** [`deploy.sh`](deploy.sh)

### What It Does

```
1. docker build backend → push to localhost:32000
2. docker build frontend → push to localhost:32000
3. microk8s kubectl apply -f k8s-manifests/   (idempotent — safe to re-run)
4. kubectl rollout restart backend + frontend deployments
5. kubectl rollout status → waits until pods are healthy
```

### Running It

```bash
chmod +x deploy.sh
./deploy.sh
```

### Typical Workflow After a Code Change

```bash
# On Mac — make changes, commit, push
git add -A && git commit -m "feat: ..." && git push

# On ubuntu-vm — pull changes and redeploy
git pull && ./deploy.sh
```

---

## 12. Accessing the Live Application

### Production URL

**https://devops-roadmap.mukeshdev.online**

### Traffic Flow

```
User's Browser
  ↓ HTTPS (Cloudflare edge — SSL, DDoS protection)
Cloudflare Tunnel daemon (cloudflared, running on VM as systemd service)
  ↓ http://localhost:80
MicroK8s Nginx Ingress (NodePort)
  ↓ routes devops-roadmap.mukeshdev.online → frontend-service:80
Frontend Pod (Nginx)
  ├── /* → React SPA static files (cached)
  └── /api/* → proxy_pass → backend-service:8000
                  ↓
              Backend Pod (FastAPI/Uvicorn)
                  ↓ SQLAlchemy
              PostgreSQL Pod → PersistentVolume (1Gi)
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Pod in `CrashLoopBackOff` | `kubectl logs <pod-name> -n devops-roadmap` |
| `ImagePullBackOff` | Verify images pushed: `curl localhost:32000/v2/_catalog` |
| 502 Bad Gateway | Check `cloudflared` service: `systemctl status cloudflared` |
| `/api/` returns 502 | Check backend pod logs; confirm K8s Secret exists |
| Login fails | Confirm K8s Secret has correct `jwt-secret` |
| DB errors on startup | Confirm `database-url` in Secret matches `postgres-password` |
| DNS not resolving | Check Cloudflare DNS, wait for propagation |

---

## Summary: Technologies Used

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, Vite, Nginx |
| **Backend** | Python 3.12, FastAPI, Uvicorn |
| **ORM** | SQLAlchemy 2.0 |
| **Database** | PostgreSQL 15 |
| **Auth** | JWT (python-jose), bcrypt 4.x |
| **Containerization** | Docker, Multi-stage builds |
| **Orchestration** | Docker Compose, Kubernetes |
| **K8s Distribution** | MicroK8s |
| **Secret Management** | Kubernetes Secrets |
| **Virtualization** | UTM (Apple Silicon) |
| **OS** | Ubuntu Server LTS |
| **Reverse Proxy** | Cloudflare Tunnel (cloudflared) |
| **DNS / CDN** | Cloudflare |
| **Domain** | mukeshdev.online |
| **Deployment** | Custom bash deploy script |

---

## Next Steps / Future Enhancements

- [ ] GitHub Actions CI — auto-build and push images on push to `main`
- [ ] ArgoCD — GitOps sync from repo to cluster
- [ ] Prometheus + Grafana — metrics and dashboards
- [ ] cert-manager + Let's Encrypt — TLS on the ingress layer
- [ ] Horizontal Pod Autoscaler for backend
- [ ] NetworkPolicies — restrict pod-to-pod traffic
- [ ] Helm chart — package all K8s manifests
- [ ] ELK / Loki — centralized log aggregation
- [ ] Rate limiting on Nginx Ingress
- [ ] Multi-environment deploy (staging + production namespaces)

---

**Author**: Mukesh  
**Project**: DevOps Mastery Roadmap  
**Last Updated**: April 2026
