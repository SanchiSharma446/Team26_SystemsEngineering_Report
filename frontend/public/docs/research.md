# Research

## 1. Related Projects Review

When building the initial requirements list at the beginning of the project, we began researching existing agricultural technology platforms and AI-powered farm management tools that could inform our design and implementation. Below, we have detailed two products that we were able to draw insights from. 

### 1.1 FarmerChat Digital Green and Gooey.AI

<p>
	<img src="/docs/images/FarmerChat1.png" alt="FarmerChat screenshot 1" width="220" />
	<img src="/docs/images/farmerchat2.png" alt="FarmerChat screenshot 2" width="220" />
</p>

Farmer.Chat is a GPT-4-based, multilingual AI platform developed by Digital Green and Gooey.AI. It is designed to provide smallholder farmers and agricultural extension workers with data-driven insights and decision-making tools for crop management through the a familiar looking interface of WhatsApp. It uses Retrieval Augmented Generation (RAG) to integrate a big library of agricultural info, such as training video transcripts, call centre logs, and crop research factsheets, to answer farmer queries accurately and in context. Farmers can interact via text, voice notes, or photos, and receive real-time weather-integrated advice, pest forecasts, and market prices in their local language.

| Main Features  | What We Learnt |
| --- | --- |
| RAG-based knowledge retrieval from curated agricultural sources | Confirmed RAG as a viable architecture for domain-specific agricultural Q&A at scale |
| Responses cite their sources | Citing sources is important for farmer trust. |
| Weather and market price integration | One, this is something that farmers want. Two, teal-time external data meaningfully improves the relevance of advice.  |
| Multilingual voice and image input | Accessibility of input format matters for the target demographic |
| Conversational chatbot interface | A chat interface is sufficient for complex farm queries without needing a heavy UI. Ui needs to be simple and familiar to existing solutions (in the case of FarmerChat, Whatsapp.) |

### 1.2 OneSoil

<p>
	<img src="/docs/images/onesoil1.png" alt="OneSoil screenshot 1" width="220" />
	<img src="/docs/images/onesoil2.png" alt="OneSoil screenshot 2" width="220" />
</p>

Meanwhile, OneSoil is a precision agriculture app that leverages satellite technology and ML to provide farmers with quantitative insights for optimised crop management, field monitoring, plant health analysis, and variable rate application planning. Farmers can add field boundaries and then analyse NDVI vegetation indices, growing degree-days, and precipitation charts to monitor and manage their crops remotely. Used by over 300,000 farmers worldwide, the platform is free to access and covers around 5% of the world's arable land. It is not an AI powered platform, but we looked into this to understand the satellite and drone imagery processing sections of our solution better.

| Main Features  | What We Learnt |
| --- | --- |
| Field boundary detection via satellite imagery | Field boundary data is central to contextualising any farm-specific tool |
| NDVI and vegetation index mapping | NDVI is a well-established, practical metric for remote crop health monitoring. |
| Data visualisation dashboard. | Useful for displaying field data, but lacks any conversational or advisory layer. FarmerChat had something similar, thus we should look to have a dashboard.  |


When designing Cresco's data features, we wanted the information gathered to be in context with the farm. Therefore, we first researched the range of tools modern farmers use to collect field data. Precision agriculture tools broadly include satellite imagery, drones, IoT sensors, and weather stations. These are all used to then collect data on crop health, soil conditions, and environmental factors. More specifically, IoT sensors can collect metrics across the field microclimate including lighting, temperature, soil condition, humidity, CO2 levels, and pest infections, while drones can be used for crop monitoring, spraying, and soil analysis, providing a bird's-eye view of large farm areas to help farmers make informed decisions.

However, many of these tools, especially IoT sensor networks, required significant upfront investment in hardware and infrastructure and their data was often hard to interpret, making them inaccessible to smaller farms. Considering our solution was aimed towards small/medium scale farms, we needed to focus on a data collection method that was both widely available and high in informational value. Multispectral drone imagery stood out as the most practical option to us as drones are increasingly affordable, require no permanent installation, and can cover large areas of land in a single flight. They also produce the spectral band data needed to calculate vegetation indices, which offer a direct quantitative view of crop health.

## 2. Vegetation Index Research and Dataset Testing

Once we decided to focus on multispectral drone imagery, we researched which vegetation indices were most relevant to general crop health monitoring and could be reliably calculated from the bands commonly available in consumer-grade multispectral cameras (Red, Green, Blue, and Near-Infrared).

We identified three indices to implement:

| Index | What it measures | Why we chose it |
| --- | --- | --- |
| NDVI | General crop health and chlorophyll presence via NIR and Red bands | NDVI is the most common vegetation index in remote sensing and is most accurate during the growth stage in the middle of the season. It uses only the NIR and Red bands, making it calculable from virtually any multispectral camera |
| EVI | Vegetation health in high-density canopies | EVI is a refined iteration of NDVI with enhanced sensitivity to biomass and atmospheric interference, removing confounding factors such as cloud cover, aerosols, and water. Useful where NDVI saturates in dense crops |
| SAVI | Crop health in areas with exposed soil | SAVI generates values similar to NDVI but with better accuracy in areas where soil is visible through the vegetation, making it well-suited for early-season crops or sparse fields |

To test our index calculations, we sourced publicly available multispectral drone datasets, which we used to verify that our pipeline could correctly ingest imagery, extract the relevant spectral bands, and compute index values accurately.

