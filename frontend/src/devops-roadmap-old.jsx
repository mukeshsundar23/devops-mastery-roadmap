
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const skills = ["All", "Linux", "Bash", "Python", "Docker", "Kubernetes", "Terraform", "CI/CD", "Networking", "Ansible", "Monitoring", "Security"];

const projects = [
    // WEEK 1 — Linux & Bash
    {
        day: 1, week: 1, skill: "Linux", difficulty: "Beginner",
        title: "System Recon Script",
        tagline: "Build a sysadmin's first-responder toolkit",
        description: "Write a Bash script that collects system info: CPU, RAM, disk, top processes, open ports, logged-in users, and uptime. Output a formatted report to a file.",
        tasks: ["Collect CPU/RAM/Disk stats using /proc and df/free", "List top 10 CPU-consuming processes", "Show listening ports with ss or netstat", "Write timestamped report to /var/log/sysreport.txt", "Schedule it via cron every 6 hours"],
        resume: "Built automated system health reporting tool using Bash; scheduled via cron for proactive monitoring",
        tools: ["bash", "cron", "ss", "awk", "sed"],
        outcome: "Cron-scheduled report generator",
    },
    {
        day: 2, week: 1, skill: "Linux", difficulty: "Beginner",
        title: "User & Permission Auditor",
        tagline: "Simulate a security audit on a Linux system",
        description: "Script that audits all users, their groups, sudo access, home directory permissions, and SSH key presence. Flags anomalies.",
        tasks: ["Parse /etc/passwd and /etc/group", "Check sudo access per user", "Verify home dir permissions (should be 700)", "Check for authorized_keys files", "Output a CSV audit report"],
        resume: "Automated Linux user & permission audit tool; flagged misconfigurations and generated CSV compliance reports",
        tools: ["bash", "awk", "cut", "grep", "find"],
        outcome: "CSV security audit report",
    },
    {
        day: 3, week: 1, skill: "Bash", difficulty: "Beginner",
        title: "Log Parser & Alerter",
        tagline: "Turn noisy logs into actionable alerts",
        description: "Parse Nginx/Apache access logs. Count 4xx/5xx errors, find top IPs, flag repeated failures, and send a summary email (or write to Slack via webhook).",
        tasks: ["Parse access.log for status codes", "Count and rank error types", "Find top 10 requesting IPs", "Flag IPs with >100 requests/min (potential DDoS)", "Send summary to Slack webhook with curl"],
        resume: "Built log analysis & alerting pipeline in Bash; integrated Slack webhook notifications for 5xx error spikes",
        tools: ["bash", "awk", "sort", "uniq", "curl"],
        outcome: "Slack-notified log alert system",
    },
    {
        day: 4, week: 1, skill: "Python", difficulty: "Beginner",
        title: "Server Health Dashboard (CLI)",
        tagline: "Python-powered live terminal dashboard",
        description: "Use psutil to build a live CLI dashboard showing CPU per core, RAM, disk I/O, network I/O, and running processes. Refresh every 2 seconds.",
        tasks: ["Use psutil for system metrics", "Display CPU per-core bar chart in terminal", "Show disk read/write speeds", "Network bytes in/out", "Top 5 processes by CPU"],
        resume: "Developed real-time CLI health dashboard using Python/psutil; visualized per-core CPU, disk I/O, and network metrics",
        tools: ["python", "psutil", "rich", "argparse"],
        outcome: "Live refreshing terminal dashboard",
    },
    {
        day: 5, week: 1, skill: "Networking", difficulty: "Beginner",
        title: "Network Discovery Tool",
        tagline: "Map your local network like a pro",
        description: "Python script that scans a CIDR range, discovers live hosts, does reverse DNS lookup, checks common ports, and outputs a network map.",
        tasks: ["Accept CIDR input (e.g. 192.168.1.0/24)", "Ping sweep to find live hosts", "Port scan common ports (22, 80, 443, 3306, 5432)", "Reverse DNS lookup per host", "Output Markdown table of results"],
        resume: "Built network discovery & port scanning tool in Python; performed CIDR-range sweeps with DNS resolution and service fingerprinting",
        tools: ["python", "socket", "ipaddress", "subprocess"],
        outcome: "Network map Markdown report",
    },
    {
        day: 6, week: 1, skill: "Bash", difficulty: "Intermediate",
        title: "Automated Backup System",
        tagline: "Production-grade backup with retention policies",
        description: "Backup script for directories/databases. Compress with tar+gzip, encrypt with GPG, upload to S3 (or local remote via rsync), and enforce 7-day retention.",
        tasks: ["Backup specified directories with tar+gzip", "Encrypt archive with GPG symmetric key", "Upload to S3 with AWS CLI or rsync to remote", "Delete backups older than 7 days", "Log every action with timestamps"],
        resume: "Built automated encrypted backup system in Bash with S3 upload and 7-day retention enforcement; logged all operations",
        tools: ["bash", "tar", "gpg", "aws-cli", "rsync", "cron"],
        outcome: "Encrypted, auto-retained backup pipeline",
    },
    {
        day: 7, week: 1, skill: "Linux", difficulty: "Intermediate",
        title: "Hardening Checklist Automation",
        tagline: "Automate CIS benchmark checks",
        description: "Script that checks a server against a CIS-like hardening checklist: SSH config, firewall status, password policies, kernel params, unnecessary services.",
        tasks: ["Check SSH: PermitRootLogin, PasswordAuth, MaxAuthTries", "Verify UFW/iptables is active", "Check password complexity via PAM config", "Verify sysctl hardening params (ip_forward, etc.)", "Output PASS/FAIL checklist with recommendations"],
        resume: "Automated Linux security hardening audit against CIS benchmark checklist; generated PASS/FAIL compliance report",
        tools: ["bash", "sshd_config", "sysctl", "pam", "ufw"],
        outcome: "CIS compliance report script",
    },

    // WEEK 2 — Docker
    {
        day: 8, week: 2, skill: "Docker", difficulty: "Beginner",
        title: "Multi-Stage Docker Build",
        tagline: "Ship lean, production-optimized images",
        description: "Take a Python FastAPI app. Build a multi-stage Dockerfile: build stage installs deps, production stage copies only the app. Compare image sizes.",
        tasks: ["Write Dockerfile with builder and production stages", "Use slim/alpine base for prod", "Copy only necessary artifacts between stages", "Use .dockerignore to exclude dev files", "Compare image sizes before and after"],
        resume: "Optimized Docker images using multi-stage builds; reduced image size by 60%+ on FastAPI service",
        tools: ["docker", "dockerfile", "fastapi", "alpine"],
        outcome: "Lean production Docker image",
    },
    {
        day: 9, week: 2, skill: "Docker", difficulty: "Beginner",
        title: "Docker Compose Full Stack",
        tagline: "Spin up a complete app stack locally",
        description: "Docker Compose file for a React frontend, FastAPI backend, PostgreSQL DB, and Redis cache. With volumes, networks, health checks, and env vars.",
        tasks: ["Define 4 services in docker-compose.yml", "Use named volumes for PostgreSQL data", "Create custom bridge network", "Add healthcheck for DB and backend", "Use .env file for secrets"],
        resume: "Designed multi-service Docker Compose stack (React, FastAPI, PostgreSQL, Redis) with health checks and isolated networking",
        tools: ["docker-compose", "postgres", "redis", "fastapi"],
        outcome: "One-command full stack local env",
    },
    {
        day: 10, week: 2, skill: "Docker", difficulty: "Intermediate",
        title: "Private Container Registry",
        tagline: "Run your own Docker registry on-prem",
        description: "Deploy a private Docker registry with TLS and basic auth. Push and pull images. Set up a simple image vulnerability scan with Trivy.",
        tasks: ["Deploy registry:2 container with TLS certs", "Configure basic auth with htpasswd", "Push a custom image to private registry", "Pull and verify on another machine/container", "Scan image with Trivy for CVEs"],
        resume: "Deployed private Docker registry with TLS, basic auth, and Trivy vulnerability scanning integrated into CI pipeline",
        tools: ["docker", "registry:2", "openssl", "trivy", "htpasswd"],
        outcome: "Secure private registry + scan report",
    },
    {
        day: 11, week: 2, skill: "Python", difficulty: "Intermediate",
        title: "Docker API Controller",
        tagline: "Manage containers programmatically",
        description: "Python script using the Docker SDK to: list containers, start/stop them, stream logs, inspect resource usage, and auto-restart unhealthy containers.",
        tasks: ["Connect to Docker daemon via SDK", "List all running containers with stats", "Stream logs from a specified container", "Detect unhealthy containers and restart them", "Build a simple CLI interface with argparse"],
        resume: "Built Docker management CLI using Python Docker SDK; automated health-check-based container restarts",
        tools: ["python", "docker-sdk", "argparse", "rich"],
        outcome: "Container management CLI tool",
    },
    {
        day: 12, week: 2, skill: "Docker", difficulty: "Intermediate",
        title: "Container Resource Limiter & Monitor",
        tagline: "Enforce resource governance on containers",
        description: "Run containers with CPU and memory limits via Docker. Build a Python monitor that alerts when containers approach their limits.",
        tasks: ["Run containers with --memory and --cpus flags", "Use docker stats API to stream metrics", "Set threshold alerts (>80% memory = warn)", "Log metrics to a CSV time series", "Visualize with a simple matplotlib chart"],
        resume: "Implemented container resource governance with CPU/memory limits; built Python monitoring agent with threshold alerting",
        tools: ["docker", "python", "matplotlib", "docker-sdk"],
        outcome: "Resource metrics dashboard + alerts",
    },
    {
        day: 13, week: 2, skill: "Networking", difficulty: "Intermediate",
        title: "Docker Network Deep Dive",
        tagline: "Master bridge, host, overlay, and macvlan",
        description: "Hands-on lab exploring all Docker network modes. Set up containers in each mode, test connectivity, inspect with tcpdump, understand DNS resolution.",
        tasks: ["Create bridge, host, none, and macvlan networks", "Test inter-container DNS resolution", "Capture traffic with tcpdump inside containers", "Demonstrate overlay network with Docker Swarm (2 nodes)", "Document findings with diagrams"],
        resume: "Designed and validated Docker networking across bridge, host, overlay, and macvlan modes; documented traffic flow and DNS behavior",
        tools: ["docker", "tcpdump", "docker-swarm", "wireshark"],
        outcome: "Networking lab write-up + diagrams",
    },
    {
        day: 14, week: 2, skill: "Docker", difficulty: "Advanced",
        title: "Dockerized CI Runner",
        tagline: "Self-hosted GitLab/GitHub runner in Docker",
        description: "Deploy a self-hosted CI runner inside Docker. Configure it to run jobs in Docker-in-Docker (DinD) mode. Run a sample build and push pipeline.",
        tasks: ["Deploy GitLab Runner or GitHub Actions runner in Docker", "Configure DinD for building images in CI", "Register runner with your GitLab/GitHub", "Write a pipeline that builds and pushes an image", "Add caching for node_modules or pip packages"],
        resume: "Configured self-hosted GitLab Runner with Docker-in-Docker; built and pushed container images through automated CI pipeline",
        tools: ["docker", "gitlab-runner", "dind", "gitlab-ci"],
        outcome: "Working CI runner with image pipeline",
    },

    // WEEK 3 — Kubernetes
    {
        day: 15, week: 3, skill: "Kubernetes", difficulty: "Beginner",
        title: "Deploy & Expose a Microservice",
        tagline: "Your first real Kubernetes deployment",
        description: "Deploy a FastAPI app to k3s. Write Deployment, Service, and Ingress manifests. Scale it manually and observe pod scheduling.",
        tasks: ["Write Deployment manifest with 3 replicas", "Create ClusterIP Service", "Configure Ingress with nginx ingress controller", "Scale to 5 replicas with kubectl scale", "Trigger a rolling update with a new image tag"],
        resume: "Deployed FastAPI microservice on Kubernetes (k3s) with Ingress routing; performed rolling updates and manual scaling",
        tools: ["kubernetes", "k3s", "kubectl", "nginx-ingress"],
        outcome: "Live service accessible via Ingress",
    },
    {
        day: 16, week: 3, skill: "Kubernetes", difficulty: "Beginner",
        title: "ConfigMaps & Secrets Management",
        tagline: "Separate config from code in Kubernetes",
        description: "Use ConfigMaps for app config and Kubernetes Secrets for DB passwords. Mount as env vars and as files. Rotate a secret without downtime.",
        tasks: ["Create ConfigMap with app settings", "Create Secret for DB credentials", "Mount both as env vars in a Deployment", "Mount Secret as a file volume", "Update secret and verify app picks it up"],
        resume: "Implemented Kubernetes ConfigMap and Secret management; demonstrated zero-downtime secret rotation via volume mounts",
        tools: ["kubernetes", "kubectl", "base64", "k9s"],
        outcome: "Config-externalized deployment",
    },
    {
        day: 17, week: 3, skill: "Kubernetes", difficulty: "Intermediate",
        title: "HPA — Horizontal Pod Autoscaler",
        tagline: "Auto-scale under load like production",
        description: "Configure HPA based on CPU. Use a load generator (k6 or hey) to stress the service. Watch pods scale up and down automatically.",
        tasks: ["Install metrics-server on k3s", "Set CPU request/limits on Deployment", "Configure HPA min=2 max=10 CPU 50%", "Run k6 load test to spike CPU", "Observe and screenshot scale-up/scale-down"],
        resume: "Configured Horizontal Pod Autoscaler on k3s; validated auto-scaling behavior under synthetic load using k6",
        tools: ["kubernetes", "hpa", "metrics-server", "k6", "k9s"],
        outcome: "Auto-scaling service under load test",
    },
    {
        day: 18, week: 3, skill: "Kubernetes", difficulty: "Intermediate",
        title: "Persistent Storage with PVCs",
        tagline: "Stateful apps need durable storage",
        description: "Deploy PostgreSQL on Kubernetes with a PersistentVolumeClaim. Simulate pod restart and verify data persists. Backup using a CronJob.",
        tasks: ["Create StorageClass and PersistentVolumeClaim", "Deploy PostgreSQL with PVC mounted", "Insert test data, delete pod, verify data survives", "Create a CronJob to pg_dump to a volume", "Test restore from backup"],
        resume: "Deployed stateful PostgreSQL on Kubernetes with PVC; implemented automated CronJob backup and validated data persistence across pod restarts",
        tools: ["kubernetes", "pvc", "postgresql", "cronjob", "kubectl"],
        outcome: "Persistent DB with automated backups",
    },
    {
        day: 19, week: 3, skill: "Kubernetes", difficulty: "Intermediate",
        title: "RBAC — Role-Based Access Control",
        tagline: "Least-privilege access in Kubernetes",
        description: "Create service accounts for different teams: devs (read-only), ops (deploy access), monitoring (pod metrics). Test access boundaries.",
        tasks: ["Create 3 ServiceAccounts", "Write Roles with specific verbs/resources", "Bind via RoleBindings", "Test access with kubectl --as=system:serviceaccount", "Export kubeconfig per service account"],
        resume: "Implemented Kubernetes RBAC with least-privilege roles for dev, ops, and monitoring teams; validated access boundaries",
        tools: ["kubernetes", "rbac", "serviceaccount", "kubectl"],
        outcome: "RBAC policy set with 3 access tiers",
    },
    {
        day: 20, week: 3, skill: "Kubernetes", difficulty: "Advanced",
        title: "Helm Chart — Package Your App",
        tagline: "Templatize and version your deployments",
        description: "Convert your FastAPI Deployment/Service/Ingress manifests into a Helm chart. Parameterize image tag, replicas, ingress host. Deploy with helm install.",
        tasks: ["Run helm create to scaffold chart structure", "Templatize Deployment with values.yaml", "Add ingress toggle and host parameterization", "Lint and package the chart", "Deploy with helm install and upgrade with new values"],
        resume: "Packaged Kubernetes application as a Helm chart; parameterized environment-specific values for multi-env deployment",
        tools: ["helm", "kubernetes", "yaml", "kubectl"],
        outcome: "Installable Helm chart package",
    },
    {
        day: 21, week: 3, skill: "Kubernetes", difficulty: "Advanced",
        title: "ArgoCD GitOps Deployment",
        tagline: "Let Git be your single source of truth",
        description: "Install ArgoCD on k3s. Connect your Helm chart repo. Configure an Application that auto-syncs on git push. Simulate drift and watch auto-heal.",
        tasks: ["Install ArgoCD on k3s", "Connect Git repo with Helm chart", "Create ArgoCD Application manifest", "Push a change and watch auto-sync", "Manually mutate a resource and observe drift detection + heal"],
        resume: "Implemented GitOps workflow with ArgoCD; automated Kubernetes deployments via Helm chart git sync with drift detection",
        tools: ["argocd", "helm", "kubernetes", "git", "k3s"],
        outcome: "GitOps-driven live deployment pipeline",
    },

    // WEEK 4 — CI/CD
    {
        day: 22, week: 4, skill: "CI/CD", difficulty: "Beginner",
        title: "GitLab CI — Lint, Test, Build",
        tagline: "Your first complete CI pipeline",
        description: "Write a .gitlab-ci.yml with stages: lint → test → build. Lint Python with flake8, test with pytest, build Docker image. Run on your self-hosted runner.",
        tasks: ["Define lint stage with flake8", "Define test stage with pytest + coverage report", "Define build stage with docker build", "Add artifacts to pass coverage report between stages", "Trigger on MR and main branch"],
        resume: "Built GitLab CI pipeline with lint/test/build stages; integrated pytest coverage reporting and Docker image builds on self-hosted runner",
        tools: ["gitlab-ci", "python", "flake8", "pytest", "docker"],
        outcome: "3-stage pipeline on GitLab",
    },
    {
        day: 23, week: 4, skill: "CI/CD", difficulty: "Intermediate",
        title: "CI/CD — Push to Registry & Deploy",
        tagline: "Full pipeline: code to running container",
        description: "Extend Day 22 pipeline: after build, push image to Docker Hub or private registry, then SSH into a server and docker pull + restart the container.",
        tasks: ["Add registry push stage with docker login", "Use CI variables for registry credentials", "Add deploy stage with SSH remote command", "Use environments in GitLab for staging/prod", "Add manual approval gate before prod deploy"],
        resume: "Extended CI/CD pipeline to automated registry push and remote SSH deployment with environment-gated manual approval for production",
        tools: ["gitlab-ci", "docker-hub", "ssh", "gitlab-environments"],
        outcome: "Code-to-deploy automated pipeline",
    },
    {
        day: 24, week: 4, skill: "CI/CD", difficulty: "Intermediate",
        title: "Pipeline for Kubernetes Deploy",
        tagline: "CI/CD that deploys to Kubernetes",
        description: "CI pipeline that builds image, pushes to registry, then uses kubectl or helm upgrade to deploy to your k3s cluster. Use kubeconfig as a CI secret.",
        tasks: ["Store kubeconfig as masked CI variable", "Add k8s deploy stage with kubectl set image", "Alternatively use helm upgrade --install", "Implement rollback on failure with kubectl rollout undo", "Notify Slack on success/failure"],
        resume: "Implemented CI/CD pipeline with Kubernetes deployment stage; automated Helm upgrades with rollback on failure and Slack notifications",
        tools: ["gitlab-ci", "helm", "kubectl", "kubernetes", "slack-webhook"],
        outcome: "Pipeline deploying to k3s",
    },
    {
        day: 25, week: 4, skill: "CI/CD", difficulty: "Intermediate",
        title: "Semantic Versioning & Release Automation",
        tagline: "Automate your release process",
        description: "Use conventional commits + a tool like semantic-release or manually script versioning. Auto-generate CHANGELOG.md, tag the repo, and create a GitLab release.",
        tasks: ["Enforce conventional commit format with commitlint", "Script version bump based on commit type", "Auto-generate CHANGELOG.md", "Create git tag and GitLab release via API", "Trigger release pipeline on tag push"],
        resume: "Automated semantic versioning and release pipeline; generated changelogs and GitLab releases from conventional commits",
        tools: ["semantic-release", "commitlint", "gitlab-api", "bash"],
        outcome: "Automated versioned release pipeline",
    },
    {
        day: 26, week: 4, skill: "CI/CD", difficulty: "Advanced",
        title: "Pipeline Security: SAST, SCA, Image Scan",
        tagline: "Shift security left into CI",
        description: "Add security gates to your pipeline: SAST with Bandit (Python), SCA with Safety, image vulnerability scan with Trivy. Fail pipeline on CRITICAL CVEs.",
        tasks: ["Add Bandit SAST scan stage", "Add Safety dependency vulnerability check", "Add Trivy image scan with severity threshold", "Parse Trivy JSON output and fail on CRITICAL", "Upload scan reports as CI artifacts"],
        resume: "Integrated security scanning into CI/CD (Bandit SAST, Safety SCA, Trivy image scan); enforced pipeline failure on critical vulnerabilities",
        tools: ["bandit", "safety", "trivy", "gitlab-ci", "python"],
        outcome: "Security-gated CI pipeline",
    },
    {
        day: 27, week: 4, skill: "CI/CD", difficulty: "Advanced",
        title: "Matrix Build — Multi-version Testing",
        tagline: "Test across Python versions in parallel",
        description: "Configure a GitLab CI matrix to test your Python app across Python 3.9, 3.10, 3.11, 3.12 in parallel. Publish a combined test report.",
        tasks: ["Use parallel:matrix in gitlab-ci.yml", "Test across 4 Python versions simultaneously", "Collect junit XML reports from each", "Merge and publish test results", "Visualize pass/fail per version in GitLab UI"],
        resume: "Implemented parallel matrix CI builds across Python 3.9–3.12; unified test reporting with JUnit XML artifacts",
        tools: ["gitlab-ci", "python", "pytest", "junit-xml"],
        outcome: "Multi-version parallel CI matrix",
    },
    {
        day: 28, week: 4, skill: "CI/CD", difficulty: "Advanced",
        title: "Self-Healing Pipeline with Retry & Notify",
        tagline: "Make your pipeline resilient",
        description: "Add retry logic for flaky tests, timeout limits, auto-cancellation of redundant pipelines, and comprehensive alerting (Slack, email) on failures.",
        tasks: ["Add retry: 2 for network-dependent jobs", "Set timeout per stage", "Enable auto-cancel for redundant pipelines on new push", "Add on_failure Slack notification with job URL", "Create pipeline dashboard with GitLab badges"],
        resume: "Hardened CI/CD pipelines with retry logic, timeouts, auto-cancellation, and Slack failure alerting; added pipeline health badges",
        tools: ["gitlab-ci", "slack-webhook", "curl", "gitlab-badges"],
        outcome: "Resilient self-healing pipeline",
    },

    // WEEK 5 — Terraform
    {
        day: 29, week: 5, skill: "Terraform", difficulty: "Beginner",
        title: "Provision a VM on Azure/GCP",
        tagline: "Infrastructure as Code from scratch",
        description: "Write Terraform to provision a Linux VM on Azure (or GCP). Include VNet, subnet, NSG, public IP, and SSH key injection.",
        tasks: ["Write main.tf with provider config", "Define resource group, VNet, subnet, NSG", "Provision VM with SSH public key", "Output public IP after apply", "Use variables.tf and terraform.tfvars"],
        resume: "Provisioned Azure Linux VM with Terraform including networking (VNet, NSG, subnet) and SSH key injection; used variable parameterization",
        tools: ["terraform", "azure", "hcl", "ssh"],
        outcome: "SSH-accessible VM via Terraform",
    },
    {
        day: 30, week: 5, skill: "Terraform", difficulty: "Beginner",
        title: "Remote State with Azure Blob / GCS",
        tagline: "Collaborate safely on Terraform state",
        description: "Move Terraform state from local to remote backend (Azure Blob Storage or GCS). Enable state locking. Simulate team collaboration.",
        tasks: ["Create Storage Account and container for state", "Configure backend.tf for remote state", "Enable state locking", "Run plan from two terminals to test lock", "Encrypt state at rest"],
        resume: "Configured Terraform remote state backend on Azure Blob Storage with state locking; enabled team-safe collaborative infrastructure management",
        tools: ["terraform", "azure-storage", "backend", "state-locking"],
        outcome: "Remote-state Terraform project",
    },
    {
        day: 31, week: 5, skill: "Terraform", difficulty: "Intermediate",
        title: "Terraform Modules — Reusable Network",
        tagline: "DRY infrastructure with modules",
        description: "Create a reusable Terraform module for networking (VNet, subnets, NSG, peering). Call it from root module with different env configs.",
        tasks: ["Write a network/ module with variables and outputs", "Call module from root with dev and prod vars", "Add module versioning with source tags", "Test module with terraform plan for both envs", "Document module inputs/outputs in README"],
        resume: "Built reusable Terraform modules for Azure networking; reduced code duplication across environments by 70%",
        tools: ["terraform", "modules", "hcl", "azure"],
        outcome: "Reusable network module library",
    },
    {
        day: 32, week: 5, skill: "Terraform", difficulty: "Intermediate",
        title: "Terraform + GitLab CI Pipeline",
        tagline: "Automate infra changes through CI",
        description: "Run terraform plan in CI on MR, post plan output as MR comment. Run terraform apply automatically on merge to main. Use remote state.",
        tasks: ["Configure terraform in GitLab CI with credentials", "Run plan on MR and capture output", "Post plan diff as MR comment via GitLab API", "Auto-apply on main merge", "Add drift detection with scheduled pipeline"],
        resume: "Automated infrastructure provisioning via Terraform CI/CD pipeline; plan output posted as MR comments with auto-apply on merge",
        tools: ["terraform", "gitlab-ci", "gitlab-api", "azure"],
        outcome: "IaC pipeline with MR plan comments",
    },
    {
        day: 33, week: 5, skill: "Terraform", difficulty: "Intermediate",
        title: "Provision AKS / GKE Cluster",
        tagline: "Managed Kubernetes cluster via Terraform",
        description: "Use Terraform to provision an AKS (Azure) or GKE (GCP) cluster with node pools, autoscaling, RBAC, and monitoring enabled.",
        tasks: ["Write Terraform for AKS/GKE resource", "Configure system and user node pools", "Enable cluster autoscaler", "Configure RBAC and Azure AD integration", "Output kubeconfig to connect with kubectl"],
        resume: "Provisioned production-grade AKS/GKE cluster with Terraform; configured autoscaling node pools, RBAC, and monitoring integration",
        tools: ["terraform", "aks", "gke", "kubectl", "azure"],
        outcome: "Managed Kubernetes cluster on cloud",
    },
    {
        day: 34, week: 5, skill: "Terraform", difficulty: "Advanced",
        title: "Terraform Workspace — Multi-Env",
        tagline: "Manage dev/staging/prod from one codebase",
        description: "Use Terraform workspaces to manage dev, staging, and prod environments. Different VM sizes and replica counts per workspace. Shared modules.",
        tasks: ["Create and switch between workspaces", "Use terraform.workspace in conditionals", "Different sizing per environment in locals", "Share remote state per workspace", "Run workspace-specific plans in CI"],
        resume: "Implemented multi-environment Terraform with workspaces (dev/staging/prod); environment-specific sizing via workspace-conditional locals",
        tools: ["terraform", "workspaces", "hcl", "azure", "gitlab-ci"],
        outcome: "3-environment IaC from one codebase",
    },
    {
        day: 35, week: 5, skill: "Terraform", difficulty: "Advanced",
        title: "Terratest — Test Your Infrastructure",
        tagline: "Automated testing for Terraform modules",
        description: "Write Go-based Terratest tests for your Terraform modules. Provision real infra, validate properties, then destroy. Run in CI.",
        tasks: ["Write Terratest test for network module", "Assert subnet CIDRs and NSG rules", "Test VM module: assert SSH port accessible", "Run tests in CI with Go test cache", "Report test results"],
        resume: "Implemented infrastructure testing with Terratest; automated provisioning validation and SSH connectivity checks in CI pipeline",
        tools: ["terratest", "go", "terraform", "azure", "gitlab-ci"],
        outcome: "Automated infra test suite in Go",
    },

    // WEEK 6 — Ansible
    {
        day: 36, week: 6, skill: "Ansible", difficulty: "Beginner",
        title: "Server Provisioning Playbook",
        tagline: "Automate new server setup end-to-end",
        description: "Ansible playbook to configure a fresh Ubuntu server: install packages, create users, configure SSH, set up firewall, install Docker.",
        tasks: ["Create inventory with host groups", "Write playbook with roles: base, users, docker", "Use ansible-vault for SSH key secrets", "Test with --check dry run mode", "Tag tasks for selective execution"],
        resume: "Built Ansible playbook for automated server provisioning; configured base OS, users, SSH hardening, and Docker via idempotent roles",
        tools: ["ansible", "ansible-vault", "ubuntu", "yaml"],
        outcome: "Fully-configured server in one command",
    },
    {
        day: 37, week: 6, skill: "Ansible", difficulty: "Intermediate",
        title: "Ansible Roles — Nginx + TLS",
        tagline: "Production web server with Let's Encrypt",
        description: "Create an Ansible role to install Nginx, configure virtual hosts, and provision TLS certificates via Certbot/Let's Encrypt. Parameterize domain name.",
        tasks: ["Create ansible-galaxy style role structure", "Install and configure Nginx with templates", "Run Certbot to get Let's Encrypt cert", "Configure auto-renewal cron", "Test idempotency by running twice"],
        resume: "Developed parameterized Ansible role for Nginx with automated TLS provisioning via Let's Encrypt; verified idempotent execution",
        tools: ["ansible", "nginx", "certbot", "jinja2", "letsencrypt"],
        outcome: "HTTPS-enabled web server role",
    },
    {
        day: 38, week: 6, skill: "Ansible", difficulty: "Intermediate",
        title: "Ansible + Terraform Integration",
        tagline: "Provision infra then configure it automatically",
        description: "Use Terraform to provision VMs. Use Terraform output to build Ansible dynamic inventory. Then run Ansible to configure the freshly provisioned servers.",
        tasks: ["Terraform outputs IP addresses as JSON", "Script that builds Ansible inventory from Terraform output", "Run Ansible against dynamic inventory", "Test full workflow: terraform apply → ansible-playbook", "Wrap in a Makefile for one-command deploy"],
        resume: "Integrated Terraform and Ansible for end-to-end IaC: Terraform provisions cloud VMs, dynamic inventory drives Ansible configuration",
        tools: ["terraform", "ansible", "python", "makefile", "azure"],
        outcome: "Full provision-and-configure pipeline",
    },
    {
        day: 39, week: 6, skill: "Ansible", difficulty: "Advanced",
        title: "Ansible for Kubernetes Node Setup",
        tagline: "Automate k8s node joining with Ansible",
        description: "Write Ansible playbooks to install kubeadm, kubelet, kubectl on nodes, initialize the control plane, and join worker nodes automatically.",
        tasks: ["Install container runtime (containerd) via role", "Install kubeadm/kubelet/kubectl", "Initialize control plane with kubeadm", "Capture join token and distribute to workers", "Verify cluster with kubectl get nodes"],
        resume: "Automated Kubernetes cluster bootstrapping with Ansible; provisioned control plane and worker nodes via kubeadm roles",
        tools: ["ansible", "kubeadm", "kubernetes", "containerd", "ubuntu"],
        outcome: "Ansible-bootstrapped Kubernetes cluster",
    },

    // WEEK 7 — Monitoring & Observability
    {
        day: 40, week: 7, skill: "Monitoring", difficulty: "Intermediate",
        title: "Prometheus + Grafana Stack",
        tagline: "Full observability stack from scratch",
        description: "Deploy Prometheus and Grafana via Docker Compose. Scrape node_exporter, cAdvisor for containers, and your FastAPI app (custom metrics). Build dashboards.",
        tasks: ["Deploy prometheus, grafana, node_exporter, cadvisor", "Configure prometheus.yml scrape targets", "Instrument FastAPI with prometheus_fastapi_instrumentator", "Build Grafana dashboard for app golden signals", "Set up alerting rules in Prometheus"],
        resume: "Built full observability stack (Prometheus + Grafana); instrumented FastAPI with custom metrics and built golden-signal dashboards",
        tools: ["prometheus", "grafana", "cadvisor", "node_exporter", "fastapi"],
        outcome: "Live metrics dashboard + alerting",
    },
    {
        day: 41, week: 7, skill: "Monitoring", difficulty: "Intermediate",
        title: "ELK Stack — Centralized Logging",
        tagline: "Aggregate and search all your logs",
        description: "Deploy Elasticsearch, Logstash, Kibana. Ship logs from Nginx and your FastAPI app via Filebeat. Create Kibana dashboards for error analysis.",
        tasks: ["Deploy ELK stack with Docker Compose", "Configure Filebeat to tail Nginx logs", "Write Logstash pipeline to parse and enrich logs", "Create Kibana index pattern", "Build dashboard: error rates, top endpoints, latency"],
        resume: "Deployed ELK centralized logging stack; shipped and parsed Nginx + application logs via Filebeat/Logstash with Kibana visualization",
        tools: ["elasticsearch", "logstash", "kibana", "filebeat", "nginx"],
        outcome: "Searchable centralized log dashboard",
    },
    {
        day: 42, week: 7, skill: "Monitoring", difficulty: "Advanced",
        title: "Alertmanager + PagerDuty-style Routing",
        tagline: "Production-grade alert routing and silencing",
        description: "Configure Alertmanager with routes, receivers (Slack, email), inhibition rules, and grouping. Simulate incidents and practice alert management.",
        tasks: ["Write alertmanager.yml with routes and receivers", "Configure Slack and email receivers", "Add inhibition rules (silence child alerts during parent)", "Group alerts by service and severity", "Test with amtool and manually firing alerts"],
        resume: "Configured Prometheus Alertmanager with multi-receiver routing (Slack, email), inhibition rules, and alert grouping for production incident management",
        tools: ["alertmanager", "prometheus", "slack", "amtool"],
        outcome: "Multi-channel alert routing system",
    },

    // WEEK 8 — Security & Final Projects
    {
        day: 43, week: 8, skill: "Security", difficulty: "Intermediate",
        title: "Secrets Management with Vault",
        tagline: "Never hardcode a secret again",
        description: "Deploy HashiCorp Vault in dev mode. Store DB credentials. Write a Python app that fetches secrets from Vault at runtime via the KV engine. Integrate with Kubernetes.",
        tasks: ["Run Vault in dev mode via Docker", "Store secrets in KV v2 engine", "Write Python app using hvac to fetch secrets", "Configure Kubernetes auth method", "Inject secrets into pods via Vault Agent"],
        resume: "Integrated HashiCorp Vault for secrets management; implemented Kubernetes auth method and runtime secret injection via Vault Agent",
        tools: ["vault", "python", "hvac", "kubernetes", "docker"],
        outcome: "Runtime secret injection in Kubernetes",
    },
    {
        day: 44, week: 8, skill: "Security", difficulty: "Intermediate",
        title: "Network Policy — Zero Trust in Kubernetes",
        tagline: "Micro-segmentation inside your cluster",
        description: "Implement Kubernetes NetworkPolicies to enforce zero-trust: default deny all, then allow only required paths (frontend → backend → DB). Test with kubectl exec.",
        tasks: ["Apply default-deny-all NetworkPolicy", "Allow frontend to backend on port 8000", "Allow backend to postgres on port 5432", "Block all other traffic", "Verify with kubectl exec and curl"],
        resume: "Implemented Kubernetes zero-trust network segmentation with NetworkPolicies; enforced micro-segmentation and validated traffic isolation",
        tools: ["kubernetes", "networkpolicy", "calico", "kubectl"],
        outcome: "Zero-trust networked application",
    },
    {
        day: 45, week: 8, skill: "Security", difficulty: "Advanced",
        title: "OPA Gatekeeper — Policy as Code",
        tagline: "Enforce governance rules across your cluster",
        description: "Install OPA Gatekeeper. Write policies that enforce: all pods must have resource limits, no latest tag, required labels, no privileged containers.",
        tasks: ["Install Gatekeeper on k3s", "Write ConstraintTemplate for resource limits", "Write ConstraintTemplate for no-latest-tag", "Write policy for required labels", "Test each policy with compliant and non-compliant pods"],
        resume: "Implemented OPA Gatekeeper policy-as-code on Kubernetes; enforced resource limits, label requirements, and image tag governance",
        tools: ["gatekeeper", "opa", "rego", "kubernetes", "kubectl"],
        outcome: "Policy-governed Kubernetes cluster",
    },
    {
        day: 46, week: 8, skill: "Python", difficulty: "Advanced",
        title: "Incident Response Runbook Automation",
        tagline: "Auto-remediate common production incidents",
        description: "Python bot that watches Alertmanager webhooks, maps alerts to runbooks, and automatically remediates: restart pod, scale up, clear disk space, etc.",
        tasks: ["Build Flask webhook receiver for Alertmanager", "Map alert names to remediation functions", "Implement: restart-pod, scale-deployment, clear-tmp", "Log all actions with before/after state", "Add dry-run mode and Slack approval workflow"],
        resume: "Built incident response automation bot; consumed Alertmanager webhooks and auto-remediated common Kubernetes incidents with Slack approval workflow",
        tools: ["python", "flask", "kubernetes-sdk", "alertmanager", "slack"],
        outcome: "Self-healing incident response bot",
    },
    {
        day: 47, week: 8, skill: "CI/CD", difficulty: "Advanced",
        title: "Full GitOps Platform",
        tagline: "Tie everything together: the capstone",
        description: "End-to-end: code push → CI tests → Docker build → push to registry → ArgoCD auto-deploys to k3s → Prometheus alerts → Slack notification. Everything automated.",
        tasks: ["Wire GitLab CI to build and push on merge", "ArgoCD watches Helm chart repo and auto-syncs", "Prometheus monitors the deployed service", "Alertmanager routes to Slack", "Document the full architecture in a README"],
        resume: "Architected end-to-end GitOps platform: GitLab CI → Docker registry → ArgoCD Helm deployment → Prometheus/Alertmanager observability with Slack integration",
        tools: ["gitlab-ci", "argocd", "helm", "prometheus", "alertmanager", "k3s"],
        outcome: "Production-grade GitOps platform",
    },
    {
        day: 48, week: 8, skill: "Terraform", difficulty: "Advanced",
        title: "Multi-Cloud Networking Lab",
        tagline: "Connect Azure and GCP with VPN tunnel",
        description: "Use Terraform to provision VPCs in Azure and GCP. Create a site-to-site VPN tunnel between them. Route traffic privately across clouds.",
        tasks: ["Provision Azure VNet and VPN Gateway via Terraform", "Provision GCP VPC and Cloud VPN via Terraform", "Configure IPsec tunnel between them", "Test private connectivity with ping across clouds", "Document BGP route exchange"],
        resume: "Engineered multi-cloud networking solution with Azure-GCP site-to-site VPN using Terraform; validated private cross-cloud connectivity",
        tools: ["terraform", "azure", "gcp", "vpn", "bgp"],
        outcome: "Working multi-cloud VPN tunnel",
    },
];

