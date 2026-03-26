# Requirements Specification

## 1. Partner Introduction and Project Background

NTT DATA is a global digital business and IT services leader, headquartered in Tokyo, Japan, with operations in over 50 countries and approximately 190,000 employees worldwide. As one of the top 10 global IT services providers, NTT DATA partners with organisations across industries — including agriculture, government, and sustainability — to drive digital transformation through consulting, cloud infrastructure, data analytics, and AI solutions. NTT DATA has a strong presence in the UK through its London-based operations and has been actively investing in agri-tech innovation as part of its broader sustainability and smart society initiatives, recognising the potential of AI and data-driven tools to modernise traditional industries.

This project was undertaken as part of UCL's Industry Exchange Network (IXN) programme, which pairs student teams with industry partners to deliver real-world software projects. Through the IXN programme, NTT DATA proposed and sponsored the Cresco project, and providing the team with industry mentorship. NTT DATA identified UK agriculture as a domain where conversational AI and remote sensing technologies could deliver significant value to end users.

---

## 2. Project Goals

The overarching goal of Cresco is to provide an affordable and easy-to-use AI assistant for small-scale UK farmers. Large enterprises can afford dedicated agronomists and premium decision-support software, but small-scale farmers are often left relying on outdated practices or generic online searches. Cresco aims to level this playing field by offering a free, open-source tool that delivers expert guidance through a simple conversational interface, lowering the barrier to entry for AI-assisted farming.

---

## 3. Requirement Gathering

Requirements were gathered through three channels: interviews with farmers, feedback from personas (peer students acting as representative users), and ongoing communication with our client NTT DATA.

### 3.1 Interviews with Farmers

We interviewed UK farmers at different stages of development. Initial scoping interviews established the core problem: farmers need advice contextualised by weather and location, not generic textbook answers, and they lack time to search through lengthy PDFs during critical seasonal windows. After the first prototype was operational, we demonstrated it to farmers and collected feedback, which led to the addition of actionable task lists, a weather panel alongside the chat, and drone image analysis integration.

### 3.2 Persona-Based Feedback

We recruited peer students to act as personas representing our target user groups (see Section 4). They tested the application at multiple stages and provided feedback from the perspective of their assigned persona. This informed UI refinements including collapsible sidebars, the dashboard view, and the delete-last-exchange capability.

### 3.3 Client Feedback

At the end of each development sprint, a demonstration was shown to the NTT DATA project liaison, and feedback was incorporated into the next sprint's backlog. This iterative loop led to the addition of the internet search toggle, the dashboard view, and inline chart generation within chat responses.

---

## 4. Personas

### Persona 1: Sarah Mitchell — Arable Farmer

Age 42, Norfolk. Farms 280 hectares of winter wheat, spring barley, and oilseed rape. Moderate technology comfort — uses a smartphone and spreadsheets but no AI tools. Sarah wants quick answers to crop disease and spraying timing questions contextualised by her local weather, without searching through PDFs. She would use Cresco daily during the growing season, setting her farm location, checking weather, and uploading soil analysis data.

### Persona 2: James O'Brien — Mixed Farmer and Early Tech Adopter

Age 31, Herefordshire. Farms 120 hectares of cereals and 60 head of beef cattle. High technology comfort — flies a DJI Mavic with a multispectral camera. James wants to integrate drone NDVI analysis with advisory knowledge in one platform rather than using three separate tools. He would upload drone imagery weekly, use satellite imagery between flights, and enable internet search for emerging threats.

### Persona 3: Dr. Helen Pryce — Agricultural Advisor

Age 55, covers farms across Cambridgeshire and Bedfordshire. High desktop comfort, moderate mobile. Helen wants to recommend Cresco to the farmers she advises, needing confidence that answers cite approved sources. She would upload region-specific advisory notes, use the dashboard before client calls, and use delete-last-exchange to correct conversations.

### Persona 4: Tom Patel — Agricultural Sciences Student

