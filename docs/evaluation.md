# Evaluation

## 1. Summary of Achievements

### 1.1 Achievement Table — Functional Requirements

| ID    | Requirement                                                                      | Priority | Status      | Contributors             |
| ----- | -------------------------------------------------------------------------------- | -------- | ----------- | ------------------------ |
| FR-01 | User registration and login with bcrypt hashing and JWT                          | Must     | Complete    | Shuaiting, Vivek, Sanchi |
| FR-02 | RAG chat with per-user knowledge base retrieval and source citations             | Must     | Complete    | Shuaiting, Sagar, Vivek  |
| FR-03 | Persistent conversation history with delete-last and clear-all                   | Must     | Complete    | Shuaiting, Sagar, Vivek  |
| FR-04 | Document upload with automatic chunking and indexing                             | Must     | Complete    | Shuaiting, Vivek         |
| FR-05 | Weather panel with 5-day forecast and temperature/wind chart                     | Must     | Complete    | Vivek, Shuaiting, Sanchi |
| FR-06 | Interactive Leaflet map with polygon farm boundary and geocoding                 | Must     | Complete    | Vivek, Shuaiting, Sagar  |
| FR-07 | Drone image analysis with vegetation indices, gallery, and time series           | Should   | Complete    | Sanchi, Vivek            |
| FR-08 | Sentinel-2 satellite NDVI imagery from Copernicus                                | Should   | Complete    | Vivek                    |
| FR-09 | Inline task cards, charts, Markdown, LaTeX, and source citations in responses    | Should   | Complete    | All                      |
| FR-10 | Dashboard aggregating tasks, weather, season, and field health                   | Should   | Complete    | Vivek, Sanchi            |
| FR-11 | Toggleable internet search and account deletion with cascading cleanup           | Should   | Complete    | Shuaiting, Sanchi, Vivek |
| FR-12 | Multi-LLM provider support, drag-and-drop upload, and collapsible sidebars       | Could    | Complete    | Shuaiting, Vivek, Sagar  |
| FR-13 | Streaming responses, voice input, and PDF export                                 | Could    | Not Started | —                        |
| FR-14 | Native mobile app, collaborative sessions, farm software integration, custom LLM | Won't    | —           | —                        |

### 1.2 Achievement Table — Non-Functional Requirements

| ID     | Requirement                                                              | Priority | Status   | Contributors             |
| ------ | ------------------------------------------------------------------------ | -------- | -------- | ------------------------ |
| NFR-01 | Chat response within 120 seconds                                         | Must     | Complete | All                      |
| NFR-02 | Server-side API keys, JWT authentication, and bcrypt password hashing    | Must     | Complete | Shuaiting, Vivek, Sanchi |
| NFR-03 | Per-user data isolation across all data types                            | Must     | Complete | Shuaiting                |
| NFR-04 | 80%+ backend coverage and Ruff/ESLint linting enforced by CI             | Must     | Complete | All                      |
| NFR-05 | ARIA labels, semantic HTML, keyboard navigation                          | Should   | Complete | Vivek, Sagar             |
| NFR-06 | Async connection pool and parallel API calls                             | Should   | Complete | Shuaiting                |
| NFR-07 | Docker deployment with CI/CD pipeline to Azure                           | Should   | Complete | Shuaiting, Sagar, Sanchi |
| NFR-08 | Provider-agnostic LLM init, open-source stack, and env-var configuration | Should   | Complete | All                      |
| NFR-09 | Graceful error handling with fallbacks                                   | Should   | Complete | Shuaiting, Vivek         |
| NFR-10 | Dark theme and Progressive Web App with offline caching                  | Could    | Partial  | Vivek, Sagar             |
| NFR-11 | Horizontal scaling and multi-language localisation                       | Won't    | —        | —                        |

All 6 Must-have and 5 Should-have functional requirements were completed, along with 1 of 2 Could-have functional requirements. The incomplete Could-have (FR-13: streaming, voice, PDF export) was deprioritised in favour of delivering all Must-have and Should-have requirements to a high standard. For non-functional requirements, all Must-have, all Should-have, and 1 of 2 Could-have items were completed (dark theme delivered; PWA not started).

### 1.3 Known Bugs

1. **Historical message rendering:** When loading conversation history, the frontend occasionally renders tool call messages, system messages, and empty messages that should be filtered out, cluttering the chat display.
2. **Document serialization workaround:** The agent uses a short-term fix for converting Document objects to dictionaries during JSON serialization of uploaded file retrieval results (`agent.py`, line 288). This works correctly but may mask a deeper issue in how LangChain Document objects are passed between tools.

### 1.4 Individual Contribution Table

| Team Member  | Contribution (%) |
| ------------ | ---------------- |
| Shuaiting Li | 25               |
| Sagar        | 25               |
| Vivek Varkey | 25               |
| Sanchi       | 25               |

---

## 2. Critical Evaluation

### 2.1 User Experience

