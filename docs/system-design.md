# System Design

## 1. System Architecture

### 1.1 Architecture Diagram

```mermaid
graph TB
    subgraph Client ["Client (Browser)"]
        SPA["React 19 SPA"]
    end

    subgraph Frontend ["Frontend Container"]
        Nginx["Nginx 1.27"]
    end

    subgraph Backend ["Backend Container"]
        API["FastAPI + Gunicorn"]
        Agent["LangGraph Agent"]
    end

    subgraph Storage ["Data Layer"]
        PG["PostgreSQL 17"]
        Chroma["ChromaDB"]
        FS["File System"]
    end

    subgraph External ["External Services"]
        LLM["LLM Provider"]
        OWM["OpenWeatherMap"]
        Nom["Nominatim"]
        Cop["Copernicus"]
        Tav["Tavily Search"]
    end

    SPA <-->|"HTTP"| Nginx
    Nginx -->|"Static assets"| SPA
    Nginx -->|"/api/* proxy"| API
    API --> Agent
    API <--> PG
    API <--> FS
    Agent <--> Chroma
    Agent <--> PG
    Agent --> LLM
    Agent --> Tav
    API --> OWM
    API --> Nom
    API --> Cop
```

### 1.2 Component Descriptions

| Component               | Technology                                                      | Responsibility                                                                                                                                                                    |
| ----------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend SPA            | React 19, Vite                                                  | Single-page application providing the chat interface, dashboard, interactive map, and drone/satellite imagery panels.                                                             |
| Reverse Proxy           | Nginx 1.27 Alpine                                               | Serves static frontend assets and proxies `/api/` requests to the backend. Handles SPA routing via `try_files $uri /index.html`.                                                  |
| API Server              | FastAPI, Gunicorn (2 Uvicorn workers, 120s timeout)             | REST API layer handling authentication, file management, farm data CRUD, and proxying third-party API calls. All external API calls are made server-side.                         |
| AI Agent                | LangGraph, LangChain                                            | RAG-powered conversational agent with three tools: knowledge base retrieval, weather data, and optional internet search. Parses structured task and chart blocks from LLM output. |
| Vector Store            | ChromaDB                                                        | Stores document embeddings for similarity search. Pre-built index baked into the Docker image; user uploads indexed at runtime with per-user metadata scoping.                    |
| Database                | PostgreSQL 17                                                   | Stores user accounts, farm data (with JSONB for polygon nodes and weather), and LangGraph conversation checkpoints. Accessed via an async connection pool (min 2, max 10).        |
| File System             | Docker volumes                                                  | Stores user-uploaded documents (`data/uploads/{user_id}/`) and computed drone vegetation index images (`data/ndvi_images/`).                                                      |
| LLM Provider            | Azure OpenAI (default), OpenAI, Google GenAI, Anthropic, Ollama | Provides chat model inference and text embeddings. Configurable via `MODEL_PROVIDER` and `MODEL_NAME` environment variables.                                                      |
| OpenWeatherMap          | REST API                                                        | Supplies current weather conditions and 5-day forecasts for farm coordinates.                                                                                                     |
| Nominatim               | REST API (OpenStreetMap)                                        | Forward geocoding (address to coordinates) and reverse geocoding (coordinates to place name).                                                                                     |
| Copernicus Sentinel Hub | REST API                                                        | Fetches Sentinel-2 satellite imagery for server-side NDVI computation.                                                                                                            |
| Tavily Search           | LangChain tool                                                  | Real-time internet search, conditionally included in the agent's tool set based on user toggle.                                                                                   |

---

## 2. Site Map

```mermaid
graph TD
    Auth["Authentication Page"]
    Auth -->|"JWT issued"| Main

    subgraph Main ["Main Application"]
        direction TB
        Chat["Chat View (default tab)"]
        Dash["Dashboard View (tab)"]
        SL["Left Sidebar: Document Management"]
        SR["Right Sidebar: Toolbox"]
    end

    subgraph Modals ["Modal Overlays"]
        Farm["Farm Location<br/>(Leaflet map, polygon drawing, geocoding)"]
        Weather["Weather<br/>(5-day forecast cards + chart)"]
        Drone["Drone Imagery<br/>(upload RGB+NIR, gallery, time series)"]
        Sat["Satellite Imagery<br/>(Sentinel-2 NDVI viewer)"]
    end

    SR --> Farm
    SR --> Weather
    SR --> Drone
    SR --> Sat
```