Age 22, Harper Adams University. Very high technology comfort — studies GIS, remote sensing, and data analysis. Tom wants to use Cresco as a learning tool for UK agricultural best practices and to experiment with NDVI analysis for his dissertation. He would use the chat extensively with internet search enabled and use chart generation to visualise crop data comparisons.

---

## 5. Use Cases

### 5.1 Use Case Diagram

The following UML use case diagram illustrates the actors and relationships within the Cresco system.

```mermaid
flowchart LR
    Farmer([Farmer])
    External([External Services])

    subgraph Cresco [Cresco System]
        direction TB
        UC5([UC5: Send Chat Message])
        UC10([UC10: Retrieve Ag Info])
        UC11([UC11: Search Internet])
        UC12([UC12: Generate Task List])
        UC13([UC13: Generate Inline Chart])
        
        UC14([UC14: Upload Document])
        UC17([UC17: Index Document])
        
        UC18([UC18: Set Farm Location])
        UC21([UC21: Save Farm Data])
        UC22([UC22: Reverse Geocode])
        UC23([UC23: Search by Address])
        
        UC24([UC24: Upload Drone Images])
        UC25([UC25: Select Veg Index])
        
        UC20([UC20: Fetch Weather])
        UC30([UC30: Fetch Satellite NDVI])
    end

    %% Primary Actor
    Farmer --> UC5
    Farmer --> UC14
    Farmer --> UC18
    Farmer --> UC24
    Farmer --> UC20
    Farmer --> UC30

    %% Includes & Extends
    UC5 -. "&lt;&lt;include&gt;&gt;" .-> UC10
    UC5 -. "&lt;&lt;extend&gt;&gt;\n[if enabled]" .-> UC11
    UC5 -. "&lt;&lt;extend&gt;&gt;" .-> UC12
    UC5 -. "&lt;&lt;extend&gt;&gt;" .-> UC13
    
    UC14 -. "&lt;&lt;include&gt;&gt;" .-> UC17
    
    UC18 -. "&lt;&lt;include&gt;&gt;" .-> UC21
    UC18 -. "&lt;&lt;include&gt;&gt;" .-> UC22
    UC18 -. "&lt;&lt;extend&gt;&gt;" .-> UC23
    
    UC24 -. "&lt;&lt;include&gt;&gt;" .-> UC25

    %% External Connections
    UC11 --> External
    UC22 --> External
    UC23 --> External
    UC20 --> External
    UC30 --> External

    classDef actor fill:#eff6ff,stroke:#2563eb,stroke-width:2px,color:#1e293b
    classDef usecase fill:#ffffff,stroke:#64748b,stroke-width:1px,color:#1e293b
    class Farmer,External actor
    class UC5,UC10,UC11,UC12,UC13,UC14,UC17,UC18,UC21,UC22,UC23,UC24,UC25,UC20,UC30 usecase
```

### 5.2 List of Use Cases

