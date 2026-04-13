import { useState, useEffect, useCallback, useMemo } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const phases = [
  { id: 1, name: "Foundations", subtitle: "The bedrock everything runs on", weeks: "1–3", color: "#22d3ee" },
  { id: 2, name: "Containerization", subtitle: "Pack it, ship it, run it anywhere", weeks: "4–5", color: "#818cf8" },
  { id: 3, name: "Orchestration", subtitle: "Containers at scale", weeks: "6–8", color: "#c084fc" },
  { id: 4, name: "Infrastructure as Code", subtitle: "Clicks are bugs. Code is truth.", weeks: "9–11", color: "#f97316" },
  { id: 5, name: "CI/CD & GitOps", subtitle: "Automate the path to production", weeks: "12–14", color: "#fb923c" },
  { id: 6, name: "Observability & Reliability", subtitle: "If you can't measure it, you can't fix it", weeks: "15–16", color: "#e879f9" },
  { id: 7, name: "Security & Governance", subtitle: "Shift left. Trust nothing.", weeks: "17–18", color: "#fbbf24" },
  { id: 8, name: "Capstone & Interview Prep", subtitle: "Prove it end-to-end", weeks: "19–20", color: "#4ade80" },
];

const skills = [
  "All", "Linux", "Networking", "Bash", "Git", "Python",
  "Docker", "Kubernetes", "Terraform", "Ansible", "Cloud",
  "CI/CD", "Monitoring", "Security",
];

const skillColors = {
  Linux: "#4ade80", Networking: "#34d399", Bash: "#a3e635",
  Git: "#fb923c", Python: "#facc15", Docker: "#38bdf8",
  Kubernetes: "#818cf8", Terraform: "#c084fc", Ansible: "#f87171",
  Cloud: "#06b6d4", "CI/CD": "#fb923c", Monitoring: "#e879f9",
  Security: "#fbbf24",
};

