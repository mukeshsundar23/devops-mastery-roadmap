# DevOps Mastery Project — Complete Documentation

A step-by-step guide documenting how this full-stack DevOps Roadmap app was built, containerized, orchestrated, and deployed to production with a custom domain and Cloudflare tunnel.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Building the Application](#2-building-the-application)
3. [Dockerizing the App](#3-dockerizing-the-app)
4. [Docker Compose Orchestration](#4-docker-compose-orchestration)
5. [Setting Up Ubuntu Server VM in UTM](#5-setting-up-ubuntu-server-vm-in-utm)
6. [Installing & Configuring MicroK8s](#6-installing--configuring-microk8s)
7. [Deploying to Kubernetes](#7-deploying-to-kubernetes)
8. [Domain Purchase & Cloudflare Setup](#8-domain-purchase--cloudflare-setup)
9. [Cloudflare Tunnel Configuration](#9-cloudflare-tunnel-configuration)
10. [CI/CD Deployment Script](#10-cicd-deployment-script)
11. [Accessing the Live Application](#11-accessing-the-live-application)

---

## 1. Project Overview

### What This Project Is
An interactive 20-week DevOps curriculum tracker built as a full-stack web application with:
- **Frontend**: React (Vite) served via Nginx
- **Backend**: Node.js/Express REST API
- **Database**: PostgreSQL 15 for persistent progress tracking
- **Deployment**: Docker → Docker Compose → MicroK8s → Cloudflare Tunnel

### Architecture Flow
```
User → Cloudflare Tunnel → MicroK8s Ingress → Frontend/Backend Services → PostgreSQL
```

---

## 2. Building the Application

### 2.1 Frontend (React + Vite)
- Built with Vite for fast development and optimized builds
- Uses React for UI components with progress tracking features
- Styled with modern CSS, responsive design
- Features: phase-based roadmap view, skill filtering, search, resume bullets

**Key files:**
- `frontend/index.html` — Entry point
- `frontend/nginx.conf` — Nginx configuration for SPA routing
- `frontend/Dockerfile` — Multi-stage Docker build

### 2.2 Backend (Node.js + Express)
- Express.js REST API handling CRUD operations for progress tracking
- Connects to PostgreSQL for data persistence
- Lightweight, single-file architecture (`index.js`, `db.js`)

**Key files:**
- `backend/index.js` — Express server and API routes
- `backend/db.js` — PostgreSQL connection and queries
- `backend/package.json` — Dependencies

### 2.3 Database (PostgreSQL)
- PostgreSQL 15 Alpine image
- Stores user progress, project completions, and phase data
- Uses persistent volumes for data durability

---

## 3. Dockerizing the App

### 3.1 Backend Dockerfile

**File:** [`backend/Dockerfile`](backend/Dockerfile)

**How it works:**
1. Uses `node:20-alpine` as base (lightweight Linux + Node.js 20)
2. Sets working directory to `/app`
3. Copies `package.json` first (Docker layer caching optimization)
4. Installs only production dependencies
5. Copies application code
6. Exposes port 3001
7. Runs the server with `node index.js`

**Build command:**
```bash
docker build -t devops-roadmap-backend:latest ./backend
```

### 3.2 Frontend Dockerfile

**File:** [`frontend/Dockerfile`](frontend/Dockerfile)

**How it works:**
1. **Multi-stage build** — Stage 1 builds the React app, Stage 2 serves it with Nginx
2. Build stage installs all dependencies and runs `npm run build` to produce optimized static files in `/app/dist`
3. Production stage copies built files to Nginx's HTML directory
4. Custom [`nginx.conf`](frontend/nginx.conf) handles SPA routing (redirects all routes to `index.html`)
5. Entry point script generates runtime config for API URL from environment variable
6. This allows changing the API URL without rebuilding the image

**Build command:**
```bash
docker build -t devops-roadmap-frontend:latest ./frontend
```

### 3.3 Dockerignore Files

Both `backend/.dockerignore` and `frontend/.dockerignore` exclude:
- `node_modules/` (dependencies installed during build)
- `.git/`
- `*.md`
- Environment files

---

## 4. Docker Compose Orchestration

### 4.1 Configuration

**File:** [`docker-compose.yml`](docker-compose.yml)

### 4.2 How It Works

| Service | Purpose | Key Configuration |
|---------|---------|-------------------|
| **db** | PostgreSQL database | Named volume for persistence, health check for readiness |
| **backend** | Node.js API server | Waits for DB health check, connects via Docker DNS (`db` hostname) |
| **frontend** | React app via Nginx | Receives API URL as env var, served on port 80 |

### 4.3 Running Locally

```bash
# Start all services
docker compose up --build

# Access the app
# Frontend: http://localhost
# Backend API: http://localhost:3001
```

**Key concepts demonstrated:**
- Service dependencies with health checks
- Docker internal DNS resolution (services reach each other by name)
- Named volumes for data persistence
- Environment variable injection
- Port mapping to host

---

## 5. Setting Up Ubuntu Server VM in UTM — Step by Step Flow

### 5.1 High-Level Flow

```
Create VM → Install Ubuntu → Setup SSH → Install MicroK8s → Enable Addons → Clone Repo → Deploy → Setup Cloudflare Tunnel → Go Live
```

### 5.2 What is UTM?
UTM is a virtual machine emulator for macOS that allows running different operating systems (like Ubuntu Server) on Apple Silicon (M1/M2/M3) or Intel Macs.

### 5.3 Step 1 — Create the VM

1. **Download UTM** from [mac.getutm.app](https://mac.getutm.app)
2. **Download Ubuntu Server ISO** from [ubuntu.com/download/server](https://ubuntu.com/download/server) (ARM64 for Apple Silicon, AMD64 for Intel)
3. **Create New VM:**
   - Open UTM → Click `+`
   - Select **Virtualize** (faster) or **Emulate**
   - Choose **Linux** → Browse ISO
   - Allocate: 4–8 GB RAM, 4 CPU cores, 50 GB+ disk
4. **Boot and Install Ubuntu:**
   - Follow wizard → Language, keyboard, network (DHCP)
   - Create user account
   - **Install OpenSSH server** (critical for remote access)
   - Reboot

### 5.4 Step 2 — Prepare the VM

```bash
# SSH into VM from Mac
ssh <username>@<vm-ip-address>

# Update system
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y curl wget git
```

### 5.5 Step 3 — Install MicroK8s

```bash
# Install
sudo snap install microk8s --classic

# Add user to group
sudo usermod -a -G microk8s $USER
newgrp microk8s

# Enable addons
microk8s enable dns dashboard ingress storage registry

# Verify
microk8s status
```

### 5.6 Step 4 — Clone & Build the App

```bash
# Clone your repo
git clone <your-repo-url>
cd devops-mastery-roadmap

# Build Docker images
docker build -t devops-roadmap-backend:latest ./backend
docker build -t devops-roadmap-frontend:latest ./frontend

# Tag for local registry
docker tag devops-roadmap-backend:latest localhost:32000/devops-roadmap-backend:latest
docker tag devops-roadmap-frontend:latest localhost:32000/devops-roadmap-frontend:latest

# Push to MicroK8s registry
docker push localhost:32000/devops-roadmap-backend:latest
docker push localhost:32000/devops-roadmap-frontend:latest
```

### 5.7 Step 5 — Deploy to Kubernetes

```bash
# Apply manifests
microk8s kubectl apply -f k8s-manifests/

# Restart deployments to pull images
microk8s kubectl rollout restart deployment/backend-deployment -n devops-roadmap
microk8s kubectl rollout restart deployment/frontend-deployment -n devops-roadmap

# Verify everything is running
microk8s kubectl get all -n devops-roadmap
```

### 5.8 Step 6 — Setup Cloudflare Tunnel

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Login & create tunnel
cloudflared tunnel login
cloudflared tunnel create devops-roadmap

# Route DNS
cloudflared tunnel route dns devops-roadmap devops-roadmap.mukeshdev.online
cloudflared tunnel route dns devops-roadmap devops-roadmap-api.mukeshdev.online

# Configure (~/.cloudflared/config.yml)
# → See Section 9.5 for config details

# Run as service
sudo cloudflared service install
sudo cp ~/.cloudflared/config.yml /etc/cloudflared/
sudo cp ~/.cloudflared/*.json /etc/cloudflared/
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

### 5.9 Step 7 — Verify

```bash
# Check pods
microk8s kubectl get pods -n devops-roadmap

# Check tunnel
sudo systemctl status cloudflared

# Open browser
# https://devops-roadmap.mukeshdev.online
```

### 5.10 Quick Redeploy (After Code Changes)

```bash
# Just run the deploy script
./deploy.sh
```

---

## 5.11 Post-Installation Setup (Legacy section, steps covered above)

---

## 6. Installing & Configuring MicroK8s

### 6.1 What is MicroK8s?
MicroK8s is a lightweight, production-ready Kubernetes distribution by Canonical. It's a single-package K8s installation perfect for edge, IoT, and local clusters.

### 6.2 Installation on Ubuntu VM

```bash
# SSH into your UTM VM
ssh <username>@<vm-ip>

# Install MicroK8s (stable channel)
sudo snap install microk8s --classic

# Add your user to the microk8s group
sudo usermod -a -G microk8s $USER

# Refresh groups (or log out and back in)
newgrp microk8s
```

### 6.3 Enable Required Addons

```bash
# Enable DNS, dashboard, ingress, and storage
microk8s enable dns
microk8s enable dashboard
microk8s enable ingress
microk8s enable storage
microk8s enable registry

# Check status
microk8s status
```

| Addon | Purpose |
|-------|---------|
| **dns** | CoreDNS for service discovery within the cluster |
| **dashboard** | Kubernetes web dashboard for monitoring |
| **ingress** | Nginx ingress controller for external access via domains |
| **storage** | Hostpath provisioner for persistent volumes |
| **registry** | Local Docker registry for pushing images |

### 6.4 Configure kubectl Access

```bash
# Get kubeconfig
microk8s config > ~/.kube/config

# Or use microk8s kubectl directly
microk8s kubectl get nodes
```

### 6.5 Access Local Registry

The registry runs on port `32000`. Verify:

```bash
# Check registry is running
microk8s kubectl get svc -n container-registry

# Test connectivity
curl http://localhost:32000/v2/
```

### 6.6 Port Forwarding (Optional — for accessing from Mac)

```bash
# On VM: find IP
ip addr show

# On Mac: add port forwarding in UTM settings
# Network → Port Forwarding:
# Host Port 8080 → Guest Port 80
# Host Port 3001 → Guest Port 3001
# Host Port 32000 → Guest Port 32000
```

---

## 7. Deploying to Kubernetes

### 7.1 Project Structure

```
k8s-manifests/
├── namespace.yaml      # Isolated namespace
├── db.yaml             # PostgreSQL deployment + PVC
├── backend.yaml        # Backend deployment + service
├── frontend.yaml       # Frontend deployment + service
└── ingress.yaml        # Ingress rules for routing
```

### 7.2 Namespace

**File:** [`k8s-manifests/namespace.yaml`](k8s-manifests/namespace.yaml)

Creates an isolated namespace for all project resources.

### 7.3 Database

**File:** [`k8s-manifests/db.yaml`](k8s-manifests/db.yaml)

**Key concepts:**
- **PersistentVolumeClaim**: Ensures database data survives pod restarts
- **Deployment**: Manages PostgreSQL pod with environment variables
- **Service**: Exposes PostgreSQL internally on port 5432

### 7.4 Backend

**File:** [`k8s-manifests/backend.yaml`](k8s-manifests/backend.yaml)

**Key concepts:**
- **Image from local registry**: `localhost:32000/devops-roadmap-backend:latest`
- **K8s DNS for database**: `postgres-service.devops-roadmap.svc.cluster.local`
  - Format: `<service-name>.<namespace>.svc.cluster.local`
- **Service**: Exposes backend on port 3001 within the cluster

### 7.5 Frontend

**File:** [`k8s-manifests/frontend.yaml`](k8s-manifests/frontend.yaml)

**Key concepts:**
- **imagePullPolicy: Always**: Ensures latest image is pulled on every deployment
- **VITE_API_URL**: Points to production API domain (used by Cloudflare tunnel)

### 7.6 Ingress

**File:** [`k8s-manifests/ingress.yaml`](k8s-manifests/ingress.yaml)

**Key concepts:**
- Routes traffic based on hostname
- `devops-roadmap.mukeshdev.online` → Frontend service
- `devops-roadmap-api.mukeshdev.online` → Backend service

### 7.7 Building & Pushing Images to Local Registry

```bash
# From your Mac or VM, build images
docker build -t devops-roadmap-backend:latest ./backend
docker build -t devops-roadmap-frontend:latest ./frontend

# Tag for local registry
docker tag devops-roadmap-backend:latest localhost:32000/devops-roadmap-backend:latest
docker tag devops-roadmap-frontend:latest localhost:32000/devops-roadmap-frontend:latest

# Push to MicroK8s registry
docker push localhost:32000/devops-roadmap-backend:latest
docker push localhost:32000/devops-roadmap-frontend:latest
```

### 7.8 Applying Manifests

```bash
# Apply all manifests
microk8s kubectl apply -f k8s-manifests/

# Check deployments
microk8s kubectl get all -n devops-roadmap

# Check pods are running
microk8s kubectl get pods -n devops-roadmap

# View logs
microk8s kubectl logs -f deployment/backend-deployment -n devops-roadmap
microk8s kubectl logs -f deployment/frontend-deployment -n devops-roadmap
```

### 7.9 Rolling Updates

```bash
# Restart deployment to pull latest images
microk8s kubectl rollout restart deployment/backend-deployment -n devops-roadmap
microk8s kubectl rollout restart deployment/frontend-deployment -n devops-roadmap

# Check rollout status
microk8s kubectl rollout status deployment/backend-deployment -n devops-roadmap
```

---

## 8. Domain Purchase & Cloudflare Setup

### 8.1 Buying a Domain

1. **Choose a registrar** — I purchased `mukeshdev.online` from any registrar (Namecheap, GoDaddy, Google Domains, etc.)

2. **Search for availability**
   - Go to your chosen registrar
   - Search for desired domain name
   - Complete purchase

3. **Note your domain** — In this case: `mukeshdev.online`

### 8.2 Connecting Domain to Cloudflare

1. **Create Cloudflare Account**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Sign up for free account

2. **Add Your Site**
   - Click "Add a Site"
   - Enter domain: `mukeshdev.online`
   - Select **Free plan**

3. **DNS Records Review**
   - Cloudflare will scan existing records (likely none)
   - Continue to next step

4. **Update Nameservers at Registrar**
   - Cloudflare will provide two nameservers:
     ```
    .ns1.cloudflare.com
     .ns2.cloudflare.com
     ```
   - Go to your domain registrar's DNS settings
   - Replace existing nameservers with Cloudflare's nameservers
   - Save changes

5. **Wait for Propagation**
   - DNS propagation takes 1–24 hours (usually faster)
   - Cloudflare will email you when active
   - Status changes from "Pending" to "Active" in Cloudflare dashboard

### 8.3 DNS Records in Cloudflare

Once active, add these records in Cloudflare DNS dashboard:

| Type | Name | Target | Proxy Status |
|------|------|--------|--------------|
| CNAME | devops-roadmap | your-cloudflare-tunnel.cfargotunnel.com | Proxied (orange cloud) |
| CNAME | devops-roadmap-api | your-cloudflare-tunnel.cfargotunnel.com | Proxied (orange cloud) |

**Note:** The actual tunnel hostname will be generated when you set up Cloudflare Tunnel (next section).

---

## 9. Cloudflare Tunnel Configuration

### 9.1 What is Cloudflare Tunnel?

Cloudflare Tunnel (formerly Argo Tunnel) creates a secure, outbound-only connection from your infrastructure to Cloudflare's edge — no open inbound ports, no public IP needed. It's free on the Cloudflare Zero Trust plan.

### 9.2 Why Use a Tunnel?

- **No port forwarding needed** — Your VM is behind NAT; tunnel bypasses this
- **No public IP needed** — Works with any internet connection
- **Free SSL/TLS** — Automatic HTTPS certificates
- **DDoS protection** — Cloudflare absorbs attacks
- **No firewall rules** — Outbound-only connection is inherently secure

### 9.3 Installing cloudflared

```bash
# SSH into your Ubuntu VM
ssh <username>@<vm-ip>

# Download and install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Verify installation
cloudflared --version
```

### 9.4 Creating a Tunnel

1. **Login to Cloudflare**
   ```bash
   cloudflared tunnel login
   ```
   - Opens browser for authentication
   - Select your domain: `mukeshdev.online`
   - Authorizes cloudflared to manage your DNS

2. **Create the Tunnel**
   ```bash
   cloudflared tunnel create devops-roadmap
   ```
   - Creates a tunnel named `devops-roadmap`
   - Generates a credentials file at `~/.cloudflared/<tunnel-UUID>.json`
   - Note the tunnel UUID (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

3. **Create DNS Records for Tunnel**
   ```bash
   cloudflared tunnel route dns devops-roadmap devops-roadmap.mukeshdev.online
   cloudflared tunnel route dns devops-roadmap devops-roadmap-api.mukeshdev.online
   ```
   - Automatically creates CNAME records in Cloudflare
   - Points both subdomains to the tunnel

### 9.5 Configuring the Tunnel

Create config file:

```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Add configuration:

```yaml
tunnel: devops-roadmap
credentials-file: /home/<username>/.cloudflared/<tunnel-UUID>.json

ingress:
  - hostname: devops-roadmap.mukeshdev.online
    service: http://localhost:80
  - hostname: devops-roadmap-api.mukeshdev.online
    service: http://localhost:3001
  - service: http_status:404
```

**How it works:**
- Traffic to `devops-roadmap.mukeshdev.online` → forwarded to `localhost:80` (frontend)
- Traffic to `devops-roadmap-api.mukeshdev.online` → forwarded to `localhost:3001` (backend)
- All other traffic → 404 response

### 9.6 Running the Tunnel

**Test the tunnel:**
```bash
cloudflared tunnel --config ~/.cloudflared/config.yml run
```

**Run as a systemd service (production):**
```bash
# Install as service
sudo cloudflared service install

# Copy config
sudo cp ~/.cloudflared/config.yml /etc/cloudflared/config.yml
sudo cp ~/.cloudflared/*.json /etc/cloudflared/

# Edit service file if needed
sudo nano /etc/systemd/system/cloudflared.service

# Enable and start
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

### 9.7 Verifying the Tunnel

```bash
# Check tunnel status
sudo systemctl status cloudflared

# Check Cloudflare dashboard
# Go to Zero Trust → Networks → Tunnels
# Should show "Healthy" status

# Test from browser
# https://devops-roadmap.mukeshdev.online
# https://devops-roadmap-api.mukeshdev.online
```

---

## 10. CI/CD Deployment Script

### 10.1 The Script

**File:** [`deploy.sh`](deploy.sh)

### 10.2 How It Works

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `docker build` | Build fresh images from Dockerfiles |
| 2 | `docker tag` | Tag images for local registry |
| 3 | `docker push` | Push to MicroK8s registry on port 32000 |
| 4 | `kubectl apply` | Apply all Kubernetes manifests |
| 5 | `kubectl rollout restart` | Force pods to restart and pull new images |

### 10.3 Running the Script

```bash
# Make executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

**What happens:**
1. Backend image built and pushed
2. Frontend image built and pushed
3. Kubernetes manifests applied (creates namespace, deployments, services, ingress)
4. Deployments restarted to pull latest images
5. Rolling update ensures zero downtime

### 10.4 Automating Further (Future Enhancement)

This script can be integrated into:
- **GitHub Actions** — Trigger on push to main branch
- **GitLab CI** — Pipeline with build, test, deploy stages
- **ArgoCD** — GitOps approach with automatic sync
- **Webhooks** — Trigger from git hooks

---

## 11. Accessing the Live Application

### 11.1 Production URLs

- **Frontend**: https://devops-roadmap.mukeshdev.online
- **Backend API**: https://devops-roadmap-api.mukeshdev.online

### 11.2 Traffic Flow

```
Browser
  ↓ (HTTPS via Cloudflare edge)
Cloudflare Tunnel (cloudflared on VM)
  ↓ (localhost forwarding)
MicroK8s Ingress Controller
  ↓ (host-based routing)
Frontend Service (port 80) / Backend Service (port 3001)
  ↓ (pod selection)
Frontend/Backend Pods
  ↓ (for backend)
PostgreSQL Service → Persistent Volume
```

### 11.3 Useful Commands

```bash
# Check all resources
microk8s kubectl get all -n devops-roadmap

# Check ingress
microk8s kubectl get ingress -n devops-roadmap

# View logs
microk8s kubectl logs -f deployment/frontend-deployment -n devops-roadmap
microk8s kubectl logs -f deployment/backend-deployment -n devops-roadmap
microk8s kubectl logs -f deployment/postgres-deployment -n devops-roadmap

# Exec into pod
microk8s kubectl exec -it deployment/backend-deployment -n devops-roadmap -- sh

# Check persistent volumes
microk8s kubectl get pvc -n devops-roadmap

# Restart deployment
microk8s kubectl rollout restart deployment/backend-deployment -n devops-roadmap

# Check tunnel status
sudo systemctl status cloudflared
```

### 11.4 Troubleshooting

| Issue | Solution |
|-------|----------|
| Pods in CrashLoopBackOff | Check logs: `kubectl logs <pod-name> -n devops-roadmap` |
| ImagePullBackOff | Verify images pushed to registry, check image names |
| 502 Bad Gateway | Ensure cloudflared service is running, check ports |
| DNS not resolving | Check Cloudflare DNS records, wait for propagation |
| SSL errors | Ensure Cloudflare proxy (orange cloud) is enabled |

---

## Summary: Technologies Used

| Category | Technology |
|----------|-----------|
| **Frontend** | React, Vite, Nginx |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL 15 |
| **Containerization** | Docker, Multi-stage builds |
| **Orchestration** | Docker Compose, Kubernetes |
| **K8s Distribution** | MicroK8s |
| **Virtualization** | UTM (Apple Silicon) |
| **OS** | Ubuntu Server LTS |
| **Reverse Proxy** | Cloudflare Tunnel (cloudflared) |
| **DNS** | Cloudflare |
| **Domain** | mukeshdev.online |
| **Deployment** | Custom bash script |

---

## Next Steps / Future Enhancements

- [ ] Add GitHub Actions for automated CI/CD
- [ ] Implement ArgoCD for GitOps workflow
- [ ] Add Prometheus + Grafana for monitoring
- [ ] Set up Let's Encrypt certificates with cert-manager
- [ ] Add Horizontal Pod Autoscaler (HPA)
- [ ] Implement NetworkPolicies for security
- [ ] Add Helm charts for easier deployment
- [ ] Set up ELK stack for log aggregation
- [ ] Add rate limiting on ingress
- [ ] Multi-environment deployment (staging, production)

---

**Author**: Mukesh  
**Project**: DevOps Mastery Roadmap  
**Last Updated**: April 2026