**Authentication Page** — Login and registration forms. On successful authentication, a JWT is stored in `localStorage` and the user is redirected to the main application.

**Chat View** — Default view. Displays the message history with markdown rendering, inline Recharts charts, colour-coded task cards, and source citations. The input area includes a text field and an internet search toggle.

**Dashboard View** — Accessible via a tab. Aggregates 5-day weather forecast, seasonal context, active tasks from chat responses, and a field health NDVI chart from drone imagery history.

**Left Sidebar** — Document management panel. Supports file upload (click or drag-and-drop) for `.md`, `.pdf`, `.txt`, `.csv`, and `.json` files. Lists uploaded files with type icons and deletion controls.

**Right Sidebar** — Toolbox with buttons for Farm Location, Weather, Drone Monitoring, Satellite Imagery, and Web Search toggle. Each button opens its corresponding modal overlay.

**Modal Overlays** — Full-screen overlays for interactive tools: farm polygon drawing on a satellite map, weather forecast display, drone image upload and gallery, and satellite NDVI viewer.

---

## 3. Sequence Diagrams

### 3.1 User Authentication

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant DB as PostgreSQL

    U->>F: Enter username + password
    F->>B: POST /api/v1/auth/login
    B->>DB: Query users table (username)
    DB-->>B: User record (id, password_hash)
    B->>B: Verify bcrypt hash
    B->>B: Create JWT (HS256, 24h expiry)
    B-->>F: TokenResponse {access_token, username}
    F->>F: Store token in localStorage
    F->>B: GET /api/v1/uploads (Bearer token)
    F->>B: GET /api/v1/chat/history (Bearer token)
    F->>B: GET /api/v1/farm-data (Bearer token)
    B-->>F: User's files, history, farm data
```

### 3.2 Chat with RAG

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant A as LangGraph Agent
    participant C as ChromaDB
    participant DB as PostgreSQL
    participant LLM as LLM Provider
    participant T as Tavily

    U->>F: Type message, click Send
    F->>B: POST /api/v1/chat {message, enable_internet_search}
    B->>A: agent.chat(message, user_id, enable_internet_search)
    A->>A: Select graph (with/without search)
    A->>C: retrieve_agricultural_info(query, user_id)
    C-->>A: Top 5 documents (shared + user-scoped)
    A->>DB: get_weather_data(user_id)
    DB-->>A: Farm location + weather JSON
    opt Internet search enabled
        A->>T: TavilySearch(query)
        T-->>A: Search results
    end
    A->>LLM: System prompt + tools output + user message
    LLM-->>A: Response with optional ---TASKS--- and ---CHART--- blocks
    A->>A: _parse_ai_content() extracts answer, tasks, charts
    A->>A: Extract source filenames from tool artifacts
    A-->>B: {answer, sources, tasks, charts}
    B-->>F: ChatResponse
    F->>F: Render markdown, charts, tasks, citations
```

### 3.3 File Upload and Indexing

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant FS as File System
    participant C as ChromaDB
    participant E as Embedding Model

    U->>F: Drop or select file (.md/.pdf/.txt/.csv/.json)
    F->>B: POST /api/v1/upload (multipart form)
    B->>B: Validate file extension
    B->>FS: Save to data/uploads/{user_id}/{filename}
    B->>B: Load document (TextLoader or PyPDFLoader)
    B->>B: Split into chunks (1500 chars, 200 overlap)
    B->>B: Add metadata (filename, category, user_id)
    loop Each batch of 100 chunks
        B->>E: Generate embeddings
        E-->>B: Embedding vectors
        B->>C: Add to cresco_knowledge_base collection
    end
    B-->>F: FileUploadResponse {filename, status, chunks_indexed}
    F->>F: Add file to sidebar list