The application is designed around a single-page layout where the chat, document management, and tool panels are accessible without page navigation. Key interactions support keyboard shortcuts (Enter to send, Shift+Enter for newlines) and drag-and-drop file upload with a visual overlay. The dashboard aggregates tasks, weather, seasonal context, and field health into a single view, reducing the need to switch between panels during time-sensitive farming decisions.

Accessibility features include ARIA labels on interactive elements, semantic HTML landmarks, and role attributes on tab-based interfaces, targeting WCAG 2.1 Level A. However, ARIA coverage is not comprehensive across all components, and no formal accessibility audit has been conducted. The lack of streaming responses (FR-22) also affects the user experience — users wait up to 120 seconds with only a loading indicator, which could be improved with real-time token display.

### 2.2 Functionality

All Must-have and Should-have requirements were delivered, along with 4 of 7 Could-have functional requirements. The core chat system uses Retrieval-Augmented Generation with ChromaDB, scoping retrieval to shared knowledge base documents and the current user's uploads via metadata filters. The agent parses structured `---TASKS---` and `---CHART---` blocks from LLM responses and renders them as interactive UI components inline within messages, falling back to plain text when parsing fails.

Five LLM providers are supported (Azure OpenAI, OpenAI, Google GenAI, Anthropic, Ollama) through LangChain's provider-agnostic `init_chat_model` pattern, configurable via environment variables. Drone image analysis computes NDVI, EVI, and SAVI vegetation indices from paired RGB and NIR images, with a gallery, histogram visualisation, and time series chart. Satellite NDVI is fetched from Copernicus Sentinel-2 for the user's farm coordinates.

The internet search toggle allows users to enable or disable real-time web search via Tavily. Conversation management includes persistent history across server restarts, delete-last-exchange for correcting mistakes, and full history clearing.

The main functional limitation is that response quality depends on the chosen LLM provider and model configuration. The system cannot control for hallucination or inaccuracy beyond grounding responses in the knowledge base.

### 2.3 Stability

The backend implements graceful error handling throughout: weather fetch failures are silently logged without blocking farm data saves, upstream third-party API failures return HTTP 502 with descriptive messages, and JSON parsing errors in structured output blocks fall back to plain text. Duplicate username registration returns HTTP 409 Conflict.

The test suite comprises 260 backend tests across 66 test classes and 124 frontend tests, with 80% minimum backend coverage enforced by the CI pipeline. All external services are mocked in tests — no real API calls are made during testing. Conversation history persists across server restarts via the PostgreSQL-backed AsyncPostgresSaver checkpointer.

Database connections are managed through an asynchronous connection pool (psycopg AsyncConnectionPool, min_size=2, max_size=10). The pool is initialised during application startup and closed on shutdown.

The system lacks API rate limiting, which could allow abuse under heavy load. Health monitoring is limited to a single `/health` endpoint without proactive alerting.

### 2.4 Efficiency

The backend is fully asynchronous: FastAPI async routes, `asyncio.gather()` for parallel weather API fetching, and LangGraph async invocation via `.ainvoke()` and `aget_state()`. This allows efficient handling of concurrent users without thread blocking.

Caching is applied at multiple levels: `@lru_cache` for application settings, module-level singletons for the vector store, retriever, and agent instances. The ChromaDB index is pre-built and baked into the Docker image, eliminating indexing time at startup.

Timeouts are enforced at every layer: 120 seconds for chat responses (frontend AbortController and Gunicorn worker timeout) and 10 seconds for weather and geocoding requests via httpx. Docker multi-stage builds keep image sizes minimal by separating build dependencies from runtime.

The primary efficiency limitation is the lack of streaming for LLM responses. Users must wait for the full response to be generated before seeing any output, which can mean up to 120 seconds of waiting with no feedback beyond a loading indicator.

### 2.5 Compatibility

The system supports five LLM providers through a provider-agnostic initialisation pattern, allowing deployment teams to switch providers by changing two environment variables (`MODEL_PROVIDER`, `MODEL_NAME`) without modifying code. Docker-based deployment makes the system portable across any Docker-capable host, and all configuration is externalised via a single `.env` file.

The frontend is built with React 19 and served via Nginx, working in all modern browsers (Chrome, Firefox, Safari, Edge). The backend targets Python 3.12 and the CI pipeline runs on Node 22. External APIs (OpenWeatherMap, Nominatim, Copernicus, Tavily) are all accessed through backend proxy endpoints, so frontend compatibility is not affected by API changes.

No explicit browser compatibility matrix or legacy browser support (e.g. Internet Explorer) is provided.

### 2.6 Maintainability

Backend code quality is enforced by Ruff linting (rules E, F, I, N, W with 100-character line limit and Python 3.12 type hint syntax) and 80%+ test coverage via pytest, both checked automatically by the CI pipeline on every pull request. The frontend uses ESLint with React hooks and refresh plugins. The CI pipeline fails the build if either linting or backend coverage thresholds are not met.

