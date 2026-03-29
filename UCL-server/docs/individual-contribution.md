# Individual Contribution — Shuaiting Li

I served as the lead backend developer on the Cresco project, a team of four working under the UCL Industry Exchange Network programme with NTT DATA. Over the five-month development period (November 2025 -- March 2026), I authored 144 of 380 commits (~38%), primarily responsible for backend architecture, authentication, the RAG-powered chat agent, database design, and the CI/CD pipeline. I also built the frontend API service layer and contributed to technical research and report writing.

---

## 1. Personal Contributions to System Artefacts

### 1.1 Research

My research focused on evaluating the technical options that shaped the system's architecture. I investigated open-source LLM models and commercial providers, initially exploring Google Generative AI (Gemini) before determining it was not feasible because the team only had Azure credits. I then researched the models available on Azure OpenAI, evaluating response quality and cost for agricultural domain queries, and set up the multi-provider configuration that allows switching between five providers via environment variables.

Beyond LLM selection, I researched the core backend technologies: Retrieval-Augmented Generation (RAG) architecture --- embedding models, document chunking strategies, and ChromaDB as the vector store; LangGraph for agent orchestration with tool-calling and conversation memory; PostgreSQL for production database requirements (concurrent access, managed Azure hosting); FastAPI as the async web framework; and GitHub Actions with Docker for CI/CD pipelines.

### 1.2 UI Design

UI design was primarily led by Vivek and Sagar. My contribution was architectural rather than visual: I designed the authentication page flow (login and register forms, JWT token storage in localStorage, automatic logout on 401/403 responses) and created the `api.js` service layer that defines how every frontend component communicates with the backend --- a single module with consistent error handling and authorisation header injection.

### 1.3 Coding

#### 1.3.1 Backend Architecture and API

I initialised the FastAPI project and designed its module structure: `agent/` (chat agent), `api/` (HTTP endpoints), `auth/` (authentication), `rag/` (document indexing and retrieval), `db.py` (database operations), `config.py` (settings), and `main.py` (application factory). The `create_app()` factory uses FastAPI's lifespan manager to initialise and clean up resources (database connection pool, LangGraph checkpointer) on startup and shutdown.

Configuration is managed through a Pydantic-settings class with `@lru_cache`, reading all settings from a single `.env` file. All third-party API calls (OpenWeatherMap for weather, Nominatim for geocoding) are proxied through backend endpoints using `httpx`, so API keys never reach the frontend (NFR-02). The farm data endpoints use `asyncio.gather()` to fetch current weather and the five-day forecast in parallel, reducing latency.

#### 1.3.2 Authentication and Security

I built the complete authentication system across four modules: `auth/users.py` (user creation and lookup), `auth/jwt.py` (token creation and validation), `auth/dependencies.py` (FastAPI middleware), and `auth/routes.py` (login and register endpoints). Passwords are hashed with bcrypt before storage and never stored or returned in plaintext (FR-01, FR-02, NFR-04). Login issues a JSON Web Token (JWT) signed with HS256 and a 24-hour expiry, containing the user's ID, username, and admin status.

Route protection uses FastAPI's dependency injection: `get_current_user()` extracts the Bearer token from the request header, decodes and validates the JWT, and returns the authenticated user --- injected into every protected endpoint via `Depends()`. This pattern also enforces per-user data isolation (NFR-05): every database query and file operation is scoped to the authenticated user's ID, preventing any endpoint from returning another user's data (NFR-03).

#### 1.3.3 RAG Agent and LLM Integration

I designed and implemented the `CrescoAgent` class using LangGraph, a framework for building stateful AI agent workflows. The agent is structured as a state graph where the LLM decides when to invoke tools, LangGraph dispatches the calls, and the results are fed back for further reasoning. Other team members implemented the individual tools (ChromaDB retrieval, weather data lookup) and the structured output rendering; my work focused on the agent framework, graph orchestration, and LLM integration.

For the internet search toggle, I used a strategy pattern: two versions of the agent graph are pre-built at initialisation (one with TavilySearch, one without), and the `chat()` method selects the appropriate graph at runtime (FR-14). This avoids reconstructing the graph on every request.

I also implemented multi-LLM provider support via LangChain's `init_chat_model`, allowing deployment teams to switch between five providers by changing two environment variables (FR-18, NFR-11).

#### 1.3.4 Database Layer

I initially implemented the database using SQLite for rapid prototyping, then led the full migration to PostgreSQL for production deployment. The migration touched 15 files with 420+ insertions and 210+ deletions, replacing all synchronous SQLite calls with an asynchronous connection pool using `psycopg` v3 (`AsyncConnectionPool`, min 2 / max 10 connections) (NFR-09).

The database stores two tables: `users` (credentials and roles) and `farm_data` (location, area, polygon vertices as JSONB, and cached weather data as JSONB). I also replaced the in-memory conversation store (`InMemorySaver`) with `AsyncPostgresSaver` from the `langgraph-checkpoint-postgres` package, so conversation history persists across server restarts (FR-05). A synchronous helper function (`get_farm_data_sync`) provides the agent's weather tool with database access from within LangGraph's thread pool.