```

### 3.4 Farm Location and Weather

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Leaflet + Turf.js)
    participant B as Backend API
    participant DB as PostgreSQL
    participant N as Nominatim
    participant W as OpenWeatherMap

    U->>F: Draw polygon on satellite map
    F->>F: Calculate area via @turf/area
    opt Address search
        F->>B: GET /api/v1/geocode/search?q=...
        B->>N: Forward geocoding request
        N-->>B: Coordinates + place name
        B-->>F: Search results
    end
    U->>F: Click Save
    F->>B: POST /api/v1/farm-data {location, area, lat, lon, nodes}
    B->>DB: INSERT/UPDATE farm_data
    B->>W: GET /weather (current) + GET /forecast (5-day)
    Note over B,W: Parallel requests via asyncio.gather()
    W-->>B: Weather JSON + Forecast JSON
    B->>DB: UPDATE farm_data SET weather = ...
    B-->>F: {message, data}
    F->>F: Update farm location state
```

---

## 4. Design Patterns

### 4.1 Singleton

Two singleton variants are used to ensure expensive resources are initialised once per process.

**LRU cache singleton** (`config.py`): The `get_settings()` function uses `@lru_cache` to create a single `Settings` instance. Tests reset it via `get_settings.cache_clear()`.

**Module-level singleton** (`agent.py`, `embeddings.py`, `retriever.py`): A module-level `_variable = None` is lazily initialised by a `get_*()` function. This pattern is used for the `CrescoAgent`, `AzureOpenAIEmbeddings`, `Chroma` vector store, and retriever instances. Tests reset them by setting the module variable to `None`.

### 4.2 Factory

`create_app()` in `main.py` is a factory function that constructs and returns a fully configured FastAPI application with CORS middleware, routers, and a lifespan manager. This separates application construction from the module-level `app` instance, enabling test clients to create isolated app instances.

### 4.3 Strategy

The `CrescoAgent` pre-builds two LangGraph agents at initialisation: `_agent_with_search` (includes Tavily) and `_agent_no_search` (excludes Tavily, appends a "search disabled" addendum to the prompt). The `chat()` method selects the appropriate agent at runtime based on the user's `enable_internet_search` flag, avoiding the overhead of rebuilding the graph on every request.

### 4.4 Dependency Injection

FastAPI's `Depends()` mechanism injects shared resources into route handlers:

- `get_db_pool(request)` — extracts the async connection pool from `app.state`
- `get_agent_dep(request)` — passes the checkpointer from `app.state` to `get_agent()`
- `get_current_user(credentials)` — validates the JWT Bearer token and returns user identity
- `get_current_admin(current_user)` — chains on `get_current_user` and enforces admin role
- `get_settings()` — injects the cached settings instance

This allows routes to declare their dependencies declaratively and enables tests to override them via `app.dependency_overrides`.

### 4.5 Proxy

All third-party API calls (OpenWeatherMap, Nominatim, Copernicus) are proxied through backend endpoints using `httpx.AsyncClient`. The frontend never contacts external services directly. This keeps API keys server-side (NFR-02) and provides a single point for timeout enforcement, error handling, and response transformation.

### 4.6 Repository

The `db.py` module provides a functional repository interface over PostgreSQL. Async functions (`save_farm_data`, `get_farm_data`, `update_farm_weather`) accept a connection pool as the first argument and encapsulate all SQL queries. A separate sync function (`get_farm_data_sync`) serves the agent tool, which runs in a LangGraph thread pool where async calls are not available.

---

## 5. Class Diagrams

### 5.1 Backend Classes

```mermaid
classDiagram
    direction TB

    class Settings {
        +model_provider: str
        +model_name: str
        +embedding_model: str
        +azure_openai_endpoint: str
        +azure_openai_api_version: str
        +azure_openai_deployment: str
        +azure_openai_embedding_deployment: str
        +chroma_persist_dir: str
        +knowledge_base_path: str
        +uploads_path: str
        +api_host: str
        +api_port: int
        +debug: bool
        +allowed_origins: str
        +jwt_secret_key: str
        +jwt_expiry_hours: int
        +database_url: str
        +openweather_api_key: str
        +COPERNICUS_CLIENT_ID: str
        +COPERNICUS_CLIENT_SECRET: str
        +cors_origins: list~str~
        +chroma_path: Path
        +knowledge_base: Path
        +uploads_dir: Path
    }
    Settings --|> BaseSettings

    class CrescoAgent {
        +settings: Settings
        +vector_store: Chroma
        +checkpointer: BaseSaver
        -_agent_with_search: CompiledGraph
        -_agent_no_search: CompiledGraph
        +chat(message, thread_id, user_id, enable_internet_search) dict
        +get_history(thread_id, user_id) list~dict~
        +delete_last_exchange(thread_id, user_id) bool
        +clear_history(thread_id, user_id) bool
        +clear_memory(thread_id) None
        -_build_agent(include_internet_search) CompiledGraph
        -_parse_ai_content(content)$ dict
    }
    CrescoAgent --> Settings
    CrescoAgent --> Chroma

    class Chroma {
        +persist_directory: str
        +collection_name: str
        +embedding_function: Embeddings
        +similarity_search(query, k, filter) list~Document~
    }
```