The codebase is modular: the backend separates concerns into agent, api, auth, rag, and db modules, each with clear responsibilities. Testing conventions are formalised — all backend tests use class-based organisation with `asyncio_mode = "auto"`, and a comprehensive fixture system in `conftest.py` handles client setup, auth bypassing, and external service mocking.

The project has 379 commits across 4 contributors with a PR-based workflow. Pull requests are numbered and merged via GitHub, providing a clear audit trail.

Frontend test coverage is not enforced by the CI pipeline (only backend has `fail_under`), which could allow frontend regressions to go undetected.

### 2.7 Project Management

The team followed an agile methodology with two-week sprints and end-of-sprint demonstrations to the NTT DATA project liaison. Feedback from each demo was incorporated into the next sprint's backlog, driving the iterative addition of features such as the internet search toggle, dashboard, and inline chart generation.

Development used a feature branching strategy with descriptive branch prefixes (`feat/`, `fix/`, `refactor/`). All changes were submitted as pull requests and reviewed before merging to the master branch. The CI/CD pipeline automated linting, testing, building, and deployment on every PR and merge, reducing manual overhead and catching issues early.

The team comprised four contributors. Git history shows Shuaiting primarily led backend architecture (auth, agent, RAG, database, CI/CD), Vivek led frontend UI and integrations (map, charts, dashboard, markdown rendering), Sanchi specialised in drone features and account management, and Sagar focused on frontend testing and shared UI components.

The project used a single deployment branch (master) without a staging environment. A staging environment would have allowed pre-production testing of deployment configurations and infrastructure changes.

---

## 3. Future Work

**Streaming responses.** Implementing Server-Sent Events or WebSocket streaming for LLM output would provide real-time feedback to users, significantly reducing perceived latency during the current 10–120 second wait.

**Multi-language support.** Expanding beyond English to support Welsh and other languages would broaden accessibility for farmers across the UK.

**Mobile application.** A Progressive Web App or native mobile application would enable field use without a laptop, which is the primary use context for farmers during growing season.

**Rate limiting.** Adding API rate limiting would prevent abuse and ensure fair resource allocation across concurrent users.

**Advanced analytics.** Crop yield prediction models using historical weather data and NDVI time series could provide proactive recommendations beyond reactive Q&A.

**Multi-farm support.** Allowing users to manage multiple farm locations with separate boundaries, weather data, and drone imagery would support farmers who operate across multiple sites.

**Collaborative features.** Shared farm accounts for farm managers and workers would enable team-based use, with role-based access to different features.

**Offline mode.** Caching recent advisory content and weather data locally would support use in areas with poor internet connectivity, which is common in rural farming regions.

**Voice interface.** Speech-to-text input would enable hands-free interaction during fieldwork, addressing the practical constraint that farmers often cannot type while working.

**Formal accessibility audit.** Commissioning a WCAG 2.1 Level AA compliance audit and addressing the findings would ensure the application meets accessibility standards beyond the current Level A target.

## 4. Individual Contributions for System Artefacts

| Work packages             | Sagar | Sanchi | Shuaiting | Vivek |
| ------------------------- | ----- | ------ | --------- | ----- |
| Research and Experiments  | 25%   | 25%    | 25%       | 25%   |
| UI Design (if applicable) | 25%   | 25%    | 25%       | 25%   |
| Coding                    | 25%   | 25%    | 25%       | 25%   |
| Testing                   | 25%   | 25%    | 25%       | 25%   |
| Overall contribution      | 25%   | 25%    | 25%       | 25%   |

## 5. Individual Contributions for Report Website

| Work packages               | Sagar | Sanchi | Shuaiting | Vivek |
| --------------------------- | ----- | ------ | --------- | ----- |
| Website Template and Setup  | 25%   | 25%    | 25%       | 25%   |
| Home                        | 25%   | 25%    | 25%       | 25%   |
| Video                       | 25%   | 25%    | 25%       | 25%   |
| Requirement                 | 25%   | 25%    | 25%       | 25%   |
| Research                    | 25%   | 25%    | 25%       | 25%   |
| Algorithm (if applicable)   | 25%   | 25%    | 25%       | 25%   |
| UI Design (if applicable)   | 25%   | 25%    | 25%       | 25%   |
| System Design               | 25%   | 25%    | 25%       | 25%   |
| Implementation              | 25%   | 25%    | 25%       | 25%   |
| Testing                     | 25%   | 25%    | 25%       | 25%   |
| Evaluation and Future Work  | 25%   | 25%    | 25%       | 25%   |
| User and Deployment Manuals | 25%   | 25%    | 25%       | 25%   |
| Legal Issues                | 25%   | 25%    | 25%       | 25%   |
| Blog and Monthly Video      | 25%   | 25%    | 25%       | 25%   |
| Overall contribution        | 25%   | 25%    | 25%       | 25%   |