## 3. Limitations and Future Work

While we were able to implement NDVI, EVI, and SAVI, our ambitions for this feature extended further. Indices such as NDMI (vegetation moisture content), and NDRE (nitrogen stress detection in mature crops) would each add meaningful diagnostic value for farmers. NDRE is particularly useful for identifying nitrogen stress in the mid-to-late development stages, when conventional indices like NDVI lose some of their sensitivity. However, these indices require additional spectral bands, specifically Red Edge and Shortwave Infrared, that were not present in the datasets we had access to during development. 


---

## 4. Technology Review

Considering our clients' requests, we have some requirements that narrow down the possible technologies:

- Product must be lightweight
- Product must be a webapp
- Product must be cheap to use

### 4.1 Frontend Technologies

Frontend — React 19 with Vite
Our solution has a very modular UI, which is for that reason, as well as team familiarity, we chose React. Vite was used as the build tool for its fast hot-module reload during development. The main alternative considered was Next.js, which builds on React but adds server-side rendering. Since Cresco's backend is handled entirely by FastAPI and there was no need for server-rendered pages, the added complexity of Next.js was unnecessary, making plain React with Vite the leaner choice.

### 4.2 API Server — FastAPI with Gunicorn and Uvicorn

FastAPI was selected for the backend due to its native support for asynchronous request handling, which was important for managing concurrent LLM calls, file uploads, and external API requests without blocking. It also provides automatic OpenAPI documentation, which was useful during development. 

### 4.3 AI Agent — LangGraph and LangChain

LangGraph was used to build the agentic core of Cresco, with LangChain providing the underlying tooling. LangChain is well-suited to chaining LLM calls and connecting tools, while LangGraph excels at managing complex, stateful agent workflows. LangGraph's graph-based approach allowed us to define distinct nodes for knowledge retrieval, weather lookup, and web search, with conditional edges determining which tools the agent invokes based on the query. The main alternative considered was CrewAI, which takes a role-based multi-agent approach. However, Cresco's agent only required a single agent coordinating multiple tools rather than multiple specialised agents collaborating, making LangGraph's single-agent stateful model a better fit. The breadth of documentation and the ease of swithcing out LLM providers also made LangChain a better choice for us.

### 4.4 Vector Store — ChromaDB

ChromaDB was chosen to store and retrieve document embeddings for the RAG knowledge base. ChromaDB integrates quickly with frameworks like LangChain, making it good for our pipeline, and it supported local or self-hosted deployment, which was useful in our testing. As this is a webapp, the user will not be hosting it on their device and thus having a self-hosted vector store was not a major drawback. The main alternatives considered were Pinecone and FAISS. Pinecone is a fully managed cloud vector database better suited to production-scale applications, while FAISS is a lower-level library that requires manual management of storage and APIs. For a student project of this scope, ChromaDB offered a good balance of functionality and simplicity without introducing cloud costs or infrastructure overhead.

### 4.5 Database — PostgreSQL 17

PostgreSQL was used to store user accounts, farm data, and LangGraph conversation checkpoints. Its JSONB support was quite useful for storing polygon node coordinates for farm boundaries and weather data without needing a separate NoSQL store. 

Cresco initially used SQLite as its database during early development. SQLite required no server setup, was easy to configure locally, and was sufficient for single-user testing. However, we were given advice from our professors to migrate to PostgreSQL as the project grew to handle concurrent users and more complex relational data, its limitations would become apparent.

### 4.6 LLM Provider — Azure OpenAI (default), with support for OpenAI, Google GenAI, Anthropic, and Ollama

Rather than hardcoding a single LLM provider, we built our tool to be configurable via environment variables, defaulting to Azure OpenAI. This decision was made early on given from feedback from the client. Supporting multiple providers via `MODEL_PROVIDER` and `MODEL_NAME` environment variables also means Cresco can be switched to a local model via Ollama for offline or cost-sensitive deployments, which was important for the project's accessibility goals.

### 4.7 External APIs — OpenWeatherMap, Nominatim, Copernicus Sentinel Hub, Tavily Search

OpenWeatherMap was selected for weather data due to its free tier. Alternatives like Tomorrow.io offer more granular agricultural weather data but are paywalled. Nominatim (OpenStreetMap) was used for geocoding as a free, open-source alternative to the Google Maps Geocoding API, which charges per request. Copernicus Sentinel Hub was used to fetch satellite imagery for server-side NDVI computation. It provides free access to Sentinel-2 multispectral data which covered the UK, our scope for the project. When selecting a satellite imagery provider for server-side vegetation index computation, we initially looked into Landsat as a well-known, freely available source of multispectral imagery. However, Landsat 7, the most widely referenced version of the programme, was officially decommissioned in June 2025. Tavily Search was used for the agent's optional web search tool due to its LangChain integration and developer-friendly free tier.

### 4.8 Libraries

We evaluated QGIS as an option for processing uploaded multispectral drone imagery and computing vegetation indices, given its widespread use in geospatial and agricultural research. However, QGIS was a full GIS tool, thus making it better suited as an analytical tool for academic use rather than something that could be embedded into our backend pipeline. For Cresco's purposes, we needed a lightweight, scriptable library that could ingest raster files and extract band data as part of an API request. Rasterio was chosen for this, as it handles raster file reading and band extraction simply and efficiently without the overhead of a full GIS environment.