| ID   | Use Case                   | Actor(s)                  | Description                                                                                                   |
| ---- | -------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| UC1  | Register Account           | Farmer                    | Create account with username and password; system returns a JWT.                                              |
| UC2  | Log In                     | Farmer                    | Authenticate with credentials; system validates and issues a JWT.                                             |
| UC3  | Log Out                    | Farmer                    | End session and clear stored tokens.                                                                          |
| UC4  | Delete Account             | Farmer                    | Permanently remove account with cascading deletion of all user data.                                          |
| UC5  | Send Chat Message          | Farmer                    | Submit a natural language question; receive an AI response with source citations, optional tasks, and charts. |
| UC6  | View Chat History          | Farmer                    | View persisted conversation history loaded on login.                                                          |
| UC7  | Delete Last Exchange       | Farmer                    | Remove the most recent question-answer pair from agent memory.                                                |
| UC8  | Clear All History          | Farmer                    | Remove all conversation history.                                                                              |
| UC9  | Toggle Internet Search     | Farmer                    | Enable or disable the agent's internet search capability.                                                     |
| UC10 | Retrieve Agricultural Info | Farmer, External Services | Agent searches the knowledge base via ChromaDB with per-user scoping. Included by UC5.                        |
| UC11 | Search Internet            | Farmer, External Services | Agent queries Tavily for real-time information. Extends UC5.                                                  |
| UC12 | Generate Task List         | Farmer                    | Agent produces up to 5 prioritised action tasks. Extends UC5.                                                 |
| UC13 | Generate Inline Chart      | Farmer                    | Agent produces a bar, line, or pie chart inline in the response. Extends UC5.                                 |
| UC14 | Upload Document            | Farmer                    | Upload a .md/.pdf/.txt/.csv/.json file; system auto-indexes it.                                               |
| UC15 | View Uploaded Documents    | Farmer                    | List all uploaded files with type icons and source count.                                                     |
| UC16 | Delete Uploaded Document   | Farmer                    | Remove an uploaded file and its indexed chunks from ChromaDB.                                                 |
| UC17 | Index Document             | Farmer                    | System chunks and indexes the uploaded document. Included by UC14.                                            |
| UC18 | Set Farm Location          | Farmer                    | Draw a polygon boundary on a Leaflet satellite map; area calculated via Turf.js.                              |
| UC19 | View Weather Forecast      | Farmer                    | View 5-day forecast cards and temperature/wind chart.                                                         |
| UC20 | Fetch Weather Data         | Farmer, External Services | Fetch current weather and forecast from OpenWeatherMap for farm coordinates.                                  |
| UC21 | Save Farm Data             | Farmer                    | Save farm location, area, and polygon to the database. Included by UC18.                                      |
| UC22 | Reverse Geocode Location   | Farmer, External Services | Obtain a location name from coordinates via Nominatim. Included by UC18.                                      |
| UC23 | Search Location by Address | Farmer, External Services | Search by address/postcode via Nominatim and centre the map. Extends UC18.                                    |
| UC24 | Upload Drone Images        | Farmer                    | Upload paired RGB and NIR images; system generates a vegetation index image.                                  |
| UC25 | Select Vegetation Index    | Farmer                    | Choose NDVI, EVI, or SAVI for drone image processing. Included by UC24.                                       |
| UC26 | View Image Gallery         | Farmer                    | Browse saved drone images with filtering, histograms, and timestamps.                                         |
| UC27 | Delete Drone Image         | Farmer                    | Remove a saved drone analysis image and its metadata.                                                         |
| UC28 | Edit Image Timestamp       | Farmer                    | Correct the capture date/time of a drone image.                                                               |
| UC29 | View Time Series Chart     | Farmer                    | Visualise NDVI trends over time as a stacked health bar chart.                                                |
| UC30 | Fetch Satellite NDVI       | Farmer, External Services | Fetch Sentinel-2 NDVI for farm coordinates from Copernicus. Requires UC18.                                    |

---

## 6. MoSCoW Requirement List

### 6.1 Functional Requirements