### 5.2 Pydantic Request/Response Models

```mermaid
classDiagram
    direction LR

    class RegisterRequest {
        +username: str
        +password: str
        +is_admin: bool
    }

    class LoginRequest {
        +username: str
        +password: str
    }

    class TokenResponse {
        +access_token: str
        +token_type: str
        +username: str
    }

    class UserInfo {
        +id: str
        +username: str
    }

    class ChatRequest {
        +message: str
        +conversation_id: str | None
        +files: list~dict~ | None
        +enable_internet_search: bool
    }

    class ChatResponse {
        +answer: str
        +sources: list~str~
        +tasks: list~dict~
        +charts: list~dict~
        +conversation_id: str | None
    }

    class HistoryMessage {
        +role: str
        +content: str
        +tasks: list~dict~
        +charts: list~dict~
    }

    class FarmData {
        +location: str
        +area: float
        +lat: float | None
        +lon: float | None
        +nodes: list~dict~ | None
    }

    class FileUploadResponse {
        +filename: str
        +status: str
        +chunks_indexed: int
    }

    class HealthResponse {
        +status: str
        +version: str
        +knowledge_base_loaded: bool
    }
```

### 5.3 Frontend Component Hierarchy

```mermaid
classDiagram
    direction TB

    class App {
        +authenticated: bool
        +messages: list
        +files: list
        +conversationId: string
        +farmLocation: object
        +internetSearchEnabled: bool
        +leftCollapsed: bool
        +rightCollapsed: bool
    }

    class Header {
        +onLogout()
        +onDeleteAccount()
        +username: string
    }

    class SidebarLeft {
        +files: list
        +onUpload(files)
        +onRemove(index)
        +onCollapse()
    }

    class ChatArea {
        +messages: list
        +onSendMessage(text, search)
        +onDeleteLastExchange()
        +onClearHistory()
        +isLoading: bool
        +internetSearchEnabled: bool
    }

    class SidebarRight {
        +handleOpenSatellite()
        +handleOpenWeather()
        +handleOpenDroneImagery()
        +handleOpenSatelliteImagery()
        +internetSearchEnabled: bool
        +toggleWebSearch()
    }

    class ChartRenderer {
        +chartData: list
        +chartType: string
        +xKey: string
        +yKey: string
    }

    class SatelliteMap {
        +farmLocation: object
        +setFarmLocation()
    }

    class Weather {
        +lat: number
        +lon: number
    }

    App --> Header
    App --> SidebarLeft
    App --> ChatArea
    App --> SidebarRight
    App --> SatelliteMap
    App --> Weather
    ChatArea --> ChartRenderer
    ChatArea --> Dashboard
```

---

## 6. Data Storage

### 6.1 PostgreSQL

PostgreSQL 17 stores relational data across two application tables and auto-generated LangGraph checkpointer tables.

**Table: `users`**

```sql
CREATE TABLE users (
    id            TEXT PRIMARY KEY,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL
);
```

Passwords are hashed with bcrypt before storage. The `id` field is a UUID generated at registration time.

**Table: `farm_data`**

```sql
CREATE TABLE farm_data (
    user_id  TEXT PRIMARY KEY,
    location TEXT,
    area     DOUBLE PRECISION,
    lat      DOUBLE PRECISION,
    lon      DOUBLE PRECISION,
    nodes    JSONB,
    weather  JSONB
);
```

The `nodes` column stores the farm polygon boundary as a JSONB array of `{lat, lng}` objects. The `weather` column caches the most recent OpenWeatherMap response (current conditions and 5-day forecast) to make it available to the agent's weather tool without an API call.

**LangGraph Checkpointer Tables** — Auto-created by `AsyncPostgresSaver.setup()`. Stores serialised conversation state (all messages, tool calls, and tool responses) keyed by `thread_id`, enabling conversation persistence across server restarts.

### 6.2 ChromaDB