const projects = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 1 — FOUNDATIONS (Weeks 1–3)
  // ═══════════════════════════════════════════════════════════════════════════

  // Week 1: Linux Deep Dive
  {
    day: 1, week: 1, phase: 1, skill: "Linux", difficulty: "Beginner",
    title: "System Recon Script",
    tagline: "Build a sysadmin's first-responder toolkit",
    description: "Write a Bash script that collects system info: CPU, RAM, disk, top processes, open ports, logged-in users, and uptime. Output a formatted report to a file.",
    tasks: ["Collect CPU/RAM/Disk stats using /proc and df/free", "List top 10 CPU-consuming processes", "Show listening ports with ss or netstat", "Write timestamped report to /var/log/sysreport.txt", "Schedule it via cron every 6 hours"],
    resume: "Built automated system health reporting tool using Bash; scheduled via cron for proactive monitoring",
    tools: ["bash", "cron", "ss", "awk", "sed"],
    outcome: "Cron-scheduled report generator",
  },
  {
    day: 2, week: 1, phase: 1, skill: "Linux", difficulty: "Beginner",
    title: "User & Permission Auditor",
    tagline: "Simulate a security audit on a Linux system",
    description: "Script that audits all users, their groups, sudo access, home directory permissions, and SSH key presence. Flags anomalies.",
    tasks: ["Parse /etc/passwd and /etc/group", "Check sudo access per user", "Verify home dir permissions (should be 700)", "Check for authorized_keys files", "Output a CSV audit report"],
    resume: "Automated Linux user & permission audit tool; flagged misconfigurations and generated CSV compliance reports",
    tools: ["bash", "awk", "cut", "grep", "find"],
    outcome: "CSV security audit report",
  },
  {
    day: 3, week: 1, phase: 1, skill: "Linux", difficulty: "Intermediate",
    title: "Process & Service Manager",
    tagline: "Understand systemd inside out",
    description: "Create a custom systemd service for a Python health-check daemon. Configure restart policies, logging, resource limits, and timer-based triggering.",
    tasks: ["Write a Python daemon that checks HTTP endpoints", "Create a systemd .service unit file", "Configure Restart=on-failure with backoff", "Add resource limits (MemoryMax, CPUQuota)", "Create a systemd .timer for periodic execution"],
    resume: "Built custom systemd service with restart policies, resource limits, and timer-based scheduling for health-check daemon",
    tools: ["systemd", "systemctl", "journalctl", "python"],
    outcome: "Production systemd service + timer",
  },
  {
    day: 4, week: 1, phase: 1, skill: "Linux", difficulty: "Intermediate",
    title: "Filesystem & Storage Deep Dive",
    tagline: "LVM, mounts, quotas — the real stuff",
    description: "Hands-on lab with disk partitioning, LVM volume creation, filesystem mounts, fstab configuration, and disk quota management on a VM.",
    tasks: ["Create partitions with fdisk/parted", "Set up LVM: PV → VG → LV", "Create ext4/xfs filesystems and mount them", "Configure persistent mounts in /etc/fstab", "Set up user disk quotas with quota tools"],
    resume: "Managed Linux storage infrastructure: LVM volumes, filesystem creation, persistent mounting, and user quota enforcement",
    tools: ["fdisk", "lvm", "mount", "fstab", "quota"],
    outcome: "LVM-managed storage with quotas",
  },
  {
    day: 5, week: 1, phase: 1, skill: "Linux", difficulty: "Intermediate",
    title: "Hardening Checklist Automation",
    tagline: "Automate CIS benchmark checks",
    description: "Script that checks a server against a CIS-like hardening checklist: SSH config, firewall status, password policies, kernel params, unnecessary services.",
    tasks: ["Check SSH: PermitRootLogin, PasswordAuth, MaxAuthTries", "Verify UFW/iptables is active", "Check password complexity via PAM config", "Verify sysctl hardening params (ip_forward, etc.)", "Output PASS/FAIL checklist with recommendations"],
    resume: "Automated Linux security hardening audit against CIS benchmark checklist; generated PASS/FAIL compliance report",
    tools: ["bash", "sshd_config", "sysctl", "pam", "ufw"],
    outcome: "CIS compliance report script",
  },

  // Week 2: Networking Fundamentals
  {
    day: 6, week: 2, phase: 1, skill: "Networking", difficulty: "Beginner",
    title: "Network Fundamentals Lab",
    tagline: "OSI, TCP/IP, DNS — the language of DevOps",
    description: "Hands-on exploration of networking: trace packets with tcpdump, resolve DNS with dig/nslookup, analyze TCP handshakes, and understand subnetting via exercises.",
    tasks: ["Capture a TCP 3-way handshake with tcpdump", "Trace DNS resolution chain with dig +trace", "Calculate subnets for a /22 CIDR block", "Map OSI layers to real tools (L2: arp, L3: ip, L4: ss)", "Document findings in a network cheat sheet"],
    resume: "Built networking fundamentals lab: captured TCP handshakes, traced DNS resolution, and mastered subnetting with hands-on tooling",
    tools: ["tcpdump", "dig", "nslookup", "ip", "arp"],
    outcome: "Networking cheat sheet + packet captures",
  },
  {
    day: 7, week: 2, phase: 1, skill: "Networking", difficulty: "Beginner",
    title: "Network Discovery Tool",
    tagline: "Map your local network like a pro",
    description: "Python script that scans a CIDR range, discovers live hosts, does reverse DNS lookup, checks common ports, and outputs a network map.",
    tasks: ["Accept CIDR input (e.g. 192.168.1.0/24)", "Ping sweep to find live hosts", "Port scan common ports (22, 80, 443, 3306, 5432)", "Reverse DNS lookup per host", "Output Markdown table of results"],
    resume: "Built network discovery & port scanning tool in Python; performed CIDR-range sweeps with DNS resolution",
    tools: ["python", "socket", "ipaddress", "subprocess"],
    outcome: "Network map Markdown report",
  },
  {
    day: 8, week: 2, phase: 1, skill: "Networking", difficulty: "Intermediate",
    title: "Firewall & iptables Mastery",
    tagline: "Control every packet entering your server",
    description: "Configure iptables rules from scratch: allow SSH, HTTP/S, deny everything else. Implement port forwarding, rate limiting, and logging. Compare with UFW and nftables.",
    tasks: ["Flush rules and set default DROP policy", "Allow SSH, HTTP, HTTPS inbound", "Implement rate limiting for SSH (anti-brute-force)", "Set up port forwarding (e.g., 8080 → 80)", "Persist rules with iptables-save / netfilter-persistent"],
    resume: "Configured iptables firewall with default-deny, rate limiting, port forwarding, and persistent rule management",
    tools: ["iptables", "ufw", "nftables", "ss", "tcpdump"],
    outcome: "Hardened firewall configuration",
  },
  {
    day: 9, week: 2, phase: 1, skill: "Networking", difficulty: "Intermediate",
    title: "Reverse Proxy & Load Balancer",
    tagline: "Route traffic like a production engineer",
    description: "Configure Nginx as a reverse proxy and load balancer. Set up upstream backends, health checks, SSL termination, and sticky sessions.",
    tasks: ["Configure Nginx reverse proxy to a backend app", "Set up upstream block with 3 backends", "Add health checks and weighted load balancing", "Configure SSL termination with self-signed cert", "Test failover by killing a backend"],
    resume: "Configured Nginx reverse proxy with load balancing, health checks, SSL termination, and failover handling",
    tools: ["nginx", "openssl", "curl", "systemd"],
    outcome: "Load-balanced reverse proxy setup",
  },
  {
    day: 10, week: 2, phase: 1, skill: "Networking", difficulty: "Intermediate",
    title: "SSH Tunnels & VPN Basics",
    tagline: "Secure remote access patterns",
    description: "Master SSH tunneling: local/remote/dynamic port forwarding. Set up a WireGuard VPN between two VMs. Understand bastion/jump host patterns.",
    tasks: ["Set up local port forwarding to access remote DB", "Set up remote port forwarding to expose local service", "Configure SSH jump host / ProxyJump", "Install WireGuard and create a peer-to-peer VPN", "Test private network connectivity through the tunnel"],
    resume: "Implemented SSH tunneling patterns and WireGuard VPN; configured bastion host access for secure remote connectivity",
    tools: ["ssh", "wireguard", "wg-quick", "sshd_config"],
    outcome: "Working VPN + SSH tunnel lab",
  },

  // Week 3: Bash, Git & Python for DevOps
  {
    day: 11, week: 3, phase: 1, skill: "Bash", difficulty: "Beginner",
    title: "Log Parser & Alerter",
    tagline: "Turn noisy logs into actionable alerts",
    description: "Parse Nginx/Apache access logs. Count 4xx/5xx errors, find top IPs, flag repeated failures, and send a summary to Slack via webhook.",
    tasks: ["Parse access.log for status codes", "Count and rank error types", "Find top 10 requesting IPs", "Flag IPs with >100 requests/min (potential DDoS)", "Send summary to Slack webhook with curl"],
    resume: "Built log analysis & alerting pipeline in Bash; integrated Slack webhook notifications for 5xx error spikes",
    tools: ["bash", "awk", "sort", "uniq", "curl"],
    outcome: "Slack-notified log alert system",
  },
  {
    day: 12, week: 3, phase: 1, skill: "Bash", difficulty: "Intermediate",
    title: "Automated Backup System",
    tagline: "Production-grade backup with retention policies",
    description: "Backup script for directories/databases. Compress with tar+gzip, encrypt with GPG, upload to S3 or rsync to remote, and enforce 7-day retention.",
    tasks: ["Backup specified directories with tar+gzip", "Encrypt archive with GPG symmetric key", "Upload to S3 with AWS CLI or rsync to remote", "Delete backups older than 7 days", "Log every action with timestamps"],
    resume: "Built automated encrypted backup system with S3 upload and 7-day retention enforcement",
    tools: ["bash", "tar", "gpg", "aws-cli", "rsync", "cron"],
    outcome: "Encrypted, auto-retained backup pipeline",
  },
  {
    day: 13, week: 3, phase: 1, skill: "Git", difficulty: "Beginner",
    title: "Git Workflow Mastery",
    tagline: "Branching, rebasing, conflict resolution",
    description: "Master Git workflows: feature branching, interactive rebase, cherry-pick, stash, bisect for bug hunting. Simulate team collaboration with merge conflicts.",
    tasks: ["Practice Gitflow: feature/release/hotfix branches", "Interactive rebase to squash and reorder commits", "Simulate and resolve a 3-way merge conflict", "Use git bisect to find a bug-introducing commit", "Set up git hooks (pre-commit lint, commit-msg format)"],
    resume: "Mastered Git workflows including interactive rebase, bisect for debugging, and pre-commit hook automation",
    tools: ["git", "git-hooks", "gitflow"],
    outcome: "Git workflow cheat sheet + hooks",
  },
  {
    day: 14, week: 3, phase: 1, skill: "Git", difficulty: "Intermediate",
    title: "GitLab/GitHub Administration",
    tagline: "Branch protection, code review, and webhooks",
    description: "Configure repo-level settings: branch protection rules, required reviews, status checks, webhooks for notifications, and CODEOWNERS for auto-assignment.",
    tasks: ["Set up branch protection for main/develop", "Configure required MR approvals and reviewers", "Add CI status checks as merge requirements", "Set up webhook to notify Slack on MR events", "Create CODEOWNERS file for auto-review assignment"],
    resume: "Configured Git repository governance: branch protection, required reviews, CI status gates, and CODEOWNERS-based auto-assignment",
    tools: ["gitlab", "github", "webhooks", "git"],
    outcome: "Governed repository with review gates",
  },
  {
    day: 15, week: 3, phase: 1, skill: "Python", difficulty: "Beginner",
    title: "Python DevOps Toolkit",
    tagline: "Automate everything with Python",
    description: "Build a CLI toolkit: server health check, JSON/YAML config parser, API caller for cloud resources, and file watcher for auto-deployment triggers.",
    tasks: ["Use psutil for CPU/RAM/Disk monitoring", "Parse YAML configs with PyYAML", "Make authenticated API calls with requests", "Use watchdog to monitor file changes", "Bundle as a CLI with click or argparse"],
    resume: "Built Python DevOps CLI toolkit: health monitoring, config parsing, API integration, and file-watch auto-triggers",
    tools: ["python", "psutil", "pyyaml", "requests", "click"],
    outcome: "Multi-function DevOps CLI tool",
  },
  {
    day: 16, week: 3, phase: 1, skill: "Python", difficulty: "Intermediate",
    title: "Infrastructure API Client",
    tagline: "Talk to cloud APIs programmatically",
    description: "Python script using Azure SDK and Boto3 (AWS) to list VMs, check their status, start/stop them, and generate an infrastructure inventory report.",
    tasks: ["Authenticate with Azure SDK (DefaultAzureCredential)", "List all VMs with status across resource groups", "Start/stop VMs via CLI arguments", "Do the same with Boto3 for AWS EC2", "Generate a combined inventory CSV"],
    resume: "Built multi-cloud infrastructure client using Azure SDK and Boto3; automated VM lifecycle management and inventory reporting",
    tools: ["python", "azure-sdk", "boto3", "click"],
    outcome: "Multi-cloud VM management CLI",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2 — CONTAINERIZATION (Weeks 4–5)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 17, week: 4, phase: 2, skill: "Docker", difficulty: "Beginner",
    title: "Docker Fundamentals Sprint",
    tagline: "Images, containers, volumes, networks",
    description: "Hands-on with Docker basics: pull images, run containers, expose ports, mount volumes, inspect logs, exec into containers, and understand image layers.",
    tasks: ["Run nginx and access it on localhost:8080", "Mount a volume and prove data persists across restarts", "Use docker exec to debug inside a running container", "Inspect image layers with docker history", "Clean up: dangling images, stopped containers, unused volumes"],
    resume: "Mastered Docker fundamentals: container lifecycle, volume management, networking, and image layer analysis",
    tools: ["docker", "docker-cli"],
    outcome: "Docker fundamentals lab notes",
  },
  {
    day: 18, week: 4, phase: 2, skill: "Docker", difficulty: "Beginner",
    title: "Multi-Stage Docker Build",
    tagline: "Ship lean, production-optimized images",
    description: "Take a Python FastAPI app. Build a multi-stage Dockerfile: build stage installs deps, production stage copies only the app. Compare image sizes.",
    tasks: ["Write Dockerfile with builder and production stages", "Use slim/alpine base for prod", "Copy only necessary artifacts between stages", "Use .dockerignore to exclude dev files", "Compare image sizes before and after"],
    resume: "Optimized Docker images using multi-stage builds; reduced image size by 60%+ on FastAPI service",
    tools: ["docker", "dockerfile", "fastapi", "alpine"],
    outcome: "Lean production Docker image",
  },
  {
    day: 19, week: 4, phase: 2, skill: "Docker", difficulty: "Intermediate",
    title: "Docker Compose Full Stack",
    tagline: "Spin up a complete app stack locally",
    description: "Docker Compose file for React frontend, FastAPI backend, PostgreSQL DB, and Redis cache. With volumes, networks, health checks, and env vars.",
    tasks: ["Define 4 services in docker-compose.yml", "Use named volumes for PostgreSQL data", "Create custom bridge network", "Add healthcheck for DB and backend", "Use .env file for secrets"],
    resume: "Designed multi-service Docker Compose stack (React, FastAPI, PostgreSQL, Redis) with health checks and isolated networking",
    tools: ["docker-compose", "postgres", "redis", "fastapi"],
    outcome: "One-command full stack local env",
  },
  {
    day: 20, week: 4, phase: 2, skill: "Docker", difficulty: "Intermediate",
    title: "Private Registry & Image Scanning",
    tagline: "Run your own registry, scan for CVEs",
    description: "Deploy a private Docker registry with TLS and basic auth. Push/pull images. Scan with Trivy for vulnerabilities.",
    tasks: ["Deploy registry:2 container with TLS certs", "Configure basic auth with htpasswd", "Push a custom image to private registry", "Pull and verify on another container", "Scan image with Trivy for CVEs"],
    resume: "Deployed private Docker registry with TLS, basic auth, and Trivy vulnerability scanning",
    tools: ["docker", "registry:2", "openssl", "trivy"],
    outcome: "Secure private registry + scan report",
  },
  {
    day: 21, week: 4, phase: 2, skill: "Networking", difficulty: "Intermediate",
    title: "Docker Network Deep Dive",
    tagline: "Master bridge, host, overlay, and macvlan",
    description: "Explore all Docker network modes. Set up containers in each mode, test connectivity, inspect with tcpdump, understand DNS resolution.",
    tasks: ["Create bridge, host, none, and macvlan networks", "Test inter-container DNS resolution", "Capture traffic with tcpdump inside containers", "Demonstrate overlay network concepts", "Document findings with diagrams"],
    resume: "Designed and validated Docker networking across bridge, host, overlay, and macvlan modes",
    tools: ["docker", "tcpdump", "wireshark"],
    outcome: "Networking lab write-up + diagrams",
  },

  // Week 5: Advanced Docker
  {
    day: 22, week: 5, phase: 2, skill: "Python", difficulty: "Intermediate",
    title: "Docker API Controller",
    tagline: "Manage containers programmatically",
    description: "Python script using the Docker SDK to: list containers, start/stop them, stream logs, inspect resource usage, and auto-restart unhealthy containers.",
    tasks: ["Connect to Docker daemon via SDK", "List all running containers with stats", "Stream logs from a specified container", "Detect unhealthy containers and restart them", "Build a simple CLI interface with argparse"],
    resume: "Built Docker management CLI using Python Docker SDK; automated health-check-based container restarts",
    tools: ["python", "docker-sdk", "argparse"],
    outcome: "Container management CLI tool",
  },
  {
    day: 23, week: 5, phase: 2, skill: "Docker", difficulty: "Intermediate",
    title: "Container Resource Governance",
    tagline: "Enforce CPU/memory limits and monitor them",
    description: "Run containers with CPU and memory limits. Build a Python monitor that alerts when containers approach their limits.",
    tasks: ["Run containers with --memory and --cpus flags", "Use docker stats API to stream metrics", "Set threshold alerts (>80% memory = warn)", "Log metrics to CSV time series", "Visualize with a simple chart"],
    resume: "Implemented container resource governance with CPU/memory limits; built monitoring agent with threshold alerting",
    tools: ["docker", "python", "docker-sdk"],
    outcome: "Resource metrics dashboard + alerts",
  },
  {
    day: 24, week: 5, phase: 2, skill: "Docker", difficulty: "Advanced",
    title: "Dockerized CI Runner",
    tagline: "Self-hosted GitLab runner in Docker",
    description: "Deploy a self-hosted CI runner inside Docker. Configure Docker-in-Docker (DinD). Run a sample build and push pipeline.",
    tasks: ["Deploy GitLab Runner in Docker", "Configure DinD for building images in CI", "Register runner with your GitLab", "Write a pipeline that builds and pushes an image", "Add caching for pip/node_modules"],
    resume: "Configured self-hosted GitLab Runner with Docker-in-Docker; built and pushed images through automated CI pipeline",
    tools: ["docker", "gitlab-runner", "dind", "gitlab-ci"],
    outcome: "Working CI runner with image pipeline",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3 — ORCHESTRATION (Weeks 6–8)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 25, week: 6, phase: 3, skill: "Kubernetes", difficulty: "Beginner",
    title: "K8s Fundamentals on k3s",
    tagline: "Pods, Deployments, Services — the basics",
    description: "Deploy a FastAPI app to k3s. Write Deployment, Service, and Ingress manifests. Scale manually and observe pod scheduling with k9s.",
    tasks: ["Write Deployment manifest with 3 replicas", "Create ClusterIP Service", "Configure Ingress with nginx ingress controller", "Scale to 5 replicas with kubectl scale", "Trigger a rolling update with a new image tag"],
    resume: "Deployed FastAPI microservice on Kubernetes (k3s) with Ingress routing; performed rolling updates and manual scaling",
    tools: ["kubernetes", "k3s", "kubectl", "k9s", "nginx-ingress"],
    outcome: "Live service accessible via Ingress",
  },
  {
    day: 26, week: 6, phase: 3, skill: "Kubernetes", difficulty: "Beginner",
    title: "ConfigMaps & Secrets",
    tagline: "Separate config from code",
    description: "Use ConfigMaps for app config and Secrets for DB passwords. Mount as env vars and files. Rotate a secret without downtime.",
    tasks: ["Create ConfigMap with app settings", "Create Secret for DB credentials", "Mount both as env vars in a Deployment", "Mount Secret as a file volume", "Update secret and verify app picks it up"],
    resume: "Implemented Kubernetes ConfigMap and Secret management; demonstrated zero-downtime secret rotation",
    tools: ["kubernetes", "kubectl", "base64", "k9s"],
    outcome: "Config-externalized deployment",
  },
  {
    day: 27, week: 7, phase: 3, skill: "Kubernetes", difficulty: "Intermediate",
    title: "HPA — Horizontal Pod Autoscaler",
    tagline: "Auto-scale under load like production",
    description: "Configure HPA based on CPU. Use a load generator to stress the service. Watch pods scale up and down automatically.",
    tasks: ["Install metrics-server on k3s", "Set CPU request/limits on Deployment", "Configure HPA min=2 max=10 CPU 50%", "Run k6 load test to spike CPU", "Observe and document scale-up/scale-down"],
    resume: "Configured Horizontal Pod Autoscaler on k3s; validated auto-scaling behavior under synthetic load using k6",
    tools: ["kubernetes", "hpa", "metrics-server", "k6", "k9s"],
    outcome: "Auto-scaling service under load test",
  },
  {
    day: 28, week: 7, phase: 3, skill: "Kubernetes", difficulty: "Intermediate",
    title: "Persistent Storage with PVCs",
    tagline: "Stateful apps need durable storage",
    description: "Deploy PostgreSQL on Kubernetes with a PersistentVolumeClaim. Simulate pod restart and verify data persists. Backup via CronJob.",
    tasks: ["Create StorageClass and PersistentVolumeClaim", "Deploy PostgreSQL with PVC mounted", "Insert test data, delete pod, verify data survives", "Create a CronJob to pg_dump to a volume", "Test restore from backup"],
    resume: "Deployed stateful PostgreSQL on Kubernetes with PVC; implemented automated CronJob backup",
    tools: ["kubernetes", "pvc", "postgresql", "cronjob"],
    outcome: "Persistent DB with automated backups",
  },
  {
    day: 29, week: 7, phase: 3, skill: "Kubernetes", difficulty: "Intermediate",
    title: "RBAC — Role-Based Access Control",
    tagline: "Least-privilege access in Kubernetes",
    description: "Create service accounts for different teams. Write Roles, bind them, and test access boundaries.",
    tasks: ["Create 3 ServiceAccounts (dev/ops/monitoring)", "Write Roles with specific verbs/resources", "Bind via RoleBindings", "Test access with kubectl --as=system:serviceaccount", "Export kubeconfig per service account"],
    resume: "Implemented Kubernetes RBAC with least-privilege roles for dev, ops, and monitoring teams",
    tools: ["kubernetes", "rbac", "serviceaccount", "kubectl"],
    outcome: "RBAC policy set with 3 access tiers",
  },
  {
    day: 30, week: 8, phase: 3, skill: "Kubernetes", difficulty: "Advanced",
    title: "Helm Chart — Package Your App",
    tagline: "Templatize and version your deployments",
    description: "Convert manifests into a Helm chart. Parameterize image tag, replicas, ingress host. Deploy with helm install.",
    tasks: ["Run helm create to scaffold chart", "Templatize Deployment with values.yaml", "Add ingress toggle and host parameterization", "Lint and package the chart", "Deploy with helm install and upgrade"],
    resume: "Packaged Kubernetes application as a Helm chart; parameterized environment-specific values",
    tools: ["helm", "kubernetes", "yaml", "kubectl"],
    outcome: "Installable Helm chart package",
  },
  {
    day: 31, week: 8, phase: 3, skill: "Kubernetes", difficulty: "Advanced",
    title: "KEDA — Event-Driven Autoscaling",
    tagline: "Scale on queues, cron, and custom metrics",
    description: "Install KEDA on k3s. Configure ScaledObject for a queue processor that scales based on queue length. Set up ScaledJob for batch work.",
    tasks: ["Install KEDA via Helm", "Deploy a Redis-based queue processor", "Create ScaledObject targeting Redis list length", "Set up ScaledJob for batch processing", "Test zero-to-N scaling and cooldown behavior"],
    resume: "Implemented event-driven autoscaling with KEDA; configured ScaledObjects and ScaledJobs for queue-based workloads",
    tools: ["keda", "kubernetes", "redis", "helm", "k9s"],
    outcome: "Event-driven auto-scaling system",
  },
  {
    day: 32, week: 8, phase: 3, skill: "Kubernetes", difficulty: "Advanced",
    title: "ArgoCD GitOps Deployment",
    tagline: "Let Git be your single source of truth",
    description: "Install ArgoCD on k3s. Connect your Helm chart repo. Configure auto-sync on git push. Simulate drift and watch auto-heal.",
    tasks: ["Install ArgoCD on k3s", "Connect Git repo with Helm chart", "Create ArgoCD Application manifest", "Push a change and watch auto-sync", "Manually mutate a resource and observe drift heal"],
    resume: "Implemented GitOps workflow with ArgoCD; automated Kubernetes deployments with drift detection",
    tools: ["argocd", "helm", "kubernetes", "git", "k3s"],
    outcome: "GitOps-driven live deployment pipeline",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4 — INFRASTRUCTURE AS CODE (Weeks 9–11)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 33, week: 9, phase: 4, skill: "Terraform", difficulty: "Beginner",
    title: "Provision a VM on Azure",
    tagline: "Infrastructure as Code from scratch",
    description: "Write Terraform to provision a Linux VM on Azure. Include VNet, subnet, NSG, public IP, and SSH key injection.",
    tasks: ["Write main.tf with provider config", "Define resource group, VNet, subnet, NSG", "Provision VM with SSH public key", "Output public IP after apply", "Use variables.tf and terraform.tfvars"],
    resume: "Provisioned Azure Linux VM with Terraform including networking and SSH key injection",
    tools: ["terraform", "azure", "hcl", "ssh"],
    outcome: "SSH-accessible VM via Terraform",
  },
  {
    day: 34, week: 9, phase: 4, skill: "Terraform", difficulty: "Beginner",
    title: "Remote State & Locking",
    tagline: "Collaborate safely on Terraform state",
    description: "Move Terraform state from local to Azure Blob Storage. Enable state locking. Simulate team collaboration.",
    tasks: ["Create Storage Account for state", "Configure backend.tf for remote state", "Enable state locking", "Run plan from two terminals to test lock", "Encrypt state at rest"],
    resume: "Configured Terraform remote state backend on Azure Blob Storage with state locking",
    tools: ["terraform", "azure-storage", "backend"],
    outcome: "Remote-state Terraform project",
  },
  {
    day: 35, week: 9, phase: 4, skill: "Cloud", difficulty: "Beginner",
    title: "Cloud Services Overview Lab",
    tagline: "Azure + AWS side by side",
    description: "Hands-on comparison: provision equivalent resources on Azure and AWS. Map services (Azure VM ↔ EC2, Blob ↔ S3, AKS ↔ EKS). Understand pricing models.",
    tasks: ["Provision a VM on both Azure and AWS", "Create object storage (Blob + S3)", "Compare IAM models: Azure RBAC vs AWS IAM", "Map 10 common services between the two clouds", "Document a cloud comparison cheat sheet"],
    resume: "Completed hands-on multi-cloud comparison lab; mapped Azure and AWS services and IAM models",
    tools: ["azure-cli", "aws-cli", "terraform"],
    outcome: "Multi-cloud comparison cheat sheet",
  },
  {
    day: 36, week: 10, phase: 4, skill: "Terraform", difficulty: "Intermediate",
    title: "Terraform Modules — Reusable Infra",
    tagline: "DRY infrastructure with modules",
    description: "Create a reusable Terraform module for networking. Call it from root with different env configs.",
    tasks: ["Write a network/ module with variables and outputs", "Call module from root with dev and prod vars", "Add module versioning with source tags", "Test with terraform plan for both envs", "Document module inputs/outputs in README"],
    resume: "Built reusable Terraform modules for networking; reduced code duplication across environments by 70%",
    tools: ["terraform", "modules", "hcl", "azure"],
    outcome: "Reusable network module library",
  },
  {
    day: 37, week: 10, phase: 4, skill: "Terraform", difficulty: "Intermediate",
    title: "Provision AKS / GKE Cluster",
    tagline: "Managed Kubernetes via Terraform",
    description: "Use Terraform to provision an AKS or GKE cluster with node pools, autoscaling, RBAC, and monitoring enabled.",
    tasks: ["Write Terraform for AKS/GKE resource", "Configure system and user node pools", "Enable cluster autoscaler", "Configure RBAC and AD integration", "Output kubeconfig to connect with kubectl"],
    resume: "Provisioned production-grade AKS cluster with Terraform; configured autoscaling and RBAC",
    tools: ["terraform", "aks", "kubectl", "azure"],
    outcome: "Managed Kubernetes cluster on cloud",
  },
  {
    day: 38, week: 10, phase: 4, skill: "Terraform", difficulty: "Advanced",
    title: "Terraform Workspaces — Multi-Env",
    tagline: "Dev/staging/prod from one codebase",
    description: "Use Terraform workspaces for multiple environments. Different VM sizes and replica counts per workspace.",
    tasks: ["Create and switch between workspaces", "Use terraform.workspace in conditionals", "Different sizing per environment", "Share remote state per workspace", "Run workspace-specific plans in CI"],
    resume: "Implemented multi-environment Terraform with workspaces for dev/staging/prod",
    tools: ["terraform", "workspaces", "hcl", "azure"],
    outcome: "3-environment IaC from one codebase",
  },

  // Week 11: Ansible
  {
    day: 39, week: 11, phase: 4, skill: "Ansible", difficulty: "Beginner",
    title: "Server Provisioning Playbook",
    tagline: "Automate new server setup end-to-end",
    description: "Ansible playbook to configure a fresh Ubuntu server: install packages, create users, configure SSH, set up firewall, install Docker.",
    tasks: ["Create inventory with host groups", "Write playbook with roles: base, users, docker", "Use ansible-vault for secrets", "Test with --check dry run mode", "Tag tasks for selective execution"],
    resume: "Built Ansible playbook for automated server provisioning via idempotent roles",
    tools: ["ansible", "ansible-vault", "ubuntu", "yaml"],
    outcome: "Fully-configured server in one command",
  },
  {
    day: 40, week: 11, phase: 4, skill: "Ansible", difficulty: "Intermediate",
    title: "Ansible Roles — Nginx + TLS",
    tagline: "Production web server with Let's Encrypt",
    description: "Create an Ansible role to install Nginx, configure virtual hosts, and provision TLS certificates via Certbot.",
    tasks: ["Create ansible-galaxy style role structure", "Install and configure Nginx with templates", "Run Certbot for Let's Encrypt", "Configure auto-renewal cron", "Test idempotency by running twice"],
    resume: "Developed Ansible role for Nginx with automated TLS provisioning via Let's Encrypt",
    tools: ["ansible", "nginx", "certbot", "jinja2"],
    outcome: "HTTPS-enabled web server role",
  },
  {
    day: 41, week: 11, phase: 4, skill: "Ansible", difficulty: "Intermediate",
    title: "Ansible + Terraform Integration",
    tagline: "Provision infra then configure it",
    description: "Terraform provisions VMs, outputs IPs to build Ansible dynamic inventory. Ansible configures freshly provisioned servers.",
    tasks: ["Terraform outputs IP addresses as JSON", "Script builds Ansible inventory from output", "Run Ansible against dynamic inventory", "Test full workflow: apply → playbook", "Wrap in a Makefile for one-command deploy"],
    resume: "Integrated Terraform and Ansible for end-to-end IaC: provision → configure pipeline",
    tools: ["terraform", "ansible", "python", "makefile"],
    outcome: "Full provision-and-configure pipeline",
  },
  {
    day: 42, week: 11, phase: 4, skill: "Ansible", difficulty: "Advanced",
    title: "Ansible for K8s Node Setup",
    tagline: "Automate k8s node joining",
    description: "Ansible playbooks to install kubeadm, kubelet, kubectl on nodes, initialize control plane, and join workers automatically.",
    tasks: ["Install containerd via role", "Install kubeadm/kubelet/kubectl", "Initialize control plane with kubeadm", "Capture join token and distribute", "Verify cluster with kubectl get nodes"],
    resume: "Automated Kubernetes cluster bootstrapping with Ansible; provisioned control plane and worker nodes via kubeadm",
    tools: ["ansible", "kubeadm", "kubernetes", "containerd"],
    outcome: "Ansible-bootstrapped K8s cluster",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 5 — CI/CD & GITOPS (Weeks 12–14)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 43, week: 12, phase: 5, skill: "CI/CD", difficulty: "Beginner",
    title: "GitLab CI — Lint, Test, Build",
    tagline: "Your first complete CI pipeline",
    description: "Write a .gitlab-ci.yml with stages: lint → test → build. Lint Python, test with pytest, build Docker image. Run on self-hosted runner.",
    tasks: ["Define lint stage with flake8", "Define test stage with pytest + coverage", "Define build stage with docker build", "Add artifacts for coverage report", "Trigger on MR and main branch"],
    resume: "Built GitLab CI pipeline with lint/test/build stages on self-hosted runner",
    tools: ["gitlab-ci", "python", "flake8", "pytest", "docker"],
    outcome: "3-stage pipeline on GitLab",
  },
  {
    day: 44, week: 12, phase: 5, skill: "CI/CD", difficulty: "Intermediate",
    title: "CI/CD — Push to Registry & Deploy",
    tagline: "Full pipeline: code to running container",
    description: "Extend the pipeline: push image to registry, SSH deploy to server, add manual approval gate before prod.",
    tasks: ["Add registry push with docker login", "Use CI variables for credentials", "Add deploy stage with SSH remote command", "Use GitLab environments for staging/prod", "Add manual approval gate before prod deploy"],
    resume: "Extended CI/CD pipeline to automated registry push and SSH deployment with environment-gated approval",
    tools: ["gitlab-ci", "docker-hub", "ssh", "gitlab-environments"],
    outcome: "Code-to-deploy automated pipeline",
  },
  {
    day: 45, week: 12, phase: 5, skill: "CI/CD", difficulty: "Intermediate",
    title: "Pipeline for Kubernetes Deploy",
    tagline: "CI/CD that deploys to k3s",
    description: "CI pipeline that builds image, pushes to registry, then uses helm upgrade to deploy to k3s. kubeconfig as CI secret.",
    tasks: ["Store kubeconfig as masked CI variable", "Add k8s deploy stage with kubectl/helm", "Implement rollback on failure", "Notify Slack on success/failure", "Add smoke test post-deploy"],
    resume: "Implemented CI/CD pipeline with Kubernetes deployment via Helm with rollback and Slack notifications",
    tools: ["gitlab-ci", "helm", "kubectl", "kubernetes"],
    outcome: "Pipeline deploying to k3s",
  },
  {
    day: 46, week: 13, phase: 5, skill: "CI/CD", difficulty: "Intermediate",
    title: "Semantic Versioning & Release Automation",
    tagline: "Automate your release process",
    description: "Use conventional commits + semantic-release. Auto-generate CHANGELOG, tag the repo, and create releases.",
    tasks: ["Enforce conventional commit format", "Script version bump based on commit type", "Auto-generate CHANGELOG.md", "Create git tag and release via API", "Trigger release pipeline on tag push"],
    resume: "Automated semantic versioning and release pipeline from conventional commits",
    tools: ["semantic-release", "commitlint", "gitlab-api", "bash"],
    outcome: "Automated versioned release pipeline",
  },
  {
    day: 47, week: 13, phase: 5, skill: "CI/CD", difficulty: "Advanced",
    title: "Pipeline Security: SAST & Image Scan",
    tagline: "Shift security left into CI",
    description: "Add security gates: SAST with Bandit, SCA with Safety, image scan with Trivy. Fail pipeline on CRITICAL CVEs.",
    tasks: ["Add Bandit SAST scan stage", "Add Safety dependency vulnerability check", "Add Trivy image scan with severity threshold", "Parse output and fail on CRITICAL", "Upload scan reports as CI artifacts"],
    resume: "Integrated security scanning into CI/CD (Bandit SAST, Safety SCA, Trivy); enforced pipeline failure on critical CVEs",
    tools: ["bandit", "safety", "trivy", "gitlab-ci"],
    outcome: "Security-gated CI pipeline",
  },
  {
    day: 48, week: 13, phase: 5, skill: "CI/CD", difficulty: "Advanced",
    title: "Matrix Build & Self-Healing Pipelines",
    tagline: "Multi-version testing + resilient CI",
    description: "Configure matrix builds across Python versions. Add retry logic, timeouts, auto-cancellation, and comprehensive alerting.",
    tasks: ["Use parallel:matrix for 4 Python versions", "Collect and merge junit XML reports", "Add retry:2 for flaky stages", "Set timeouts and auto-cancel redundant pipelines", "Add on_failure Slack notification with job URL"],
    resume: "Implemented parallel matrix CI builds across Python 3.9–3.12 with retry logic and Slack failure alerting",
    tools: ["gitlab-ci", "python", "pytest", "slack-webhook"],
    outcome: "Resilient multi-version CI matrix",
  },
  {
    day: 49, week: 14, phase: 5, skill: "Terraform", difficulty: "Intermediate",
    title: "Terraform + GitLab CI Pipeline",
    tagline: "Automate infra changes through CI",
    description: "Run terraform plan in CI on MR, post plan as MR comment. Auto-apply on merge to main. Drift detection via scheduled pipeline.",
    tasks: ["Configure terraform in GitLab CI", "Run plan on MR and capture output", "Post plan diff as MR comment via API", "Auto-apply on main merge", "Add drift detection with scheduled pipeline"],
    resume: "Automated infrastructure provisioning via Terraform CI/CD pipeline with plan-on-MR and auto-apply",
    tools: ["terraform", "gitlab-ci", "gitlab-api", "azure"],
    outcome: "IaC pipeline with MR plan comments",
  },
  {
    day: 50, week: 14, phase: 5, skill: "Terraform", difficulty: "Advanced",
    title: "Terratest — Test Your Infrastructure",
    tagline: "Automated testing for Terraform modules",
    description: "Write Go-based Terratest tests for your Terraform modules. Provision real infra, validate, then destroy.",
    tasks: ["Write Terratest test for network module", "Assert subnet CIDRs and NSG rules", "Test VM module: assert SSH port accessible", "Run tests in CI with Go", "Report test results"],
    resume: "Implemented infrastructure testing with Terratest; automated provisioning validation in CI pipeline",
    tools: ["terratest", "go", "terraform", "azure"],
    outcome: "Automated infra test suite",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 6 — OBSERVABILITY & RELIABILITY (Weeks 15–16)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 51, week: 15, phase: 6, skill: "Monitoring", difficulty: "Intermediate",
    title: "Prometheus + Grafana Stack",
    tagline: "Full observability from scratch",
    description: "Deploy Prometheus and Grafana via Docker Compose. Scrape node_exporter, cAdvisor, and FastAPI custom metrics. Build golden-signal dashboards.",
    tasks: ["Deploy prometheus, grafana, node_exporter, cadvisor", "Configure prometheus.yml scrape targets", "Instrument FastAPI with prometheus metrics", "Build Grafana dashboard for golden signals", "Set up alerting rules in Prometheus"],
    resume: "Built full observability stack (Prometheus + Grafana); instrumented FastAPI with custom metrics and dashboards",
    tools: ["prometheus", "grafana", "cadvisor", "node_exporter"],
    outcome: "Live metrics dashboard + alerting",
  },
  {
    day: 52, week: 15, phase: 6, skill: "Monitoring", difficulty: "Intermediate",
    title: "ELK Stack — Centralized Logging",
    tagline: "Aggregate and search all your logs",
    description: "Deploy Elasticsearch, Logstash, Kibana. Ship logs from Nginx and FastAPI via Filebeat. Create Kibana dashboards.",
    tasks: ["Deploy ELK stack with Docker Compose", "Configure Filebeat to tail Nginx logs", "Write Logstash pipeline to parse/enrich", "Create Kibana index pattern", "Build dashboard: error rates, top endpoints"],
    resume: "Deployed ELK centralized logging stack; shipped Nginx + app logs via Filebeat/Logstash with Kibana visualization",
    tools: ["elasticsearch", "logstash", "kibana", "filebeat"],
    outcome: "Searchable centralized log dashboard",
  },
  {
    day: 53, week: 16, phase: 6, skill: "Monitoring", difficulty: "Advanced",
    title: "Alertmanager & Incident Routing",
    tagline: "Production-grade alert routing and silencing",
    description: "Configure Alertmanager with routes, receivers (Slack, email), inhibition rules, and grouping. Simulate incidents.",
    tasks: ["Write alertmanager.yml with routes/receivers", "Configure Slack and email receivers", "Add inhibition rules", "Group alerts by service and severity", "Test with amtool and fired alerts"],
    resume: "Configured Alertmanager with multi-receiver routing, inhibition rules, and alert grouping",
    tools: ["alertmanager", "prometheus", "slack", "amtool"],
    outcome: "Multi-channel alert routing system",
  },
  {
    day: 54, week: 16, phase: 6, skill: "Python", difficulty: "Advanced",
    title: "Incident Response Bot",
    tagline: "Auto-remediate common production incidents",
    description: "Python bot that watches Alertmanager webhooks, maps alerts to runbooks, and auto-remediates: restart pod, scale up, clear disk.",
    tasks: ["Build Flask webhook receiver for Alertmanager", "Map alert names to remediation functions", "Implement: restart-pod, scale-deployment, clear-tmp", "Log all actions with before/after state", "Add dry-run mode and Slack approval workflow"],
    resume: "Built incident response automation bot; consumed Alertmanager webhooks and auto-remediated Kubernetes incidents",
    tools: ["python", "flask", "kubernetes-sdk", "alertmanager", "slack"],
    outcome: "Self-healing incident response bot",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 7 — SECURITY & GOVERNANCE (Weeks 17–18)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 55, week: 17, phase: 7, skill: "Security", difficulty: "Intermediate",
    title: "Secrets Management with Vault",
    tagline: "Never hardcode a secret again",
    description: "Deploy HashiCorp Vault. Store DB credentials. Python app fetches secrets at runtime. Integrate with Kubernetes auth.",
    tasks: ["Run Vault in dev mode via Docker", "Store secrets in KV v2 engine", "Write Python app using hvac to fetch secrets", "Configure Kubernetes auth method", "Inject secrets into pods via Vault Agent"],
    resume: "Integrated HashiCorp Vault for secrets management with Kubernetes auth and runtime injection",
    tools: ["vault", "python", "hvac", "kubernetes"],
    outcome: "Runtime secret injection in K8s",
  },
  {
    day: 56, week: 17, phase: 7, skill: "Security", difficulty: "Intermediate",
    title: "Network Policy — Zero Trust K8s",
    tagline: "Micro-segmentation inside your cluster",
    description: "Implement NetworkPolicies: default deny all, then allow only required paths (frontend → backend → DB). Test isolation.",
    tasks: ["Apply default-deny-all NetworkPolicy", "Allow frontend → backend on port 8000", "Allow backend → postgres on port 5432", "Block all other traffic", "Verify with kubectl exec and curl"],
    resume: "Implemented Kubernetes zero-trust network segmentation with NetworkPolicies",
    tools: ["kubernetes", "networkpolicy", "calico", "kubectl"],
    outcome: "Zero-trust networked application",
  },
  {
    day: 57, week: 18, phase: 7, skill: "Security", difficulty: "Advanced",
    title: "OPA Gatekeeper — Policy as Code",
    tagline: "Enforce governance across your cluster",
    description: "Install OPA Gatekeeper. Write policies: resource limits required, no latest tag, required labels, no privileged containers.",
    tasks: ["Install Gatekeeper on k3s", "Write ConstraintTemplate for resource limits", "Write template for no-latest-tag", "Write policy for required labels", "Test with compliant and non-compliant pods"],
    resume: "Implemented OPA Gatekeeper policy-as-code; enforced resource limits and image tag governance",
    tools: ["gatekeeper", "opa", "rego", "kubernetes"],
    outcome: "Policy-governed K8s cluster",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 8 — CAPSTONE & INTERVIEW PREP (Weeks 19–20)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    day: 58, week: 19, phase: 8, skill: "CI/CD", difficulty: "Advanced",
    title: "Full GitOps Platform",
    tagline: "Tie everything together: the capstone",
    description: "End-to-end: code push → CI tests → Docker build → push → ArgoCD auto-deploys → Prometheus alerts → Slack. Everything automated.",
    tasks: ["Wire GitLab CI to build and push on merge", "ArgoCD watches Helm chart and auto-syncs", "Prometheus monitors the deployed service", "Alertmanager routes to Slack", "Document the full architecture in a README"],
    resume: "Architected end-to-end GitOps platform: GitLab CI → Docker registry → ArgoCD → Prometheus/Alertmanager observability",
    tools: ["gitlab-ci", "argocd", "helm", "prometheus", "k3s"],
    outcome: "Production-grade GitOps platform",
  },
  {
    day: 59, week: 19, phase: 8, skill: "Terraform", difficulty: "Advanced",
    title: "Multi-Cloud Networking Lab",
    tagline: "Connect Azure and GCP with VPN tunnel",
    description: "Terraform provisions VPCs in Azure and GCP. Create site-to-site VPN tunnel. Route traffic privately across clouds.",
    tasks: ["Provision Azure VNet and VPN Gateway", "Provision GCP VPC and Cloud VPN", "Configure IPsec tunnel between them", "Test private connectivity across clouds", "Document BGP route exchange"],
    resume: "Engineered multi-cloud networking with Azure-GCP site-to-site VPN using Terraform",
    tools: ["terraform", "azure", "gcp", "vpn", "bgp"],
    outcome: "Working multi-cloud VPN tunnel",
  },
  {
    day: 60, week: 20, phase: 8, skill: "Cloud", difficulty: "Advanced",
    title: "Interview-Ready Portfolio & Prep",
    tagline: "Package everything for your job switch",
    description: "Create a portfolio GitHub/GitLab showcasing your best 5 projects. Write a killer README for each. Practice common DevOps interview questions and system design scenarios.",
    tasks: ["Select top 5 projects and clean up their code", "Write detailed READMEs with architecture diagrams", "Create a portfolio repo that links them all", "Practice 20 DevOps interview questions aloud", "Do a mock system design: 'Design a CI/CD platform'"],
    resume: "Curated a portfolio of production-grade DevOps projects spanning CI/CD, Kubernetes, Terraform, and observability",
    tools: ["git", "markdown", "mermaid", "github-pages"],
    outcome: "Interview-ready DevOps portfolio",
  },
];

