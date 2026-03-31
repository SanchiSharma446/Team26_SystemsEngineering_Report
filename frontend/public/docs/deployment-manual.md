# Deployment Manual

This appendix is a step-by-step guide for deploying Cresco from source. Two deployment paths are covered: **local development** and **Azure cloud production**.

---

## Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| Python | 3.12+ | Backend runtime |
| uv | latest | Python package manager |
| Node.js | 18+ | Frontend build |
| Docker | latest | PostgreSQL (dev) / full stack (prod) |
| Azure CLI | latest | Cloud deployment only |
| Git | any | Cloning the repository |

Install `uv` (Python package manager):

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## Environment Configuration

All configuration lives in a single `.env` file at the **project root** (not inside `backend/` or `frontend/`).

```bash
cp .env.example .env
# Edit .env with your values
```

### Required Variables

| Variable | Description |
|---|---|
| `MODEL_PROVIDER` | LLM provider: `azure-openai`, `openai`, `google-genai`, `anthropic`, or `ollama` |
| `MODEL_NAME` | Model identifier (e.g. `gpt-4o-mini`, `gemini-2.0-flash`) |
| `JWT_SECRET_KEY` | Random secret for signing JWT tokens |
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key |
| `TAVILY_API_KEY` | Tavily search API key |

Generate a secure JWT secret:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Provider-Specific Variables

**Azure OpenAI** (default):
```
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-12-01-preview
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
```

**OpenAI:**
```
OPENAI_API_KEY=sk-...
```

**Google Gemini:**
```
GOOGLE_API_KEY=...
```

**Anthropic:**
```
ANTHROPIC_API_KEY=sk-ant-...
```

**Ollama:** no API key required - runs locally.

### Optional Variables

| Variable | Default | Description |
|---|---|---|
| `CHROMA_PERSIST_DIR` | `./data/chroma_db` | ChromaDB vector index location |
| `KNOWLEDGE_BASE_PATH` | `./data/knowledge_base` | RAG source documents |
| `API_PORT` | `8000` | Backend port |
| `DEBUG` | `true` | Enable verbose logging |
| `COPERNICUS_CLIENT_ID` | — | Copernicus satellite imagery |
| `COPERNICUS_CLIENT_SECRET` | — | Copernicus satellite imagery |

---

## Local Development

### 1. Clone and configure

```bash
git clone https://github.com/SanchiSharma446/Cresco.git
cd Cresco
cp .env.example .env
# Edit .env
```

### 2. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 3. Set up and start the backend

```bash
cd backend
uv sync
uv run python scripts/create_admin.py <username> <password>
uv run python scripts/index_documents.py
uv run uvicorn cresco.main:app --reload --port 8000
```

The API and interactive docs are available at `http://localhost:8000/docs`.

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The app is available at `http://localhost:3000`.

---

## Docker Deployment

Both services have multi-stage Dockerfiles. The backend image bakes in the ChromaDB vector index and knowledge base at build time.

### Build images

```bash
docker build -f backend/Dockerfile  backend/  -t cresco-backend:latest
docker build -f frontend/Dockerfile frontend/ -t cresco-frontend:latest
```

### Run the stack

```bash
# Start PostgreSQL
docker compose up -d postgres

# Backend
docker run -d --name cresco-backend \
  --network cresco_default \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://cresco:cresco@postgres:5432/cresco \
  -e JWT_SECRET_KEY=<your-secret> \
  -e MODEL_PROVIDER=openai \
  -e OPENAI_API_KEY=sk-... \
  -e OPENWEATHER_API_KEY=... \
  -e TAVILY_API_KEY=... \
  cresco-backend:latest

# Frontend (nginx proxies /api/ to the backend container)
docker run -d --name cresco-frontend \
  --network cresco_default \
  -p 3000:80 \
  cresco-frontend:latest
```

The app is available at `http://localhost:3000`.

### Nginx reverse proxy

The frontend container runs Nginx, which:
- Serves the React SPA and falls back to `index.html` for client-side routing.
- Proxies all `/api/` requests to `http://backend:8000`.

