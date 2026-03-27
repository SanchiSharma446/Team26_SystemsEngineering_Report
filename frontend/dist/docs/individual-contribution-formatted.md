---
title: "Individual Contribution Report"
subtitle: |
  **Project:** Cresco — RAG-Powered Agricultural Chatbot \
  **Team:** 26 \
  **Name:** Shuaiting Li \
  **Student ID:** `23227134`
date: ""
numbersections: true
header-includes:
  - \usepackage{titling}
  - \pretitle{\begin{center}\LARGE}
  - \posttitle{\end{center}}
  - \predate{}
  - \postdate{}
---

\newpage

# Introduction

I served as the lead backend developer on the Cresco project, a team of four working under the UCL Industry Exchange Network programme with NTT DATA. Over the five-month development period (November 2025 -- March 2026), I authored 144 of 380 commits (~38%), primarily responsible for backend architecture, authentication, the RAG-powered chat agent, database design, and the CI/CD pipeline. I also built the frontend API service layer and contributed to technical research and report writing.

# Personal Contributions to System Artefacts

## Research

My research focused on evaluating technical options that shaped the system's architecture. I investigated LLM providers, initially exploring Gemini before switching to Azure OpenAI due to available credits, and set up multi-provider configuration supporting five providers. I also researched RAG architecture (embedding models, chunking strategies, ChromaDB), LangGraph for agent orchestration, PostgreSQL for concurrent access, FastAPI, and GitHub Actions with Docker for CI/CD.

## UI Design

UI design was primarily led by other team members. My contribution was architectural: I designed the authentication page flow (login/register forms, JWT token storage, automatic logout on 401/403 responses) and created the `api.js` service layer that defines how every frontend component communicates with the backend.

## Coding

**Backend Architecture and API.** I initialised the FastAPI project and designed its module structure (`agent/`, `api/`, `auth/`, `rag/`, `db.py`, `config.py`, `main.py`). The application factory uses FastAPI's lifespan manager for resource lifecycle management. Configuration uses Pydantic-settings with caching. All third-party API calls are proxied through backend endpoints so API keys never reach the frontend.

**Authentication and Security.** I built the complete authentication system: password hashing with bcrypt, JWT tokens (HS256, 24-hour expiry), and FastAPI dependency injection for route protection. Every database query is scoped to the authenticated user's ID, enforcing per-user data isolation.

**RAG Agent and LLM Integration.** I designed and implemented the `CrescoAgent` using LangGraph as a state graph where the LLM decides when to invoke tools. I implemented the internet search toggle using a strategy pattern (two pre-built graph variants) and multi-LLM provider support via LangChain's `init_chat_model`. Other team members implemented the individual tools and structured output rendering.

**Database Layer.** I initially used SQLite for prototyping, then led the full migration to PostgreSQL (15 files, 420+ insertions, 210+ deletions), replacing all synchronous calls with an asynchronous connection pool using `psycopg` v3. I also integrated `AsyncPostgresSaver` for persistent conversation history and added a `docker-compose.yml` for local development.

**Document Upload, Conversations, and Frontend Service Layer.** I built the document upload pipeline (file validation, chunking with LangChain, ChromaDB indexing with per-user scoping), conversation persistence via LangGraph's checkpointer, and the centralised `api.js` module for all frontend-backend communication (JWT injection, auto-logout, request timeouts).

**CI/CD and DevOps.** I created CI and CD pipelines using GitHub Actions: the CI pipeline runs linting, tests (80% minimum coverage against a PostgreSQL service container), and builds on every pull request; the CD pipeline builds and pushes Docker images to Azure Container Registry and deploys the frontend to Azure Static Web Apps.

## Testing

I set up the backend test infrastructure (`conftest.py`) with fixtures for sync/async test clients, temporary PostgreSQL databases, and mock connection pools. I authored tests for authentication, the agent, API proxy endpoints, and the document indexer, and designed the mock strategy for external services. The team collectively wrote 260+ backend tests across 66 test classes.

# Personal Contributions to the Website Report

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

**Requirements.** I contributed to requirements specification, including requirement gathering through farmer interviews, use case definitions, and MoSCoW prioritisation of functional and non-functional requirements.

**Website template and setup.** I built the report website from scratch: `MarkdownRenderer` (fetches and renders markdown with react-markdown, remark-gfm, rehype-raw), `TableOfContents` (responsive scroll-spy sidebar), sequence diagram folding, HashRouter-based routing for static export, and the Azure Blob Storage deployment pipeline.

**System Design.** I authored the full system design report: system architecture diagram, site map, four sequence diagrams, six design patterns, data storage schemas, and package/API endpoint tables.

**Implementation.** I authored implementation sections covering authentication, RAG-powered chat, document upload and indexing, farm location and weather integration, and CI/CD deployment.

**Deployment Manual.** I authored the full deployment manual covering local setup, Docker deployment, Azure cloud deployment, CI/CD pipeline reference, environment variables, and common issues.

**Evaluation and Future Work.** I contributed to evaluation including achievement tables, critical evaluation (stability, efficiency, maintainability, project management), and future work recommendations.

# Main Difficulties and How They Were Overcome

## Continuous Deployment on Azure

Deploying to Azure involved ten distinct issues across infrastructure, Docker builds, and runtime configuration. The UCL Azure subscription had zero VM quota and no self-service increases, and service principal authentication lacked required permissions. We resolved these by creating a new Pay-As-You-Go subscription and switching to ACR continuous deployment. Docker and runtime issues (base image changes, race conditions in database migrations, missing CORS origins) each required systematic debugging through error logs.

## SQLite to PostgreSQL Migration

SQLite could not support concurrent writes, was unavailable as a managed Azure service, and was incompatible with the LangGraph checkpointer. The migration was a single atomic commit (15 files, 420+ insertions, 210+ deletions), rewriting all database operations to asynchronous `psycopg` v3, replacing the conversation store, and updating all tests. The entire change was merged only after all 260+ tests passed.

## Agent Architecture Migration to LangGraph

The initial prototype used direct LLM calls with no tool calling, memory, or structured output. I migrated incrementally: first to LangChain's chat model abstraction, then to a LangGraph agent graph with tool-calling, the strategy pattern for the search toggle, and finally persistent conversation memory. LangGraph's limited documentation at the time was the main difficulty; incremental adoption made this manageable.
