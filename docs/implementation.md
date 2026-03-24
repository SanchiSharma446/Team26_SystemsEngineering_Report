# Implementation

This section describes how the key features of Cresco are implemented, including the frameworks, libraries, and patterns used for each.

---

## 1. Authentication and Security

**Libraries:** PyJWT (HS256), bcrypt, FastAPI HTTPBearer

### 1.1 Backend

User registration hashes the password with bcrypt and stores it in the PostgreSQL `users` table. Login verifies the hash and issues a JWT.

```python
# auth/users.py
def create_user(username, password, *, is_admin=False):
    user_id = str(uuid.uuid4())
    conn.execute(
        "INSERT INTO users (id, username, password_hash, is_admin, created_at)"
        " VALUES (%s, %s, %s, %s, %s)",
        (user_id, username, hash_password(password), is_admin, datetime.now(timezone.utc).isoformat()),
    )
    return {"id": user_id, "username": username, "is_admin": is_admin}
```

JWT tokens are created with a 24-hour expiry using HS256. The payload contains `sub` (user ID), `username`, and `is_admin` claims.

```python
# auth/jwt.py
def create_access_token(user_id, username, *, is_admin=False):
    expire = datetime.now(timezone.utc) + timedelta(hours=settings.jwt_expiry_hours)
    payload = {"sub": user_id, "username": username, "is_admin": is_admin, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm="HS256")
```

Route protection uses FastAPI's dependency injection. The `get_current_user` dependency extracts the Bearer token, decodes it, and returns the user identity. Every protected route declares it via `Depends()`.

```python
# auth/dependencies.py
async def get_current_user(credentials = Depends(HTTPBearer())):
    payload = decode_token(credentials.credentials)
    return {"user_id": payload["sub"], "username": payload["username"],
            "is_admin": payload.get("is_admin", False)}

# routes.py — usage
@router.post("/chat")
async def chat(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    ...
```

All third-party API keys are stored server-side in `config.py` and never exposed to the frontend. External services (OpenWeatherMap, Nominatim, Copernicus) are proxied through backend endpoints using `httpx`, so the frontend never contacts them directly.

### 1.2 Frontend

The frontend stores the JWT in `localStorage` and attaches it to every request via the `authHeaders()` helper in `api.js`.

```javascript
// services/api.js
function authHeaders(extra = {}) {
    const headers = { 'Content-Type': 'application/json', ...extra };
    const token = localStorage.getItem('cresco_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}
```

If any API call returns 401 or 403, the frontend automatically clears the token and logs the user out, forcing re-authentication.

---

## 2. RAG-Powered Chat System

**Libraries:** LangChain, LangGraph, ChromaDB, langchain-openai (Azure OpenAI), langchain-tavily

### 2.1 Agent Architecture

The `CrescoAgent` class wraps a LangGraph agent with three tools:

1. **`retrieve_agricultural_info`** — searches the ChromaDB vector store for relevant documents, scoped to the shared knowledge base and the current user's uploads via a metadata filter.
2. **`get_weather_data`** — reads the user's cached weather and farm location from the PostgreSQL `farm_data` table.
3. **`TavilySearch`** — performs real-time internet search (conditionally included).

The agent pre-builds two LangGraph graphs at initialisation — one with internet search enabled and one without. The `chat()` method selects the appropriate graph at runtime based on the user's toggle, avoiding graph reconstruction on every request.

```python
# agent/agent.py
class CrescoAgent:
    def __init__(self, settings, checkpointer=None):
        self._agent_with_search = self._build_agent(include_internet_search=True)
        self._agent_no_search = self._build_agent(include_internet_search=False)

    async def chat(self, message, thread_id, user_id, enable_internet_search=True):
        agent = self._agent_with_search if enable_internet_search else self._agent_no_search
        result = await agent.ainvoke(
            {"messages": [{"role": "user", "content": message}]},
            {"configurable": {"thread_id": thread_id, "user_id": user_id}},
        )
        ...
```

### 2.2 Per-User Document Scoping

The retrieval tool uses ChromaDB's metadata filtering to return only shared knowledge base documents and the current user's uploads. Shared documents are tagged with `user_id = "__shared__"`, while user uploads are tagged with the user's UUID.

