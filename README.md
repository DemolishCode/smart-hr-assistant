# Smart HR Assistant 🚀

An AI-powered HR platform featuring intelligent document Q&A (RAG), automated resume parsing, and a modern dashboard for HR teams.

## ✨ Features

- **🤖 AI Chat Assistant**: Ask questions about company policies and get instant answers using RAG (Retrieval Augmented Generation)
- **📄 Resume Parsing**: Upload PDF resumes and automatically extract candidate information, skills, and experience
- **👥 Employee Management**: View and manage employee directory with role-based access
- **🔐 Secure Authentication**: JWT-based authentication with role management
- **🌐 Multi-Language Support (i18n)**: Switch between English 🇺🇸 and Thai 🇹🇭 with session persistence
- **🌙 Dark/Light Mode**: Toggle between dark and light themes with system preference support

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │ Login   │  │Dashboard│  │  Chat   │  │ Resume Upload   │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ │
└───────┼────────────┼───────────┼─────────────────┼──────────┘
        │            │           │                 │
        ▼            ▼           ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (FastAPI)                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │  Auth   │  │  Users  │  │  Chat   │  │    Resumes      │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ │
└───────┼────────────┼───────────┼─────────────────┼──────────┘
        │            │           │                 │
        ▼            ▼           ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      Services Layer                          │
│  ┌─────────────────┐  ┌────────────────────────────────────┐│
│  │   LLM Service   │  │           RAG Service              ││
│  │   (Ollama)      │  │  (Vector Search + PDF Processing)  ││
│  └────────┬────────┘  └──────────────────┬─────────────────┘│
└───────────┼──────────────────────────────┼──────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL + pgvector                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │  Users  │  │Documents│  │ Chunks  │  │   Candidates    │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Frontend       | Next.js 16, TypeScript, Tailwind CSS, Shadcn UI |
| State          | Zustand, next-themes                            |
| Backend        | FastAPI, Python 3.11, SQLAlchemy 2.0            |
| AI/ML          | LangChain, Ollama (llama3, nomic-embed-text)    |
| Database       | PostgreSQL 16 with pgvector extension           |
| Infrastructure | Docker, Docker Compose, Nginx                   |

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- [Ollama](https://ollama.ai) installed locally
- Node.js 20+ (for frontend development)
- Python 3.11+ (for backend development)

### Option 1: Full Docker Stack (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd smart-hr-assistant

# Start Ollama and pull models
ollama pull llama3
ollama pull nomic-embed-text

# Start all services
cd infrastructure
docker-compose up -d

# Run database migrations and seed
docker exec -it hr_api_server alembic upgrade head
docker exec -it hr_api_server python scripts/seed.py

# Access the application
# Frontend: http://localhost
# API Docs: http://localhost:8000/docs
# Adminer:  http://localhost:8080
```

### Option 2: Development Mode

```bash
# 1. Start database only
cd infrastructure
docker-compose up -d db adminer

# 2. Setup backend
cd ../apps/api-server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python scripts/seed.py
uvicorn app.main:app --reload --port 8000

# 3. Setup frontend (new terminal)
cd apps/web-portal
npm install
npm run dev
```

## 🔑 Default Credentials

| User    | Email               | Password    | Role          |
| ------- | ------------------- | ----------- | ------------- |
| Admin   | admin@example.com   | 1234        | Administrator |
| HR      | hr@example.com      | password123 | HR            |
| Manager | manager@example.com | password123 | Manager       |
| Dev     | dev@example.com     | password123 | Employee      |

## 🌐 Internationalization (i18n)

The application supports **English** and **Thai** languages:

- **Default**: English 🇺🇸
- **Switch**: Click the globe icon (🌐) in the header
- **Persistence**: Language preference is saved in session storage

Translation files are located in:

- `apps/web-portal/locales/en.json`
- `apps/web-portal/locales/th.json`

## 📡 API Endpoints

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| POST   | `/api/v1/auth/login`     | Login and get JWT            |
| GET    | `/api/v1/users/me`       | Get current user profile     |
| GET    | `/api/v1/users/`         | List all users               |
| POST   | `/api/v1/chat`           | Send message to AI assistant |
| POST   | `/api/v1/resumes/upload` | Upload and parse resume PDF  |

## 📁 Project Structure

```
smart-hr-assistant/
├── apps/
│   ├── api-server/          # FastAPI Backend
│   │   ├── app/
│   │   │   ├── api/         # API endpoints
│   │   │   ├── core/        # Security, config
│   │   │   ├── models/      # SQLAlchemy models
│   │   │   └── services/    # LLM, RAG services
│   │   ├── alembic/         # Database migrations
│   │   └── scripts/         # Utility scripts
│   │
│   └── web-portal/          # Next.js Frontend
│       ├── app/             # App Router pages
│       ├── components/      # React components
│       │   ├── chat/        # Chat UI components
│       │   ├── layout/      # Sidebar, navigation
│       │   └── ui/          # Shadcn UI components
│       ├── contexts/        # React contexts (Language)
│       ├── locales/         # i18n translation files
│       ├── lib/             # Utilities, API client
│       └── stores/          # Zustand stores
│
├── infrastructure/          # Docker, Nginx config
│   ├── docker-compose.yml   # Full stack orchestration
│   ├── nginx.conf           # Reverse proxy config
│   └── .env.docker          # Docker environment
│
├── docs/                    # Sample PDFs for testing
└── .env.example             # Environment template
```

## 🧪 Testing

```bash
cd apps/api-server

# Run test scripts
python scripts/test_error_handling.py
python scripts/test_resume_parsing.py
python scripts/test_rag_flow.py
```

## 🐳 Docker Services

| Service    | Port | Description              |
| ---------- | ---- | ------------------------ |
| proxy      | 80   | Nginx reverse proxy      |
| web-portal | 3000 | Next.js frontend         |
| api-server | 8000 | FastAPI backend          |
| db         | 5432 | PostgreSQL with pgvector |
| adminer    | 8080 | Database admin UI        |

## 📸 Screenshots

### Login Page

Modern split-layout login with dark/light mode and language switcher.

### Dashboard

Employee overview with sidebar navigation, quick actions, and user info cards.

### AI Chat

Interactive chat interface with RAG-powered responses about HR policies.

### Resume Upload

Drag-and-drop PDF upload with AI-powered skill extraction and parsing.

---

Built with ❤️ using FastAPI, Next.js, and LangChain