const weekLabels = {
    1: "Linux & Bash",
    2: "Docker",
    3: "Kubernetes",
    4: "CI/CD",
    5: "Terraform",
    6: "Ansible",
    7: "Monitoring",
    8: "Security & Capstone",
};

const skillColors = {
    Linux: "#4ade80",
    Bash: "#a3e635",
    Python: "#facc15",
    Docker: "#38bdf8",
    Kubernetes: "#818cf8",
    Terraform: "#c084fc",
    "CI/CD": "#fb923c",
    Networking: "#34d399",
    Ansible: "#f87171",
    Monitoring: "#e879f9",
    Security: "#fbbf24",
};

const difficultyBadge = {
    Beginner: { bg: "rgba(74,222,128,0.15)", color: "#4ade80", label: "Beginner" },
    Intermediate: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24", label: "Intermediate" },
    Advanced: { bg: "rgba(248,113,113,0.15)", color: "#f87171", label: "Advanced" },
};

export default function DevOpsRoadmap() {
    const [activeSkill, setActiveSkill] = useState("All");
    const [selectedProject, setSelectedProject] = useState(null);
    const [completedDays, setCompletedDays] = useState(new Set());
    const [activeView, setActiveView] = useState("grid"); // "grid" | "week"

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/progress`);
                const data = await response.json();
                setCompletedDays(new Set(data));
            } catch (err) {
                console.error('Failed to fetch progress:', err);
            }
        };
        fetchProgress();
    }, []);

    const filtered = activeSkill === "All" ? projects : projects.filter(p => p.skill === activeSkill);

    const toggleComplete = async (day, e) => {
        e.stopPropagation();
        const isCompleted = completedDays.has(day);
        
        // Optimistic update
        setCompletedDays(prev => {
            const next = new Set(prev);
            if (isCompleted) next.delete(day);
            else next.add(day);
            return next;
        });

        try {
            await fetch(`${API_BASE_URL}/api/progress/${day}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !isCompleted }),
            });
        } catch (err) {
            console.error('Failed to save progress:', err);
            // Revert on error
            setCompletedDays(prev => {
                const next = new Set(prev);
                if (isCompleted) next.add(day);
                else next.delete(day);
                return next;
            });
        }
    };

    const progress = Math.round((completedDays.size / projects.length) * 100);

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0a0a0f",
            color: "#e2e8f0",
            fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
            padding: "0",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        .card-hover { transition: all 0.2s ease; cursor: pointer; }
        .card-hover:hover { transform: translateY(-2px); border-color: rgba(129,140,248,0.5) !important; }
        .skill-btn { transition: all 0.15s ease; cursor: pointer; border: none; }
        .skill-btn:hover { opacity: 0.85; }
        .done-btn { transition: all 0.15s ease; cursor: pointer; }
        .done-btn:hover { transform: scale(1.1); }
        .modal-overlay { animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-card { animation: slideUp 0.2s ease; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .progress-fill { transition: width 0.5s ease; }
      `}</style>

            {/* Header */}
            <div style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
                borderBottom: "1px solid #1e293b",
                padding: "32px 24px 24px",
            }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                        <div>
                            <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#818cf8", fontWeight: 600, marginBottom: 8 }}>
                                DEVOPS MASTERY ROADMAP
                            </div>
                            <h1 style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: 28, fontWeight: 700, color: "#f1f5f9",
                                lineHeight: 1.2, marginBottom: 8,
                            }}>
                                48 Projects.<br />
                                <span style={{ color: "#818cf8" }}>8 Weeks.</span> 1 Career.
                            </h1>
                            <p style={{ fontSize: 12, color: "#64748b", maxWidth: 400 }}>
                                One project per day across Docker, Kubernetes, Terraform, CI/CD, Ansible, and more. Each builds your resume.
                            </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>OVERALL PROGRESS</div>
                            <div style={{ fontSize: 36, fontWeight: 700, color: "#818cf8", lineHeight: 1 }}>{progress}%</div>
                            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{completedDays.size} / {projects.length} done</div>
                            <div style={{ width: 120, height: 4, background: "#1e293b", borderRadius: 2, marginTop: 8, marginLeft: "auto" }}>
                                <div className="progress-fill" style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #6366f1, #818cf8)", borderRadius: 2 }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div style={{ background: "#0d0d14", borderBottom: "1px solid #1e293b", padding: "12px 24px", position: "sticky", top: 0, zIndex: 10 }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    {skills.map(s => (
                        <button key={s} className="skill-btn" onClick={() => setActiveSkill(s)} style={{
                            padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                            fontFamily: "'IBM Plex Mono', monospace",
                            background: activeSkill === s ? (skillColors[s] || "#818cf8") : "#1e293b",
                            color: activeSkill === s ? "#0a0a0f" : "#94a3b8",
                            border: activeSkill === s ? "none" : "1px solid #334155",
                            letterSpacing: "0.05em",
                        }}>
                            {s}
                        </button>
                    ))}
                    <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                        {["grid", "week"].map(v => (
                            <button key={v} className="skill-btn" onClick={() => setActiveView(v)} style={{
                                padding: "5px 10px", borderRadius: 6, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
                                background: activeView === v ? "#1e293b" : "transparent",
                                color: activeView === v ? "#e2e8f0" : "#475569",
                                border: "1px solid " + (activeView === v ? "#334155" : "transparent"),
                            }}>
                                {v === "grid" ? "⊞ Grid" : "☰ Week"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
                {activeView === "grid" ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                        {filtered.map(p => (
                            <ProjectCard key={p.day} p={p} completed={completedDays.has(p.day)}
                                onToggle={toggleComplete} onClick={() => setSelectedProject(p)} />
                        ))}
                    </div>
                ) : (
                    <WeekView projects={filtered} completedDays={completedDays}
                        onToggle={toggleComplete} onSelect={setSelectedProject} />
                )}
            </div>

            {/* Modal */}
            {selectedProject && (
                <ProjectModal project={selectedProject} completed={completedDays.has(selectedProject.day)}
                    onToggle={toggleComplete} onClose={() => setSelectedProject(null)} />
            )}
        </div>
    );
}

function ProjectCard({ p, completed, onToggle, onClick }) {
    const skillColor = skillColors[p.skill] || "#818cf8";
    const diff = difficultyBadge[p.difficulty];
    return (
        <div className="card-hover" onClick={onClick} style={{
            background: completed ? "rgba(74,222,128,0.04)" : "#111118",
            border: "1px solid " + (completed ? "rgba(74,222,128,0.2)" : "#1e293b"),
            borderRadius: 10, padding: "14px", position: "relative", overflow: "hidden",
        }}>
            {completed && (
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: "linear-gradient(90deg, #4ade80, #22d3ee)",
                }} />
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{
                        fontSize: 10, fontWeight: 700, color: skillColor,
                        background: skillColor + "20", padding: "2px 7px", borderRadius: 4, letterSpacing: "0.05em",
                    }}>{p.skill.toUpperCase()}</span>
                    <span style={{ fontSize: 10, color: diff.color, background: diff.bg, padding: "2px 6px", borderRadius: 4 }}>
                        {diff.label}
                    </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#475569" }}>Day {p.day}</span>
                    <button className="done-btn" onClick={(e) => onToggle(p.day, e)} style={{
                        width: 20, height: 20, borderRadius: "50%", border: "1.5px solid " + (completed ? "#4ade80" : "#334155"),
                        background: completed ? "#4ade80" : "transparent", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                    }}>
                        {completed && <span style={{ color: "#0a0a0f", lineHeight: 1 }}>✓</span>}
                    </button>
                </div>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: "#f1f5f9", marginBottom: 4, lineHeight: 1.3 }}>
                {p.title}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>{p.tagline}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {p.tools.slice(0, 4).map(t => (
                    <span key={t} style={{ fontSize: 10, color: "#475569", background: "#1e293b", padding: "2px 6px", borderRadius: 3 }}>
                        {t}
                    </span>
                ))}
            </div>
        </div>
    );
}

function WeekView({ projects, completedDays, onToggle, onSelect }) {
    const weeks = [...new Set(projects.map(p => p.week))].sort();
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {weeks.map(w => {
                const weekProjects = projects.filter(p => p.week === w);
                const weekDone = weekProjects.filter(p => completedDays.has(p.day)).length;
                return (
                    <div key={w}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                            <div style={{
                                background: "#1e293b", borderRadius: 6, padding: "4px 12px",
                                fontSize: 11, fontWeight: 700, color: "#818cf8", letterSpacing: "0.1em",
                            }}>
                                WEEK {w}
                            </div>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>
                                {weekLabels[w]}
                            </div>
                            <div style={{ marginLeft: "auto", fontSize: 11, color: "#64748b" }}>
                                {weekDone}/{weekProjects.length} done
                            </div>
                            <div style={{ width: 80, height: 3, background: "#1e293b", borderRadius: 2 }}>
                                <div style={{
                                    height: "100%", borderRadius: 2, background: "#818cf8",
                                    width: `${weekProjects.length > 0 ? (weekDone / weekProjects.length) * 100 : 0}%`,
                                    transition: "width 0.4s ease",
                                }} />
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 10 }}>
                            {weekProjects.map(p => (
                                <ProjectCard key={p.day} p={p} completed={completedDays.has(p.day)}
                                    onToggle={onToggle} onClick={() => onSelect(p)} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ProjectModal({ project: p, completed, onToggle, onClose }) {
    const skillColor = skillColors[p.skill] || "#818cf8";
    const diff = difficultyBadge[p.difficulty];
    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}>
            <div className="modal-card" onClick={e => e.stopPropagation()} style={{
                background: "#111118", border: "1px solid #1e293b", borderRadius: 14,
                padding: "28px", maxWidth: 600, width: "100%", maxHeight: "90vh",
                overflowY: "auto", position: "relative",
            }}>
                <button onClick={onClose} style={{
                    position: "absolute", top: 16, right: 16, background: "#1e293b",
                    border: "none", color: "#94a3b8", width: 28, height: 28, borderRadius: "50%",
                    cursor: "pointer", fontSize: 14, fontFamily: "monospace",
                }}>✕</button>

                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, background: skillColor + "20", color: skillColor, padding: "3px 8px", borderRadius: 4, fontWeight: 700, letterSpacing: "0.08em" }}>
                        {p.skill.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 10, background: diff.bg, color: diff.color, padding: "3px 8px", borderRadius: 4 }}>
                        {diff.label}
                    </span>
                    <span style={{ fontSize: 10, color: "#475569", background: "#1e293b", padding: "3px 8px", borderRadius: 4 }}>
                        Week {p.week} · Day {p.day}
                    </span>
                </div>

                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>
                    {p.title}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{p.tagline}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, marginBottom: 20 }}>{p.description}</div>

                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.15em", marginBottom: 10, fontWeight: 600 }}>TASKS</div>
                    {p.tasks.map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                            <span style={{ color: skillColor, fontSize: 12, marginTop: 1, flexShrink: 0 }}>▸</span>
                            <span style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.6 }}>{t}</span>
                        </div>
                    ))}
                </div>

                <div style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: 8, padding: "12px 14px", marginBottom: 20 }}>
                    <div style={{ fontSize: 10, color: "#6366f1", letterSpacing: "0.15em", marginBottom: 6, fontWeight: 600 }}>📄 RESUME BULLET</div>
                    <div style={{ fontSize: 12, color: "#a5b4fc", lineHeight: 1.6, fontStyle: "italic" }}>"{p.resume}"</div>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.15em", marginBottom: 8, fontWeight: 600 }}>TOOLS</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {p.tools.map(t => (
                            <span key={t} style={{ fontSize: 11, color: "#94a3b8", background: "#1e293b", padding: "3px 8px", borderRadius: 4 }}>{t}</span>
                        ))}
                    </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button onClick={(e) => onToggle(p.day, e)} style={{
                        flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer",
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600,
                        background: completed ? "rgba(74,222,128,0.15)" : "#1e293b",
                        color: completed ? "#4ade80" : "#94a3b8",
                        border: "1px solid " + (completed ? "rgba(74,222,128,0.3)" : "#334155"),
                        transition: "all 0.2s ease",
                    }}>
                        {completed ? "✓ Completed" : "Mark as Complete"}
                    </button>
                    <div style={{ fontSize: 11, color: "#475569", background: "#1e293b", padding: "10px 14px", borderRadius: 8, border: "1px solid #334155" }}>
                        🏁 {p.outcome.split(" ").slice(0, 4).join(" ")}…
                    </div>
                </div>
            </div>
        </div>
    );
}