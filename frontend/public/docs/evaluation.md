# Evaluation

## 1. Summary of Achievements

### 1.1 Achievement Table - Functional Requirements

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
| FR-11 | Toggleable internet search and account deletion with cascading cleanup           | Should   | Complete    | All |
| FR-12 | Multi-LLM provider support, drag-and-drop upload, and collapsible sidebars       | Could    | Complete    | Shuaiting, Vivek, Sagar  |

### 1.2 Achievement Table - Non-Functional Requirements

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
| NFR-09 | Graceful error handling with fallbacks                                   | Should   | Complete | All         |
| NFR-10 | Dark theme for reduced eye strain                                       | Could    | Complete | Vivek, Sagar             |

All functional requirements in scope (Must-have, Should-have, and Could-have) were completed. For non-functional requirements, all Must-have and all Should-have items were completed; the Could-have item was delivered as a dark-mode UI (no light theme).

### 1.3 Known Bugs

1. The drone modal can incorrectly claim to be showing a different index after the user changes their selection, without actually reprocessing the images. *Priority: Low*

### 1.4 Individual Contributions for System Artefacts

| Work packages             | Sagar | Sanchi | Shuaiting | Vivek |
| ------------------------- | ----- | ------ | --------- | ----- |
| Research and Experiments  | 25%   | 25%    | 25%       | 25%   |
| UI Design                 | 30%   | 15%    | 10%       | 45%   |
| Coding                    | 18%   | 12%    | 50%       | 20%   |
| Testing                   | 35%   | 15%    | 38%       | 12%   |
| Overall contribution      | 22.00% | 25.00% | 30.00%    | 23.00% |

### 1.5 Individual Contributions for Report Website

| Work packages               | Sagar | Sanchi | Shuaiting | Vivek |
| --------------------------- | ----- | ------ | --------- | ----- |
| Website Template and Setup  | 15%   | 40%    | 40%       | 5%    |
| Home                        | 5%    | 60%    | 25%       | 10%   |
| Video                       | 20%   | 40%    | 20%       | 20%   |
| Requirement                 | 10%   | 45%    | 45%       | 0%    |
| Research                    | 5%    | 65%    | 30%       | 0%    |
| UI Design                   | 0%    | 15%    | 10%       | 75%   |
| System Design               | 10%   | 40%    | 45%       | 5%    |
| Implementation              | 15%   | 30%    | 25%       | 30%   |
| Testing                     | 10%   | 0%     | 0%        | 90%   |
| Evaluation and Future Work  | 60%   | 5%     | 25%       | 10%   |
| User and Deployment Manuals | 5%    | 5%     | 45%       | 45%   |
| Legal Issues                | 95%   | 5%     | 0%        | 0%    |
| Blog and Monthly Video      | 5%    | 70%    | 20%       | 5%    |
| Overall contribution        | 22.00% | 24.50% | 30.00%    | 23.50% |

---

## 2. Critical Evaluation

### 2.1 User Experience

Cresco was built as a Single-Page Application, split into three primary components. The central area houses the chat pane and dashboard; the view can be toggled via a top navigation bar. We designed the program to be easily and intuitively navigable, so all functionality is clearly labelled with both text and relevant iconography, and ARIA labels have been applied to all interactive elements in order to facilitate further accesibility. The dashboard aggregates tasks, weather, important news, and field health into a single view for ease of use, with nested submenus eliminated. Two collapsible sidebars allow users to customise their context: the left-side pane centralises file management, whilst the right-side pane contains all of Cresco's auxiliary tools. In the left sidebar, files can be uploaded via either browsing or drag-and-drop, with supported extensions clearly indicated. The same panel is used to display a source count, and supports the deletion functionality. The right sidebar contains various informational modals, such as the drone analysis panel, which have been ordered by scope and dependency - the option to select a farm, for example, comes first in the list. Style is consistent, with icons being reused across related contexts, and standard keyboard shortcuts (e.g. Enter to send, Shift+Enter for newlines, Ctrl+Shift+⌫) implemented.

No formal accessibility audit was conducted when designing this project. The lack of streaming responses has been noted to affect the user experience - in periods of very high latency, users may wait up to 120 seconds with only a loading indicator, which could be improved with real-time token display.

### 2.2 Functionality

All requirements were delivered. The core chat system uses Retrieval-Augmented Generation, ensuring that answers are grounded in citations whenever possible, and aligned to the project's scope. User uploads are indexed similarly to the primary knowledge base, although the LLM is made aware of the distinction. The frontend parses structured `---TASKS---` and `---CHART---` blocks from LLM responses to render them as interactive inline UI components, falling back to plain text when parsing fails. Various LLM providers are supported through LangChain's provider-agnostic `init_chat_model` pattern, configurable via environment variables.

Drone image analysis computes NDVI, EVI, and SAVI vegetation indices from paired RGB and NIR images, with gallery storage, histogram visualisation within analyses, and time series charting. Satellite NDVI is fetched from Copernicus Sentinel-2 using the user's farm coordinates.

The internet search, toggled off by default, allows users to enable or disable real-time web search via Tavily. The LLM is instructed to use this capabillity as a secondary source of truth to its knowledge base, which allows it to supplement answers using more up-to-date information during conversation. Conversation management also includes persistent history across server restarts, which can either be cleared message-by-message or all at once.

The main functional limitation is that response quality depends on the chosen provider and model configuration. The system has not been designed to control for hallucination beyond grounding responses in the knowledge base.

### 2.3 Stability