For local development, I added a `docker-compose.yml` with PostgreSQL 17, health checks, and a named volume for data persistence.

#### 1.3.5 Document Upload and Indexing

I built the document upload pipeline: the `/upload` endpoint validates file extensions (.md, .pdf, .txt, .csv, .json), saves files to a per-user directory, then automatically chunks and indexes them into ChromaDB (FR-06). Chunking uses LangChain's `RecursiveCharacterTextSplitter` with markdown-aware separators, and indexing runs in batches of 100 documents with a one-second delay to respect API rate limits. Each chunk is tagged with the user's ID in metadata, enabling per-user retrieval scoping. File deletion cascades to remove both the disk file and all associated ChromaDB chunks.

#### 1.3.6 Conversation Management

I implemented conversation persistence by integrating `AsyncPostgresSaver` as the LangGraph checkpointer, so conversation history survives server restarts (FR-05). I also built the clear-all-history feature, which removes every message from the agent's state (FR-21), and fixed a crash that occurred when history operations were called on an empty conversation.

#### 1.3.7 CI/CD and DevOps

I created both CI and CD pipelines using GitHub Actions. The CI pipeline runs on every pull request with two parallel jobs: backend (Ruff linting, format check, pytest with 80% minimum coverage against a PostgreSQL 17 service container) and frontend (ESLint, Vitest, Vite build) (NFR-07, NFR-10). The CD pipeline runs on merge to master: it builds the backend Docker image and pushes it to Azure Container Registry, then deploys the frontend to Azure Static Web Apps.

The backend Dockerfile uses a multi-stage build: the builder stage installs dependencies with `uv` (a fast Python package manager), and the runtime stage copies only the virtual environment, application code, and a pre-built ChromaDB index --- eliminating indexing time at startup. I resolved ten distinct deployment issues during the Azure setup (detailed in Section 3.1).

#### 1.3.8 Frontend Service Layer

I created `api.js` as the single module for all backend communication. It injects the JWT Bearer token on every request via an `authHeaders()` helper, automatically logs users out on 401/403 responses, and enforces a 120-second timeout on chat requests via `AbortController`. All API functions (`sendMessage`, `uploadAndIndexFile`, `fetchUploadedFiles`, `deleteUploadedFile`, `deleteLastExchange`, `saveFarmData`, `fetchFarmData`, `fetchWeather`, `geocodeSearch`, `geocodeReverse`) are centralised here so that no component calls `fetch()` directly.

### 1.4 Testing

I set up the backend test infrastructure in `conftest.py`, establishing fixtures that the team used throughout development: `client` (sync test client with auth bypassed), `auth_client` (real auth against a temporary PostgreSQL database), `async_client` (async test client), `tmp_database` (initialises and truncates PostgreSQL tables between tests), and `mock_db_pool` (mock connection pool). I enforced the class-based test organisation convention (`class TestFeatureName:`) and configured `asyncio_mode = "auto"` so tests do not need individual async markers.

I authored backend tests for authentication, the agent, API proxy endpoints (geocoding, weather), and the document indexer, and designed the mock strategy for external services: a reusable `TavilySearch` fixture and `httpx.AsyncClient` patching for proxy routes. The team collectively wrote 260+ backend tests across 66 test classes and 124 frontend tests; I led the backend test framework and contributed a significant portion of the backend test suite.

---

## 2. Personal Contributions to the Website Report

| Website Section             | Contribution                                  |
| --------------------------- | --------------------------------------------- |
| Website template and setup  | Authored in full                              |
| Home                        | Contributed                                   |
| Video                       | Contributed                                   |
| Requirements                | Contributed                                   |
| Research                    | Contributed                                   |
| UI Design                   | ---                                           |
| System Design               | Authored in full                              |
| Implementation              | Authored (sections covering features I built) |
| Testing                     | Contributed                                   |
| Evaluation and future work  | Contributed                                   |
| User and deployment manuals | Authored deployment manual                    |
| Legal issues                | ---                                           |
| Blog and video              | Contributed                                   |

**Requirements.** I contributed to the requirements specification, including requirement gathering through farmer interviews, use case definitions, and MoSCoW prioritisation of functional and non-functional requirements.

**Website template and setup.** I built the entire report website from scratch using React and Vite. This includes the `MarkdownRenderer` component (which fetches and renders markdown pages using `react-markdown`, `remark-gfm`, and `rehype-raw`), the `TableOfContents` component (responsive sticky sidebar with scroll-spy via `IntersectionObserver`), sequence diagram folding via collapsible `<details>` elements, `HashRouter`-based routing for static site export, and the overall page layout (header, footer, nav dropdown for appendices). I also configured the Azure Blob Storage deployment pipeline.

**System Design.** I authored the full system design report --- system architecture diagram with component descriptions, site map, four sequence diagrams (authentication, chat with RAG, file upload, farm location and weather), six design patterns identified in the codebase (singleton, factory, strategy, dependency injection, proxy, repository), data storage schemas, and package and API endpoint tables. All diagrams were created using Mermaid.