```python
# agent/agent.py — inside _build_agent()
@tool(response_format="content_and_artifact")
def retrieve_agricultural_info(query: str, config: RunnableConfig):
    user_id = config["configurable"].get("user_id", "")
    user_filter = {
        "$or": [
            {"user_id": "__shared__"},
            {"user_id": user_id},
        ]
    }
    retrieved_docs = vector_store.similarity_search(query, k=5, filter=user_filter)
    serialized = "\n\n".join(
        f"Source: {doc.metadata.get('filename', 'Unknown')}\n"
        f"Content: {doc.page_content}" for doc in retrieved_docs
    )
    return serialized, retrieved_docs
```

### 2.3 Conversation Memory

Conversation history persists across server restarts using `AsyncPostgresSaver` from `langgraph-checkpoint-postgres`. All messages, tool calls, and tool responses are serialised and keyed by `thread_id` (set to the user's ID). The `delete_last_exchange()` method uses LangGraph's `RemoveMessage` to surgically remove the last human message and all subsequent messages from the checkpoint.

### 2.4 Structured Output Parsing

The system prompt instructs the LLM to emit structured `---TASKS---` and `---CHART---` JSON blocks within its response. The `_parse_ai_content()` method extracts these blocks via string slicing and `json.loads()`, falling back to plain text if parsing fails.

```python
# agent/agent.py
@staticmethod
def _parse_ai_content(content):
    answer = str(content)
    tasks = []
    if "---TASKS---" in answer and "---END_TASKS---" in answer:
        task_json = answer[answer.index("---TASKS---") + 11 : answer.index("---END_TASKS---")].strip()
        tasks = json.loads(task_json)[:5]
        answer = answer[: answer.index("---TASKS---")].strip()
    # Similar extraction for ---CHART--- blocks
    return {"answer": answer, "tasks": tasks, "charts": charts}
```

The frontend renders tasks as colour-coded priority cards and charts via Recharts (bar, line, and pie charts), both inline within chat messages.

---

## 3. Document Upload and Indexing

**Libraries:** LangChain document loaders (TextLoader, PyPDFLoader), RecursiveCharacterTextSplitter, ChromaDB

### 3.1 Upload Flow

The `POST /upload` endpoint accepts a multipart file upload, validates the file extension (`.md`, `.pdf`, `.txt`, `.csv`, `.json`), saves it to the user's directory (`data/uploads/{user_id}/`), and triggers indexing.

### 3.2 Chunking and Indexing

Documents are loaded using the appropriate LangChain loader — `TextLoader` for text-based files and `PyPDFLoader` for PDFs. The `RecursiveCharacterTextSplitter` splits them into chunks of 1500 characters with 200-character overlap, using markdown-aware separators (section breaks, headers, paragraphs).

```python
# rag/document_loader.py
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1500, chunk_overlap=200,
    separators=["\n---\n", "\n## ", "\n### ", "\n\n", "\n", " "],
)
chunks = splitter.split_documents(documents)
```

Each chunk is tagged with metadata — `filename`, `category` (auto-detected from filename keywords), `user_id`, and `chunk_index` — then added to ChromaDB in batches of 100 with a 1-second delay between batches for rate limit protection.

```python
# rag/indexer.py
async def index_user_upload(settings, user_id, filename):
    documents = load_user_documents(settings.uploads_dir / user_id, filename=filename)
    for doc in documents:
        doc.metadata["user_id"] = user_id  # Tag with owning user
    chunks = split_documents(documents)
    vectorstore = get_vector_store()
    for i in range(0, len(chunks), BATCH_SIZE):
        vectorstore.add_documents(chunks[i : i + BATCH_SIZE])
        await asyncio.sleep(BATCH_DELAY)
```

### 3.3 Deletion

When a user deletes a file, the backend removes both the file from disk and its indexed chunks from ChromaDB by filtering on `user_id` and `filename` metadata.

---

## 4. Farm Location and Weather Integration

**Frontend libraries:** Leaflet, react-leaflet, @turf/area, @turf/helpers
**Backend libraries:** httpx, asyncio

### 4.1 Interactive Map

The `satellite.jsx` component renders a Leaflet map with a satellite tile layer. Users define their farm boundary by placing polygon vertices as draggable markers. Ghost markers appear at midpoints between vertices, allowing users to add new points by clicking. The polygon area is computed client-side using `@turf/area`.

A geocoding search bar lets users find locations by address or postcode. The search request is proxied through the backend (`GET /geocode/search`) to Nominatim, keeping the request server-side.

### 4.2 Weather Fetching

When farm data is saved, the backend automatically fetches weather data from OpenWeatherMap. The current conditions and 5-day forecast are fetched in parallel using `asyncio.gather()`, then cached in the `farm_data.weather` JSONB column.

```python
# api/routes.py
async def fetch_weather(user_id, lat, lon, api_key, pool):
    async with httpx.AsyncClient(timeout=10) as client:
        weather_resp, forecast_resp = await asyncio.gather(
            client.get("https://api.openweathermap.org/data/2.5/weather",
                        params={"lat": lat, "lon": lon, "units": "metric", "appid": api_key}),
            client.get("https://api.openweathermap.org/data/2.5/forecast",
                        params={"lat": lat, "lon": lon, "units": "metric", "appid": api_key}),
        )
    weather_dict = {"location": weather_resp.json().get("name"),
                    "current_weather": weather_resp.json(), "forecast": forecast_resp.json()}
    await db.update_farm_weather(pool, user_id, weather_dict)
```

Caching weather in the database serves a dual purpose: the frontend weather panel reads it directly, and the agent's `get_weather_data` tool accesses it without making an additional API call.

---

## 5. CI/CD and Deployment

**Tools:** GitHub Actions, Docker (multi-stage builds), Azure Container Registry, Azure Static Web Apps

### 5.1 CI Pipeline

The CI workflow (`.github/workflows/ci.yml`) runs on every pull request to `master`. Backend and frontend jobs execute in parallel.

The **backend job** spins up a PostgreSQL 17 service container, installs dependencies with `uv`, then runs Ruff linting, format checking, and pytest with 80% minimum coverage enforcement. The **frontend job** runs ESLint, Vitest tests, and a production build. If any step fails, the pipeline blocks the PR.

### 5.2 Deployment Pipeline

The deployment workflow (`.github/workflows/deploy.yml`) triggers on push to `master`. It runs the full CI suite as prerequisite jobs, then deploys both services in parallel.

**Backend deployment** builds a Docker image and pushes it to Azure Container Registry with both a SHA tag and a `latest` tag.

**Frontend deployment** builds with production environment variables injected via GitHub Secrets, then deploys the static build output to Azure Static Web Apps.

### 5.3 Docker Multi-Stage Builds

The backend Dockerfile uses a two-stage build to keep the runtime image minimal. The builder stage installs `uv` and resolves dependencies from the lockfile. The runtime stage copies only the virtual environment, application code, and the pre-built knowledge base and ChromaDB index.

```dockerfile
# backend/Dockerfile
FROM python:3.12-slim AS builder
RUN pip install uv
COPY pyproject.toml uv.lock ./
RUN uv sync --no-dev --frozen

FROM python:3.12-slim
COPY --from=builder /app/backend/.venv .venv
COPY cresco/ cresco/
COPY data/knowledge_base/ data/knowledge_base/
COPY data/chroma_db/ data/chroma_db/
CMD ["gunicorn", "cresco.main:app", "-w", "2", "-k", "uvicorn.workers.UvicornWorker",
     "--bind", "0.0.0.0:8000", "--timeout", "120"]
```

The frontend Dockerfile builds with Node 20 Alpine, then copies the static output to an Nginx 1.27 Alpine image. Nginx serves the SPA assets and reverse-proxies `/api/` requests to the backend container.

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS build
RUN npm ci && npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
```

A `docker-compose.yml` at the project root provides a PostgreSQL 17 database for local development, with a health check and a named volume for data persistence.

---

## 6. Drone Image Analysis

**Backend libraries:** NumPy, Rasterio, Pillow, Matplotlib

### 6.1 Vegetation Index Computation

The `POST /droneimage` endpoint accepts two image files — an RGB image and a near-infrared (NIR) image — and a query parameter selecting the vegetation index type (`ndvi`, `evi`, or `savi`).

Rasterio reads the individual colour bands from each image and normalises pixel values to the 0–1 range. The system ensures dimension alignment by cropping to the smallest common dimensions when images are slightly misaligned. The selected vegetation index is then computed per-pixel using NumPy array operations.

```python
# scripts/drone_image.py
red, green, blue, nir = _read_and_normalize_bands(rgb_path, nir_path)
red, green, blue, nir = _ensure_dimension_match(red, green, blue, nir)

# NDVI = (NIR - Red) / (NIR + Red)
ndvi = np.where((nir + red) == 0.0, 0, (nir - red) / (nir + red))
```

EVI and SAVI follow similar formulas with additional correction factors. The resulting index array (values in [-1, 1]) is normalised, false-coloured using Matplotlib's `RdYlGn` colourmap, and converted to a PNG image via Pillow.

### 6.2 Gallery and Metadata

Each computed image is saved to disk with a UUID filename and registered in a JSON metadata file (`images_metadata.json`). The metadata includes the index type, source filenames, timestamp, histogram data, and the owning `user_id` for per-user scoping.

The frontend drone gallery (`DroneGallerySection.jsx`) fetches the image list via `GET /images`, supports filtering by index type, displays histograms using Recharts, and allows editing timestamps and deleting images.

### 6.3 Time Series

The `DroneTimeSeriesSection.jsx` component aggregates NDVI values across a user's drone images over time. It classifies pixels into health categories (unhealthy, moderate, healthy) based on index thresholds and renders a stacked bar chart showing vegetation health distribution per capture date, allowing farmers to track field health trends.

---

## 7. Satellite NDVI Imagery

**Backend libraries:** Requests, Pillow, requests-toolbelt

### 7.1 Copernicus Integration

The `POST /satellite-image` endpoint fetches Sentinel-2 satellite imagery from the Copernicus Data Space. The backend authenticates with Copernicus using OAuth2 client credentials, constructs a bounding box around the user's farm coordinates, and requests both a true-colour (RGB) and a near-infrared band image for the most recent cloud-free acquisition.

```python
# scripts/satellite_image.py
def get_access_token(client_id, client_secret):
    response = requests.post(
        "https://identity.dataspace.copernicus.eu/.../token",
        data={"grant_type": "client_credentials",
              "client_id": client_id, "client_secret": client_secret},
    )
    return response.json()["access_token"]
```

The returned GeoTIFF images are converted to PNG via Pillow and then processed through the same NDVI computation pipeline used for drone images. The result is streamed back to the frontend as a PNG response.

### 7.2 Frontend Display

The `satellite_imagery.jsx` component triggers the satellite image fetch, displays a loading state while the backend processes the request, and renders the returned NDVI image. The farm location must be set before satellite imagery is available, as the backend reads coordinates from the user's `farm_data` record.

---

## 8. Frontend Chat Rendering

**Libraries:** react-markdown, remark-gfm, remark-math, rehype-katex, Recharts

### 8.1 Markdown and LaTeX

AI responses are rendered using `react-markdown` with three plugins: `remark-gfm` for GitHub Flavoured Markdown (tables, strikethrough, task lists), `remark-math` for math notation parsing, and `rehype-katex` for LaTeX rendering. This allows the agent to include formatted tables, equations, and structured text in its responses.

```jsx
// layout/ChatArea.jsx
<ReactMarkdown
    remarkPlugins={[remarkGfm, remarkMath]}
    rehypePlugins={[rehypeKatex]}
    components={{ table: (props) => <table className={styles['markdown-table']} {...props} /> }}
>
    {msg.content}
</ReactMarkdown>
```

### 8.2 Inline Chart Rendering

Charts are rendered inline within the message text at the position specified by the agent. The `ChatArea` component sorts charts by their `position` property, splits the message text at each chart position, and interleaves markdown segments with `ChartRenderer` components.

The `ChartRenderer` component wraps Recharts and supports four chart types: bar, stacked bar, line (with multi-series support), and pie/donut. The chart type, data, and axis keys are specified by the agent's `---CHART---` JSON block.

```jsx
// ChartRenderer.jsx
const ChartRenderer = ({ chartData, chartType, xKey = 'name', yKey = 'value', height = 300 }) => {
  switch (chartType) {
    case 'bar':
      return <ResponsiveContainer><BarChart data={chartData}>...</BarChart></ResponsiveContainer>;
    case 'line':
      return <ResponsiveContainer><LineChart data={chartData}>...</LineChart></ResponsiveContainer>;
    case 'pie':
      return <ResponsiveContainer><PieChart>...</PieChart></ResponsiveContainer>;
  }
};
```

### 8.3 Task Cards

When the agent includes a `---TASKS---` block, the parsed tasks are rendered as colour-coded priority cards below the message. Each card displays a title, detail description, and a priority tag (`high` in red, `medium` in amber, `low` in green). Tasks are also aggregated in the Dashboard view for a cross-conversation overview.
