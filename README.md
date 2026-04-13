# DevOps Mastery Roadmap

An interactive 20-week curriculum for DevOps engineering — 60 hands-on projects across 8 phases, from Linux fundamentals to production GitOps. Built as a full-stack web app with user authentication and persistent progress tracking.

## Quick Start

```bash
# Copy env file and start all services
cp .env.example .env   # edit secrets if needed
docker compose up --build
```

- **App**: [http://localhost](http://localhost)  
- **API docs**: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

Requires **Docker** with the Compose plugin.

## Architecture

```
Browser → Nginx (port 80)
            ├── /* → React SPA (static files)
            └── /api/* → Python FastAPI (port 8000)
                           └── PostgreSQL 15
```

Nginx inside the frontend container proxies all `/api/*` requests to the backend — no CORS, no absolute URLs, no environment variable juggling in JavaScript.

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Nginx |
| **Backend** | Python 3.12 + FastAPI + SQLAlchemy |
| **Database** | PostgreSQL 15 |
| **Auth** | JWT (RS256 via python-jose) + bcrypt |
| **Orchestration** | Docker Compose (local) · MicroK8s (production) |
| **Ingress** | Cloudflare Tunnel → MicroK8s Nginx Ingress |

## Deployment

```bash
# On the Ubuntu VM — first-time setup
microk8s kubectl create namespace devops-roadmap
microk8s kubectl create secret generic backend-secrets \
  --namespace devops-roadmap \
  --from-literal=postgres-password='<your-db-password>' \
  --from-literal=database-url='postgresql://postgres:<your-db-password>@postgres-service:5432/devops_roadmap' \
  --from-literal=jwt-secret='<your-jwt-secret>'

# Every subsequent deploy
git pull && ./deploy.sh
```

> See **[DOCUMENTATION.md](DOCUMENTATION.md)** for the full step-by-step guide covering VM setup, MicroK8s, Cloudflare Tunnel, and secret management.

## Roadmap Structure

| Phase | Focus | Weeks | Projects |
|-------|-------|-------|----------|
| 1 | **Foundations** — Linux, Networking, Bash, Git, Python | 1–3 | 16 |
| 2 | **Containerization** — Docker fundamentals to advanced | 4–5 | 8 |
| 3 | **Orchestration** — Kubernetes, Helm, KEDA, ArgoCD | 6–8 | 8 |
| 4 | **Infrastructure as Code** — Terraform, Cloud, Ansible | 9–11 | 10 |
| 5 | **CI/CD & GitOps** — Pipelines, security scanning, Terratest | 12–14 | 8 |
| 6 | **Observability & Reliability** — Prometheus, ELK, incident response | 15–16 | 4 |
| 7 | **Security & Governance** — Vault, NetworkPolicy, OPA Gatekeeper | 17–18 | 3 |
| 8 | **Capstone & Interview Prep** — End-to-end GitOps, multi-cloud, portfolio | 19–20 | 3 |

## Features

- **User accounts** — register/login with username + password; progress is per-user
- **Persistent progress** — completion state saved to PostgreSQL, survives refreshes
- **Phase-based view** — projects grouped by learning phase with progress bars
- **Skill filtering** — filter across 13 skill categories
- **Search** — find projects by title, tagline, or tool
- **Resume bullets** — every project includes a ready-to-use resume line
- **Tool tags** — see exactly which tools each project covers