No additional reverse proxy setup is needed for single-host deployments.

---

## Azure Cloud Deployment

Production uses a GitHub Actions CI/CD pipeline that deploys automatically on every push to `master`.

### Azure architecture

| Component | Azure service |
|---|---|
| Backend | App Service (Linux B1) + Azure Container Registry |
| Frontend | Static Web Apps (Free tier) |
| Database | PostgreSQL Flexible Server (B1ms) |

### 1. Provision Azure resources

```bash
RESOURCE_GROUP=cresco-group
LOCATION=uksouth

az group create --name $RESOURCE_GROUP --location $LOCATION

# Container Registry
az acr create --resource-group $RESOURCE_GROUP \
  --name crescoacr --sku Basic --admin-enabled true

# App Service
az appservice plan create --name cresco-plan \
  --resource-group $RESOURCE_GROUP --sku B1 --is-linux

az webapp create --resource-group $RESOURCE_GROUP \
  --plan cresco-plan --name cresco-backend \
  --deployment-container-image-name placeholder

# PostgreSQL Flexible Server
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP --name cresco-db \
  --location $LOCATION \
  --admin-user crescoadmin --admin-password <strong-password> \
  --sku-name Standard_B1ms --tier Burstable --storage-size 32

# Static Web Apps
az staticwebapp create --name cresco-frontend \
  --resource-group $RESOURCE_GROUP \
  --source https://github.com/SanchiSharma446/Cresco.git \
  --location $LOCATION
```

### 2. Configure App Service settings

```bash
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP --name cresco-backend \
  --settings \
    MODEL_PROVIDER=azure-openai \
    AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/ \
    AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini \
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small \
    DATABASE_URL="postgresql://crescoadmin:<password>@cresco-db.postgres.database.azure.com:5432/cresco?sslmode=require" \
    JWT_SECRET_KEY=<generated-secret> \
    OPENWEATHER_API_KEY=<key> \
    TAVILY_API_KEY=<key> \
    WEBSITES_PORT=8000 \
    DEBUG=false
```

### 3. Configure GitHub Secrets

| Secret | Value |
|---|---|
| `ACR_LOGIN_SERVER` | `crescoacr.azurecr.io` |
| `ACR_USERNAME` | ACR admin username |
| `ACR_PASSWORD` | ACR admin password |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Token from Azure Portal → Static Web Apps |
| `VITE_API_URL` | `https://cresco-backend.azurewebsites.net/api/v1` |
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap key for frontend build |

Retrieve ACR credentials:

```bash
az acr credential show --resource-group $RESOURCE_GROUP --name crescoacr
```

### 4. Enable continuous deployment

```bash
az webapp deployment container config \
  --name cresco-backend \
  --resource-group $RESOURCE_GROUP \
  --enable-cd true
```

### 5. Deploy

Push to `master` to trigger the pipeline. GitHub Actions will:
1. Run backend linting and tests (pytest, ruff).
2. Run frontend linting, tests, and build.
3. Build and push the backend Docker image to ACR.
4. Deploy the frontend static build to Static Web Apps.

Monitor progress in **GitHub → Actions**.

---

## CI/CD Pipeline Reference

| Workflow | Trigger | Steps |
|---|---|---|
| `ci.yml` | Pull request to `master` | Lint + test (backend and frontend) |
| `deploy.yml` | Push to `master` | CI → build Docker image → push to ACR → deploy frontend to SWA |

Backend tests require a PostgreSQL service container and enforce 80% code coverage. Frontend tests use Vitest + React Testing Library.

---

## Post-Deployment Checks

```bash
# Health check
curl https://cresco-backend.azurewebsites.net/health

# Local equivalent
curl http://localhost:8000/health
```

- Frontend loads and login works with admin credentials.
- Chat sends a message and receives a response with citations.
- Weather panel shows data for a mapped farm location.
- File upload indexes and appears in subsequent chat context.
- Drone image upload returns NDVI analysis.