// ─── UI CONSTANTS ───────────────────────────────────────────────────────────

const diffBadge = {
  Beginner: { bg: "rgba(74,222,128,0.12)", color: "#4ade80", label: "BEGINNER" },
  Intermediate: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24", label: "INTERMEDIATE" },
  Advanced: { bg: "rgba(248,113,113,0.12)", color: "#f87171", label: "ADVANCED" },
};

// ─── STORAGE ────────────────────────────────────────────────────────────────
// Nginx proxies /api/* to the Python backend — no absolute URL needed.

async function loadProgress(token) {
  try {
    const response = await fetch("/api/progress", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 401) return new Set();
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return new Set(data);
  } catch (err) {
    console.error("Load failed:", err);
    return new Set();
  }
}

async function saveProgress(day, completed, token) {
  try {
    await fetch(`/api/progress/${day}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed }),
    });
  } catch (e) {
    console.error("Save failed:", e);
  }
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function PhaseHeader({ phase, projects: phaseProjects, completedDays }) {
  const done = phaseProjects.filter(p => completedDays.has(p.day)).length;
  const pct = phaseProjects.length > 0 ? Math.round((done / phaseProjects.length) * 100) : 0;
  return (
    <div className="phase-header" style={{
      borderBottom: `1px solid ${phase.color}22`,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: `${phase.color}15`, border: `1px solid ${phase.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 800, color: phase.color,
        fontFamily: "'Outfit', sans-serif",
      }}>{phase.id}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Outfit', sans-serif" }}>
            {phase.name}
          </span>
          <span style={{ fontSize: 11, color: "#475569" }}>Weeks {phase.weeks}</span>
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{phase.subtitle}</div>
      </div>
      <div className="phase-progress">
        <div style={{ fontSize: 11, color: "#64748b" }}>{done}/{phaseProjects.length}</div>
        <div className="phase-progress-bar">
          <div style={{
            height: "100%", borderRadius: 2, background: phase.color,
            width: `${pct}%`, transition: "width 0.4s ease",
          }} />
        </div>
      </div>
    </div>
  );
}