ChromaDB provides the vector store for Retrieval-Augmented Generation.

| Property           | Value                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| Collection         | `cresco_knowledge_base`                                                                             |
| Embedding model    | Azure OpenAI `text-embedding-ada-002` (configurable)                                                |
| Chunk size         | 1500 characters, 200 character overlap                                                              |
| Splitter           | `RecursiveCharacterTextSplitter` with separators: section breaks, headers, paragraphs, lines, words |
| Search type        | MMR (Maximum Marginal Relevance), k=5, fetch_k=10                                                   |
| Metadata per chunk | `filename`, `category`, `user_id`, `chunk_index`                                                    |

Document scoping uses the `user_id` metadata field. Shared knowledge base documents are tagged with `user_id = "__shared__"`. User uploads are tagged with the user's UUID. The retrieval tool filters with `$or: [user_id == "__shared__", user_id == current_user]` to return both shared and user-specific documents.

### 6.3 File System

| Path                      | Contents                                                       | Lifecycle                                                        |
| ------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------- |
| `data/knowledge_base/`    | Shared agricultural knowledge base documents (.md, .pdf, .txt) | Baked into Docker image at build time                            |
| `data/chroma_db/`         | Pre-built ChromaDB index over the knowledge base               | Baked into Docker image at build time                            |
| `data/uploads/{user_id}/` | User-uploaded documents                                        | Created at runtime; deleted on file removal or account deletion  |
| `data/ndvi_images/`       | Computed drone vegetation index images with JSON metadata      | Created at runtime; deleted on image removal or account deletion |

---

## 7. Packages and APIs

### 7.1 Key Packages

**Backend (Python 3.12):**

| Package                        | Version                 | Purpose                                                      |
| ------------------------------ | ----------------------- | ------------------------------------------------------------ |
| fastapi                        | >= 0.115                | Async REST API framework                                     |
| gunicorn + uvicorn             | >= 22.0, >= 0.32        | Production ASGI server (2 Uvicorn workers, 120s timeout)     |
| langchain + langgraph          | >= 0.3, >= 0.2          | LLM orchestration and graph-based agent with tool use        |
| langchain-openai               | >= 0.2                  | Azure OpenAI and OpenAI chat model and embedding integration |
| langchain-chroma + chromadb    | >= 0.1, >= 0.5          | Vector store for RAG document retrieval                      |
| langchain-tavily               | >= 0.2                  | Internet search tool for the agent                           |
| psycopg[binary,pool]           | >= 3.2                  | Async PostgreSQL driver with connection pooling              |
| langgraph-checkpoint-postgres  | >= 2.0                  | LangGraph conversation state persistence in PostgreSQL       |
| pyjwt[crypto] + bcrypt         | >= 2.8, >= 4.1          | JWT token creation/validation and password hashing           |
| httpx                          | >= 0.27                 | Async HTTP client for proxying third-party APIs              |
| rasterio + pillow + matplotlib | >= 1.3, >= 10.0, >= 3.0 | Drone and satellite image processing                         |
| pydantic-settings              | >= 2.0                  | Environment variable configuration via `.env`                |
| pypdf                          | >= 4.0                  | PDF document loading for the knowledge base                  |

**Frontend (Node 22):**

| Package                         | Version   | Purpose                                             |
| ------------------------------- | --------- | --------------------------------------------------- |
| react + react-dom               | 19.2      | UI framework                                        |
| vite                            | 7.2       | Build tool and development server                   |
| leaflet + react-leaflet         | 1.9, 5.0  | Interactive satellite map with polygon drawing      |
| recharts                        | 3.7       | Chart rendering (bar, line, pie) inline in chat     |
| react-markdown                  | 10.1      | Markdown rendering for AI responses                 |
| remark-gfm + remark-math        | 4.0, 6.0  | GitHub Flavoured Markdown and math notation plugins |
| rehype-katex + katex            | 7.0, 0.16 | LaTeX math typesetting                              |
| @turf/area + @turf/helpers      | —         | GeoJSON polygon area calculation                    |
| lucide-react                    | 0.562     | Icon library                                        |
| vitest + @testing-library/react | 4.0, 16.3 | Unit testing framework                              |

### 7.2 API Endpoints

All endpoints are served under `/api/v1`. Endpoints marked with a lock require a valid JWT Bearer token.

**Authentication**