| ID    | Requirement                                                                                                                                                                                                                              | Priority |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| FR-01 | The system shall allow users to register and log in with a unique username and password, storing passwords as bcrypt hashes and issuing JWTs for session management.                                                                     | Must     |
| FR-02 | The system shall provide a conversational chat interface using Retrieval-Augmented Generation with ChromaDB, scoping retrieval to shared knowledge base documents and the current user's uploads, and citing sources in responses.        | Must     |
| FR-03 | The system shall persist conversation history across server restarts and allow users to delete the last exchange or clear all history.                                                                                                    | Must     |
| FR-04 | The system shall allow users to upload documents (.md, .pdf, .txt, .csv, .json), automatically chunk and index them into ChromaDB with the user's ID, so the chatbot can retrieve user-specific content.                                 | Must     |
| FR-05 | The system shall fetch current weather and a 5-day forecast from OpenWeatherMap for the user's farm coordinates and display it in a weather panel with forecast cards and a temperature/wind chart.                                      | Must     |
| FR-06 | The system shall provide an interactive Leaflet satellite map where users can draw a farm polygon boundary, calculate the enclosed area, search locations by address/postcode, and save the farm data to the database.                    | Must     |
| FR-07 | The system shall allow users to upload paired RGB and NIR drone images, compute a selected vegetation index (NDVI, EVI, or SAVI), and provide a gallery with filtering, histograms, editable timestamps, and time series visualisation.  | Should   |
| FR-08 | The system shall fetch Sentinel-2 satellite imagery from Copernicus for the user's farm coordinates and compute a server-side NDVI image for display in the frontend.                                                                    | Should   |
| FR-09 | The system shall render AI responses using GitHub Flavoured Markdown, LaTeX, and inline Recharts charts, and parse structured task and chart blocks into interactive UI components within chat messages.                                  | Should   |
| FR-10 | The system shall provide a dashboard view aggregating tasks, a 5-day weather forecast, the current season, and a field health NDVI chart from the user's drone imagery history.                                                          | Should   |
| FR-11 | The system shall provide a toggleable internet search capability (via Tavily) and allow users to permanently delete their account with cascading removal of all associated data.                                                          | Should   |
| FR-12 | The system shall support multiple LLM providers (Azure OpenAI, OpenAI, Google GenAI, Anthropic, Ollama) configurable via environment variables, drag-and-drop file upload, and collapsible sidebars.                                     | Could    |
| FR-13 | The system shall support streaming chat responses via Server-Sent Events, voice input via the Web Speech API, and PDF export of conversation history.                                                                                    | Could    |
| FR-14 | The system shall not provide a native mobile app, real-time collaborative sessions, farm management software integration, or custom LLM fine-tuning within the current project scope.                                                    | Won't    |

### 6.2 Non-Functional Requirements

| ID     | Requirement                                                                                                                                                                                                                  | Priority |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| NFR-01 | **Performance:** The system shall respond to chat messages within 120 seconds, including RAG retrieval and LLM inference.                                                                                                    | Must     |
| NFR-02 | **Security:** All third-party API keys shall be stored server-side; all protected endpoints shall require JWT authentication; and user passwords shall be hashed with bcrypt and never stored or returned in plaintext.       | Must     |
| NFR-03 | **Data Isolation:** All user data (documents, drone images, farm data, weather, conversation history) shall be scoped by user ID, with no endpoint returning another user's data.                                            | Must     |
| NFR-04 | **Maintainability:** The backend shall enforce 80%+ code coverage via pytest and the codebase shall comply with Ruff (backend) and ESLint (frontend) linting rules, both enforced by the CI pipeline.                        | Must     |
| NFR-05 | **Usability:** The frontend shall include ARIA labels, semantic HTML landmarks, and keyboard navigation support, targeting WCAG 2.1 Level A compliance.                                                                      | Should   |
| NFR-06 | **Performance:** The backend shall use an asynchronous database connection pool and parallel API calls to handle concurrent users efficiently.                                                                               | Should   |
| NFR-07 | **Deployability:** The system shall be deployable as Docker images orchestrated via Docker Compose, with a GitHub Actions CI/CD pipeline for automated lint, test, build, and deployment to Azure.                           | Should   |
| NFR-08 | **Extensibility:** The system shall use a provider-agnostic LLM initialisation pattern, be built entirely with open-source frameworks, and read all configuration from environment variables via a single `.env` file.        | Should   |
| NFR-09 | **Reliability:** The system shall handle errors gracefully — logging failures silently where appropriate, returning HTTP 502 for upstream API failures, and falling back to plain text when structured output parsing fails.  | Should   |
| NFR-10 | **Usability:** The frontend shall provide a dark theme for reduced eye strain and support offline access as a Progressive Web App with cached advisory content and weather data.                                              | Could    |
| NFR-11 | **Scalability/Localisation:** The system shall not support horizontal scaling with load balancing or multi-language localisation within the current project scope.                                                            | Won't    |
 