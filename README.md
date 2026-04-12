# DevOps Mastery Roadmap

An interactive 20-week curriculum for DevOps engineering — 60 hands-on projects across 8 phases, from Linux fundamentals to production GitOps. Built as a React app with persistent progress tracking.

## Quick Start

```bash
docker compose up --build
```

- **Frontend**: [http://localhost](http://localhost)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

Requires **Docker Desktop** or **OrbStack**.

## Project Architecture

- **Frontend**: React (Vite) + Nginx
- **Backend API**: Node.js (Express)
- **Database**: PostgreSQL 15
- **Orchestration**: Docker Compose

## Roadmap Structure

The curriculum follows a dependency-driven progression — each phase builds on the last.

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

## Skills Covered

Linux · Networking · Bash · Git · Python · Docker · Kubernetes · Terraform · Ansible · Cloud (Azure & AWS) · CI/CD (GitLab CI) · Monitoring (Prometheus, Grafana, ELK) · Security (Vault, OPA, NetworkPolicy)

## Features

- **Persistent progress** — completion state saves automatically across sessions
- **Phase-based view** — projects grouped by learning phase with progress bars
- **Skill filtering** — filter by any of the 13 skill categories
- **Search** — find projects by title, tagline, or tool
- **Resume bullets** — every project includes a ready-to-use resume line
- **Tool tags** — see exactly which tools each project covers