The backend implements graceful error handling: failures are silently logged without blocking data saving, upstream API issues return HTTP 502, and parsing errors in rendering pipelines fall back to a plaintext display. Duplicate account registrations return HTTP 409 Conflict.

The test suite achieves 77.67%% coverage, with minima enforced by the CI pipeline throughout development. TDD practices were attempted during most sprints, but the frontend is much less thoroughly tested than the backend at 73.35% compared to 85.79%. All external services are mocked in tests, without real API calls being made, which might introduce flaws in the tests' design; however, they were written as much as possible not to be brittle. Conversation history persists across server restarts thanks to a PostgreSQL checkpointer.

The system lacks rate limiting, which does create a potential attack surface. The authors did not test its scaling under heavy abuse. A `/health` endpoint can be pinged, but is likely not sufficient for detailed performance monitoring.

### 2.4 Efficiency

The backend is fully asynchronous, using FastAPI async routes, `asyncio.gather()` for weather fetching, and async LangGraph integration via `.ainvoke()`. This allows handling of concurrent users without thread blocking.

The ChromaDB index is pre-built and baked into the Docker image, eliminating startup indexing time.

Timeouts are enforced whenever awaiting a process: 120 seconds for chat responses, and 10 seconds for weather and geocoding requests. However, it should be noted that these aren't made clear to the end user. The primary efficiency limitation is once again the lack of LLM streaming; some responses may take a while to process, when multiple tool calls or long passages are involved, which can cause the chat area to remain disabled for up to 120 seconds.

### 2.5 Compatibility

The frontend is built with React 19 + Vite and served via Nginx, working in all modern browsers - although no explicit support matrix has been provided for legacy browsers. However, considering the current internet landscape, this is highly unlikely to pose an issue. The backend targets Python 3.12 and the CI pipeline runs on Node 22. External APIs (OpenWeatherMap, Nominatim, Copernicus, Tavily) are all accessed through backend proxy endpoints, which may need updating in future.

The system supports multiple LLM providers through a provider-agnostic pattern, allowing deployment to be moved between them by changing two environment variables (`MODEL_PROVIDER`, `MODEL_NAME`). No code needs to be modified for this purpose. However, the RAG database relies on an embeddings model provided remotely by OpenAI; this aspect of the system would need to be entirely overhauled, were the dependency to become problematic in future. 

Docker-based deployment makes the system portable across any host, and all configuration is externalised via a single `.env` file.

### 2.6 Maintainability

Backend code quality is enforced by Ruff linting, with a minimum 80%+ test coverage enforced via pytest. Both are checked automatically by the CI pipeline on every pull request. The frontend uses ESLint with React hooks and refresh plugins. Testing conventions are standardised - all backend tests use class-based organisation with `asyncio_mode = "auto"`, and concerns are separated into various modules with clear responsibilities (auth, rag, db etc.) Issues were tracked on Github and all modifications to the master branch required a two-party PR.

### 2.7 Project Management

The team followed an agile methodology with two-week sprints and end-of-sprint demonstrations to the NTT DATA project liaison, Dr. Sanat Kumar Nagaraju. Feedback from each demo was incorporated into the next sprint's story, driving iterative additions such as the internet search toggle, dashboard, and inline chart generation.

Development was done across many feature branches, with all changes eventually submitted as pull requests and reviewed by a separate contributor. The team comprised four members, with responsibilities allocated and shared on a weekly basis depending on current needs. Communication channels were primarily staged over email, Github and WhatsApp, with Microsoft Teams used to schedule client meetings.

---

## 3. Future Work

**Streaming responses.** Implementing WebSocket streaming for LLM output was not achievable within project timelines, but would provide real-time feedback to users and significantly reduce perceived latency. This also falls in line with expected behaviour across other LLM platforms.

**Passive sensor integration.** With access to further datatsets, and review of the technologies currently in place, Cresco could be linked with IoT hardware such as soil sensors. This would allow a much wider array of information to be drawn and analysed for each farm, at a much more granular level of detail.

**Mobile application.** A Progressive Web App or native mobile application would enable field use without a laptop, allowing farmers to access insights whilst patrolling during growing season. Many of the foundations for a PWA are in place, but it was not fully solved by the development deadline.

**Plant disease detection.** Image tooling could be used to analyse crops for signs of pestilence or disease. This would require significant literature review and scoping, but would add an extremely useful layer of functionality to Cresco. An initial feasibility survey would cover existing solutions, algorithms and models trained for the purpose.

**Local LLM support.** This proved infeasible during development, but as more compute-efficient open-weight models are released, it may become possible to integrate on-device processing. This would provide absolute security and peace of mind regarding privacy concerns.

**Multi-language support.** Expanding interfaces to support Welsh and other languages would broaden accessibility for farmers across the UK.

**Rate limiting.** Adding API rate limiting would prevent abuse and ensure fair resource allocation across concurrent users.

**Advanced analytics.** Beyond reactive Q&A, the chatbot could be provided a tool to access drone/satellite context. This would allow it to extrapolate predictions and comment more broadly on the health of the field. However, the system would need scaffolding to make the raw numerical data more easily interpretable.

**Multi-farm support.** Allowing users to manage multiple farm locations with separate boundaries, weather data, and drone imagery would support farmers who operate across multiple sites.

**Collaborative features.** Shared accounts for farm managers and workers would enable team-based use, with role-based access to different components.

**Offline mode.** Caching advisory content and weather data locally would support use in rural areas, which often have poor network connectivity.