# Smart HR Assistant - Demo Guide

This guide helps you record a 60-second demo video of the Smart HR Assistant.

## Prerequisites

Before recording, ensure all services are running:

```bash
# Terminal 1: Database
cd infrastructure && docker-compose up -d

# Terminal 2: Backend API
cd apps/api-server
uvicorn app.main:app --reload

# Terminal 3: Frontend
cd apps/web-portal
npm run dev

# Ensure Ollama is running with required models
ollama run llama3
```

## Demo Script (60 seconds)

### Scene 1: Login (0:00 - 0:10)

1. Open http://localhost:3000/login
2. Show the beautiful login interface
3. Enter: `admin@example.com` / `1234`
4. Click Login

### Scene 2: Dashboard (0:10 - 0:20)

1. Show the dashboard with user info
2. Point out the sidebar navigation
3. Mention "employee management" and "AI features"

### Scene 3: AI Chat - Policy Question (0:20 - 0:40)

1. Click "AI Chat" in sidebar
2. Type: "What is the company leave policy?"
3. Wait for AI response
4. Show the RAG-powered answer with policy details
5. Ask follow-up: "How many sick days do I get?"

### Scene 4: Resume Upload (0:40 - 0:55)

1. Click "Resume Upload" in sidebar
2. Upload `docs/sample_resume.pdf`
3. Show the AI extracting skills and experience
4. Point out the structured output

### Scene 5: Closing (0:55 - 1:00)

1. Return to Dashboard
2. "Smart HR Assistant - AI-powered HR platform"

## Recording Tips

1. **Tool**: Use Loom, OBS, or screen recording software
2. **Resolution**: 1920x1080 recommended
3. **Audio**: Add voiceover explaining each feature
4. **Pace**: Move slowly so viewers can follow
5. **Clean State**: Clear browser cache for fresh demo

## Sample Questions for Demo

### Leave Policy

- "What is the annual leave policy?"
- "How many sick days am I entitled to?"
- "Can I work from home?"

### Resume Parsing

- Upload any PDF resume
- Show extracted name, email, skills

## Troubleshooting

| Issue                | Solution                                                    |
| -------------------- | ----------------------------------------------------------- |
| "Connection refused" | Start all 3 servers (DB, API, Frontend)                     |
| "Login failed"       | Run `python scripts/seed.py` to create admin user           |
| "AI not responding"  | Check Ollama is running: `ollama list`                      |
| "No RAG results"     | Ingest sample PDF first via `rag_service.ingest_document()` |