function Card({ p, completed, onToggle, onClick }) {
  const sc = skillColors[p.skill] || "#818cf8";
  const d = diffBadge[p.difficulty];
  return (
    <div onClick={onClick} style={{
      background: completed ? "rgba(74,222,128,0.03)" : "#0c0c14",
      border: `1px solid ${completed ? "rgba(74,222,128,0.18)" : "#1a1a2e"}`,
      borderRadius: 12, padding: 16, cursor: "pointer",
      transition: "all 0.2s ease", position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = sc + "60"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = completed ? "rgba(74,222,128,0.18)" : "#1a1a2e"; e.currentTarget.style.transform = "none"; }}
    >
      {completed && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, #4ade80, ${sc})` }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: sc, background: sc + "18", padding: "2px 8px", borderRadius: 4, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace" }}>
            {p.skill.toUpperCase()}
          </span>
          <span style={{ fontSize: 9, fontWeight: 600, color: d.color, background: d.bg, padding: "2px 8px", borderRadius: 4, letterSpacing: "0.06em", fontFamily: "'JetBrains Mono', monospace" }}>
            {d.label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "#3d3d5c", fontFamily: "'JetBrains Mono', monospace" }}>D{p.day}</span>
          <button onClick={e => { e.stopPropagation(); onToggle(p.day); }} style={{
            width: 22, height: 22, borderRadius: "50%", cursor: "pointer",
            border: `2px solid ${completed ? "#4ade80" : "#2a2a40"}`,
            background: completed ? "#4ade80" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s ease",
          }}>
            {completed && <span style={{ color: "#0a0a0f", fontSize: 12, fontWeight: 700 }}>✓</span>}
          </button>
        </div>
      </div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#e8e8f0", marginBottom: 4, lineHeight: 1.35 }}>{p.title}</div>
      <div style={{ fontSize: 11, color: "#555570", marginBottom: 12, lineHeight: 1.4 }}>{p.tagline}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {p.tools.slice(0, 4).map(t => (
          <span key={t} style={{ fontSize: 9, color: "#4a4a68", background: "#12121e", padding: "3px 7px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>
        ))}
        {p.tools.length > 4 && <span style={{ fontSize: 9, color: "#3d3d5c" }}>+{p.tools.length - 4}</span>}
      </div>
    </div>
  );
}

function Modal({ project: p, completed, onToggle, onClose }) {
  const sc = skillColors[p.skill] || "#818cf8";
  const d = diffBadge[p.difficulty];
  const phase = phases.find(ph => ph.id === p.phase);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      animation: "fadeIn 0.15s ease",
    }}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{
        background: "#0a0a12", border: "1px solid #1a1a2e", borderRadius: 16,
        overflowY: "auto", position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, background: "#1a1a2e",
          border: "none", color: "#666", width: 28, height: 28, borderRadius: "50%",
          cursor: "pointer", fontSize: 14, fontFamily: "monospace",
        }}>✕</button>

        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, background: sc + "18", color: sc, padding: "3px 10px", borderRadius: 4, fontWeight: 700, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace" }}>
            {p.skill.toUpperCase()}
          </span>
          <span style={{ fontSize: 9, background: d.bg, color: d.color, padding: "3px 10px", borderRadius: 4, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{d.label}</span>
          {phase && <span style={{ fontSize: 9, color: phase.color, background: phase.color + "12", padding: "3px 10px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace" }}>
            PHASE {phase.id} · Week {p.week}
          </span>}
        </div>

        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, color: "#f1f5f9", marginBottom: 6, lineHeight: 1.2 }}>{p.title}</div>
        <div style={{ fontSize: 13, color: "#555570", marginBottom: 16 }}>{p.tagline}</div>
        <div style={{ fontSize: 13, color: "#8888a0", lineHeight: 1.8, marginBottom: 22 }}>{p.description}</div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 10, color: "#4a4a68", letterSpacing: "0.15em", marginBottom: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>TASKS</div>
          {p.tasks.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ color: sc, fontSize: 8, marginTop: 5, flexShrink: 0 }}>●</span>
              <span style={{ fontSize: 12, color: "#b0b0c8", lineHeight: 1.7 }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{ background: sc + "08", border: `1px solid ${sc}18`, borderRadius: 10, padding: "14px 16px", marginBottom: 22 }}>
          <div style={{ fontSize: 9, color: sc, letterSpacing: "0.15em", marginBottom: 6, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>RESUME BULLET</div>
          <div style={{ fontSize: 12, color: "#b0b0c8", lineHeight: 1.7, fontStyle: "italic" }}>"{p.resume}"</div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 9, color: "#4a4a68", letterSpacing: "0.15em", marginBottom: 8, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>TOOLS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {p.tools.map(t => (
              <span key={t} style={{ fontSize: 10, color: "#8888a0", background: "#12121e", padding: "4px 10px", borderRadius: 5, fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>
            ))}
          </div>
        </div>

        <button onClick={() => onToggle(p.day)} style={{
          width: "100%", padding: 12, borderRadius: 10, border: "none", cursor: "pointer",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
          background: completed ? "rgba(74,222,128,0.12)" : "#1a1a2e",
          color: completed ? "#4ade80" : "#8888a0",
          border: `1px solid ${completed ? "rgba(74,222,128,0.25)" : "#2a2a40"}`,
          transition: "all 0.2s ease",
        }}>
          {completed ? "✓ Completed" : "Mark as Complete"}
        </button>
      </div>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function DevOpsRoadmapV2({ token, onLogout }) {
  const [activeSkill, setActiveSkill] = useState("All");
  const [selected, setSelected] = useState(null);
  const [completedDays, setCompletedDays] = useState(new Set());
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProgress(token).then(s => { setCompletedDays(s); setLoaded(true); });
  }, [token]);

  const toggle = useCallback((day) => {
    setCompletedDays(prev => {
      const next = new Set(prev);
      const isCompleted = !next.has(day);
      isCompleted ? next.add(day) : next.delete(day);
      saveProgress(day, isCompleted, token);
      return next;
    });
  }, [token]);

  const filtered = useMemo(() => {
    let list = activeSkill === "All" ? projects : projects.filter(p => p.skill === activeSkill);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.tools.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeSkill, searchQuery]);

  const progress = Math.round((completedDays.size / projects.length) * 100);

  const phaseStats = useMemo(() => {
    return phases.map(ph => {
      const pp = projects.filter(p => p.phase === ph.id);
      const done = pp.filter(p => completedDays.has(p.day)).length;
      return { ...ph, total: pp.length, done };
    });
  }, [completedDays]);

  if (!loaded) return (
    <div style={{ minHeight: "100vh", background: "#06060c", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#4a4a68", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Loading your progress...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#06060c", color: "#e2e8f0", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #06060c; }
        ::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 2px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        
        .container { max-width: 1200px; margin: 0 auto; }
        .header-wrapper { background: linear-gradient(160deg, #06060c 0%, #0d0d1a 40%, #0a0a14 100%); border-bottom: 1px solid #1a1a2e; padding: 36px 24px 28px; }
        .header-content { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
        .page-title { font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 800; color: #f1f5f9; line-height: 1.15; margin-bottom: 8px; }
        .header-progress { text-align: right; min-width: 140px; }
        .progress-bar-container { width: 140px; height: 4px; background: #12121e; border-radius: 3px; margin-top: 10px; margin-left: auto; }
        .filter-bar { background: #08080f; border-bottom: 1px solid #1a1a2e; padding: 14px 24px; position: sticky; top: 0; z-index: 50; }
        .filter-content { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
        .search-container { margin-left: auto; }
        .search-input { background: #0c0c14; border: 1px solid #1a1a2e; border-radius: 8px; padding: 6px 14px; font-size: 11px; color: #8888a0; outline: none; font-family: 'JetBrains Mono', monospace; width: 180px; }
        .main-content { padding: 8px 24px 60px; }
        .phase-header { display: flex; align-items: center; gap: 16px; padding: 20px 0 12px; margin-bottom: 16px; }
        .phase-progress { text-align: right; }
        .phase-progress-bar { width: 80px; height: 3px; background: #1e293b; border-radius: 2px; margin-top: 4px; }
        .modal-container { padding: 28px; max-width: 620px; width: 100%; max-height: 90vh; }
        
        @media (max-width: 768px) {
          .header-wrapper { padding: 24px 16px 20px; }
          .header-content { flex-direction: column; gap: 16px; }
          .page-title { font-size: 26px !important; }
          .header-progress { text-align: left; width: 100%; margin-top: 8px; }
          .progress-bar-container { margin-left: 0; width: 100%; }
          .filter-bar { padding: 12px 16px; }
          .search-container { margin-left: 0; width: 100%; margin-top: 8px; }
          .search-input { width: 100%; }
          .main-content { padding: 8px 16px 60px; }
          .phase-header { flex-direction: column; align-items: flex-start; gap: 12px; }
          .phase-progress { text-align: left; width: 100%; }
          .phase-progress-bar { width: 100%; margin-top: 8px; }
          .modal-container { padding: 20px !important; border-radius: 12px !important; }
        }
      `}</style>

      {/* ── HEADER ───────────────────────────────────────────────── */}
      <div className="header-wrapper">
        <div className="container">
          <div className="header-content">
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "#22d3ee", fontWeight: 700, marginBottom: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                DEVOPS MASTERY ROADMAP
              </div>
              <h1 className="page-title">
                60 Projects.<br />
                <span style={{ color: "#818cf8" }}>20 Weeks.</span>{" "}
                <span style={{ color: "#22d3ee" }}>8 Phases.</span>
              </h1>
              <p style={{ fontSize: 12, color: "#4a4a68", maxWidth: 420, lineHeight: 1.6 }}>
                From Linux fundamentals to production GitOps. Every project builds your resume. Progress saves automatically.
              </p>
            </div>
            <div className="header-progress">
              <div style={{ fontSize: 10, color: "#4a4a68", letterSpacing: "0.15em", fontWeight: 600, marginBottom: 8 }}>OVERALL</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#818cf8", lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>{progress}%</div>
              <div style={{ fontSize: 10, color: "#4a4a68", marginTop: 4 }}>{completedDays.size} / {projects.length} done</div>
              <div className="progress-bar-container">
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #6366f1, #22d3ee)", borderRadius: 3, transition: "width 0.4s ease" }} />
              </div>
              <button onClick={onLogout} style={{
                marginTop: 12, background: "transparent", border: "1px solid #1a1a2e",
                borderRadius: 6, padding: "5px 12px", cursor: "pointer",
                fontSize: 9, color: "#3d3d5c", fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.1em", fontWeight: 600, transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#f8717144"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a2e"; e.currentTarget.style.color = "#3d3d5c"; }}
              >SIGN OUT</button>
            </div>
          </div>

          {/* Phase progress bar */}
          <div style={{ display: "flex", gap: 4, marginTop: 24, flexWrap: "wrap" }}>
            {phaseStats.map(ph => (
              <div key={ph.id} style={{ flex: 1, minWidth: 100 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 9, color: ph.color, fontWeight: 600, letterSpacing: "0.05em" }}>{ph.name.toUpperCase()}</span>
                  <span style={{ fontSize: 9, color: "#3d3d5c" }}>{ph.done}/{ph.total}</span>
                </div>
                <div style={{ height: 3, background: "#12121e", borderRadius: 2 }}>
                  <div style={{
                    height: "100%", borderRadius: 2, background: ph.color,
                    width: `${ph.total > 0 ? (ph.done / ph.total) * 100 : 0}%`,
                    transition: "width 0.4s ease", opacity: 0.8,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ───────────────────────────────────────────── */}
      <div className="filter-bar">
        <div className="container filter-content">
          {skills.map(s => {
            const active = activeSkill === s;
            const c = skillColors[s] || "#818cf8";
            return (
              <button key={s} onClick={() => setActiveSkill(s)} style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 10, fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em",
                background: active ? c : "transparent",
                color: active ? "#06060c" : "#4a4a68",
                border: `1px solid ${active ? c : "#1a1a2e"}`,
                cursor: "pointer", transition: "all 0.15s ease",
              }}>
                {s}
              </button>
            );
          })}
          <div className="search-container">
            <input
              type="text" placeholder="Search projects..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div className="container main-content">
        {activeSkill === "All" ? (
          phases.map(phase => {
            const phaseProjects = filtered.filter(p => p.phase === phase.id);
            if (phaseProjects.length === 0) return null;
            return (
              <div key={phase.id}>
                <PhaseHeader phase={phase} projects={phaseProjects} completedDays={completedDays} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10, marginBottom: 24 }}>
                  {phaseProjects.map(p => (
                    <Card key={p.day} p={p} completed={completedDays.has(p.day)}
                      onToggle={toggle} onClick={() => setSelected(p)} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10, marginTop: 20 }}>
            {filtered.map(p => (
              <Card key={p.day} p={p} completed={completedDays.has(p.day)}
                onToggle={toggle} onClick={() => setSelected(p)} />
            ))}
          </div>
        )}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#3d3d5c", fontSize: 13 }}>
            No projects match your filter.
          </div>
        )}
      </div>

      {/* ── MODAL ────────────────────────────────────────────────── */}
      {selected && (
        <Modal project={selected} completed={completedDays.has(selected.day)}
          onToggle={toggle} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