| Method | Path             | Description                 | Auth |
| ------ | ---------------- | --------------------------- | ---- |
| POST   | `/auth/register` | Create account, returns JWT | No   |
| POST   | `/auth/login`    | Authenticate, returns JWT   | No   |
| DELETE | `/auth/me`       | Delete own account          | Yes  |

**Chat**

| Method | Path                  | Description                                                 | Auth |
| ------ | --------------------- | ----------------------------------------------------------- | ---- |
| POST   | `/chat`               | Send message, returns AI response with tasks/charts/sources | Yes  |
| GET    | `/chat/history`       | Fetch full conversation history                             | Yes  |
| DELETE | `/chat/history`       | Clear all conversation history                              | Yes  |
| DELETE | `/chat/last-exchange` | Remove the last question-answer pair                        | Yes  |

**Farm Data**

| Method | Path         | Description                           | Auth |
| ------ | ------------ | ------------------------------------- | ---- |
| POST   | `/farm-data` | Save farm location, polygon, and area | Yes  |
| GET    | `/farm-data` | Retrieve saved farm data              | Yes  |

**Weather and Geocoding**

| Method | Path                         | Description                                                            | Auth |
| ------ | ---------------------------- | ---------------------------------------------------------------------- | ---- |
| GET    | `/weather?lat=&lon=`         | Fetch current weather and 5-day forecast (proxied from OpenWeatherMap) | Yes  |
| GET    | `/geocode/search?q=`         | Forward geocoding (proxied from Nominatim)                             | Yes  |
| GET    | `/geocode/reverse?lat=&lon=` | Reverse geocoding (proxied from Nominatim)                             | Yes  |

**File Management**

| Method | Path                 | Description                         | Auth |
| ------ | -------------------- | ----------------------------------- | ---- |
| POST   | `/upload`            | Upload and auto-index a document    | Yes  |
| GET    | `/uploads`           | List uploaded files                 | Yes  |
| DELETE | `/upload/{filename}` | Delete file and its ChromaDB chunks | Yes  |

**Drone Imagery**

| Method | Path                           | Description                                       | Auth |
| ------ | ------------------------------ | ------------------------------------------------- | ---- |
| POST   | `/droneimage?index_type=`      | Upload RGB + NIR images, compute vegetation index | Yes  |
| GET    | `/images`                      | List saved drone analysis images                  | Yes  |
| GET    | `/images/{filename}`           | Retrieve a specific drone image                   | Yes  |
| DELETE | `/images/{filename}`           | Delete a drone image                              | Yes  |
| PATCH  | `/images/{filename}/timestamp` | Edit the capture timestamp                        | Yes  |

**Satellite and System**

| Method | Path               | Description                                 | Auth |
| ------ | ------------------ | ------------------------------------------- | ---- |
| POST   | `/satellite-image` | Fetch Sentinel-2 NDVI for farm coordinates  | Yes  |
| POST   | `/index`           | Re-index the knowledge base                 | Yes  |
| GET    | `/health`          | Health check                                | No   |
| DELETE | `/account`         | Delete user account and all associated data | Yes  |

### 7.3 External API Integrations

| API                                        | Purpose                                  | Backend Access Point                                              | Auth Method                             |
| ------------------------------------------ | ---------------------------------------- | ----------------------------------------------------------------- | --------------------------------------- |
| OpenWeatherMap                             | Current weather and 5-day forecast       | `GET /weather` proxied via `httpx`                                | API key (server-side)                   |
| Nominatim (OpenStreetMap)                  | Forward and reverse geocoding            | `GET /geocode/search`, `GET /geocode/reverse` proxied via `httpx` | None (User-Agent header)                |
| Copernicus Sentinel Hub                    | Sentinel-2 satellite imagery for NDVI    | `POST /satellite-image` via `satellite_image.py`                  | OAuth2 client credentials               |
| Tavily Search                              | Real-time internet search within agent   | Invoked as a LangGraph tool (no direct endpoint)                  | API key (server-side)                   |
| Azure OpenAI                               | Chat model inference and text embeddings | Invoked within `CrescoAgent` and `get_embeddings()`               | API key (server-side)                   |
| OpenAI / Google GenAI / Anthropic / Ollama | Alternative LLM providers                | Invoked within `CrescoAgent` via `init_chat_model()`              | Provider-specific API key (server-side) |
