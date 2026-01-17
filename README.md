# Smart HR Assistant 🚀

An AI-powered HR platform featuring intelligent document Q&A (RAG), automated resume parsing, and a modern dashboard for HR teams.

## Features

- **🤖 AI Chat Assistant**: Ask questions about company policies and get instant answers using RAG (Retrieval Augmented Generation)
- **📄 Resume Parsing**: Upload PDF resumes and automatically extract candidate information, skills, and experience
- **👥 Employee Management**: View and manage employee directory with role-based access
- **🔐 Secure Authentication**: JWT-based authentication with role management

## Architecture

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

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Frontend       | Next.js 15, TypeScript, Tailwind CSS, Shadcn UI |
| Backend        | FastAPI, Python 3.11, SQLAlchemy 2.0            |
| AI/ML          | LangChain, Ollama (llama3, nomic-embed-text)    |
| Database       | PostgreSQL 16 with pgvector extension           |
| Infrastructure | Docker, Nginx                                   |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- [Ollama](https://ollama.ai) installed locally
- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)

### 1. Clone & Setup Environment

```bash
git clone <repository-url>
cd smart-hr-assistant

# Copy environment file
cp .env.example .env
# Edit .env with your settings
```

### 2. Start Ollama Models

```bash
# Pull required models
ollama pull llama3
ollama pull nomic-embed-text

# Ollama should be running on http://localhost:11434
```

### 3. Start with Docker

```bash
cd infrastructure
docker-compose up -d

# This starts:
# - PostgreSQL (port 5433)
# - Adminer (port 8080)
```

### 4. Initialize Database

```bash
cd apps/api-server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Seed initial data
python scripts/seed.py
```

### 5. Start Backend API

```bash
cd apps/api-server
uvicorn app.main:app --reload --port 8000
# API available at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

### 6. Start Frontend

```bash
cd apps/web-portal
npm install
npm run dev
# Frontend available at http://localhost:3000
```

## Default Credentials

| User  | Email             | Password |
| ----- | ----------------- | -------- |
| Admin | admin@example.com | 1234     |

## API Endpoints

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| POST   | `/api/v1/auth/login`     | Login and get JWT            |
| GET    | `/api/v1/users/me`       | Get current user profile     |
| GET    | `/api/v1/users/`         | List all users               |
| POST   | `/api/v1/chat`           | Send message to AI assistant |
| POST   | `/api/v1/resumes/upload` | Upload and parse resume PDF  |

## Project Structure

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
│       ├── lib/             # Utilities, API client
│       └── stores/          # Zustand stores
│
├── infrastructure/          # Docker, Nginx config
├── docs/                    # Sample PDFs for testing
└── .env.example            # Environment template
```

## Testing

```bash
cd apps/api-server

# Run test scripts
python scripts/test_error_handling.py
python scripts/test_resume_parsing.py
python scripts/test_rag_flow.py
```

## Screenshots

### Login Page

Clean, modern login interface with form validation.

### Dashboard

Employee overview with sidebar navigation and quick stats.

### AI Chat

Interactive chat interface with RAG-powered responses.

### Resume Upload

Drag-and-drop PDF upload with AI skill extraction.

## License

MIT License - See [LICENSE](LICENSE) for details.

---

Built with ❤️ using FastAPI, Next.js, and LangChain