**Implementation.** I authored the implementation report covering the features I built: authentication, RAG-powered chat system, document upload and indexing, farm location and weather integration, and CI/CD deployment. Other team members' features (drone image analysis, satellite NDVI, frontend chat rendering) were also documented in the report.

**Deployment Manual.** I authored the full deployment manual covering local development setup, Docker deployment, Azure cloud deployment (App Service, Static Web Apps, Container Registry), CI/CD pipeline reference, environment variables, and a common issues table.

**Evaluation and Future Work.** I contributed to the evaluation report, including the achievement tables mapping each requirement to its completion status and contributors, the critical evaluation sections covering stability, efficiency, maintainability, and project management, and future work recommendations.

---

## 3. Main Difficulties and How They Were Overcome

### 3.1 Continuous Deployment on Azure

Deploying to Azure was the most operationally challenging part of the project. This was the team's first multi-service cloud deployment, and we encountered ten distinct issues across infrastructure, Docker builds, runtime configuration, and CI workflow, documented in full in `DEPLOYMENT_LOG.md`.

**Infrastructure constraints.** The UCL-provided Azure subscription had zero Basic VM quota and no self-service quota increases. Creating a container registry failed because the required resource providers were not registered on a new subscription. Service principal authentication failed because our account lacked the necessary role assignment permissions. We resolved these by creating a new Pay-As-You-Go subscription, manually registering Azure resource providers, and ultimately switching from service principal auth to Azure Container Registry (ACR) continuous deployment --- where the App Service automatically pulls new images when the `latest` tag is updated, requiring no Azure credentials in GitHub Actions.

**Docker and build issues.** The `python:3.12-slim` base image had moved to Debian Trixie, which removed the `libgl1-mesa-glx` package our image processing dependencies required. The `hatchling` build tool failed because the Dockerfile did not copy `README.md` into the builder stage. The App Service was configured with a doubled registry prefix in the image name. Each issue required investigating error logs, identifying root causes, and iterating on the Dockerfile and Azure configuration.

**Runtime issues.** After successful deployment, the application crashed because the `DATABASE_URL` pointed to a non-existent server name. Once corrected, a race condition emerged: with two Gunicorn workers, both attempted to run the LangGraph checkpointer's database migration simultaneously, causing a unique constraint violation that killed the process. The fix was to wrap the migration call in a try/except block, since the migration is idempotent. Finally, the frontend could not reach the backend because the deployed Static Web App URL was not in the CORS allowed origins list.

**Lesson learned.** Cloud deployment is iterative. Logging every issue and resolution as it happened (in `DEPLOYMENT_LOG.md`) proved invaluable for debugging subsequent failures and for documenting the process for the team.

### 3.2 SQLite to PostgreSQL Migration

We initially used SQLite for rapid prototyping: it requires no server setup and stores everything in a single file. However, SQLite does not support concurrent write access (critical for a multi-user web application), is not available as a managed service on Azure, and the LangGraph conversation checkpointer we needed (`AsyncPostgresSaver`) requires PostgreSQL.

The migration was a single large commit touching 15 files (420+ insertions, 210+ deletions). Every layer was affected simultaneously: database operations were rewritten from synchronous `sqlite3` calls to asynchronous `psycopg` v3 connection pool calls, the authentication module was updated from SQLite to psycopg connections, the in-memory conversation store was replaced with `AsyncPostgresSaver`, all API routes were refactored to accept the connection pool via FastAPI dependency injection, and every backend test was updated to run against a PostgreSQL service container in CI.

The main difficulty was that partial migration was not feasible --- the application would not function with a mix of SQLite and PostgreSQL calls. The approach was to make it a single atomic change, test thoroughly against the PostgreSQL service container locally and in CI, and merge only after all 260+ tests passed.

### 3.3 Agent Architecture Migration to LangGraph

The initial backend prototype used a simple `PlannerAgent` class that made direct calls to the language model: the user's message went in, the LLM's response came back, with no tool calling, no memory, and no structured output. This was sufficient for a proof of concept but could not support the features we needed --- retrieval-augmented generation, weather-aware responses, internet search, conversation persistence, and structured task and chart output.

The migration to LangGraph was incremental across multiple sprints. First, I replaced direct LLM calls with LangChain's chat model abstraction, which gave us provider-agnostic model initialisation. Next, I defined the agent's tools (retrieval, weather, internet search) and wrapped them in a LangGraph agent graph, which handles the tool-calling loop automatically: the LLM decides when to invoke a tool, LangGraph dispatches the call, feeds the result back, and the LLM continues reasoning. Then I added the strategy pattern (two pre-built graphs for the internet search toggle) and structured output parsing. Finally, I integrated `AsyncPostgresSaver` as the conversation checkpointer, giving the agent persistent memory across sessions.

The main difficulty was that LangGraph was a relatively new framework with limited documentation and few production examples at the time. Debugging tool-calling behaviour required understanding the graph execution model --- how messages flow through nodes, when tools are dispatched, and how the checkpointer serialises state. Building familiarity through incremental adoption (rather than a single large rewrite) made this manageable.
