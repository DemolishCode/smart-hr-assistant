# Sample Documents for Testing

This folder contains sample PDF documents for testing the Smart HR Assistant features.

## Available Documents

| File                      | Description                   | Use Case                |
| ------------------------- | ----------------------------- | ----------------------- |
| `sample_leave_policy.pdf` | Company leave policy document | RAG Knowledge Base Test |
| `sample_resume.pdf`       | Sample candidate resume       | Resume Parsing Test     |

## Usage

### Testing RAG (Knowledge Base)

1. Start the API server
2. Ingest the policy document:

```python
from app.services.rag_service import ingest_document
from app.core.database import SessionLocal

db = SessionLocal()
ingest_document("docs/sample_leave_policy.pdf", "policy", db)
```

3. Ask questions via the Chat API or UI:
   - "What is the annual leave policy?"
   - "How many sick days do I get?"

### Testing Resume Parsing

1. Use the Resume Upload page in the dashboard
2. Upload `sample_resume.pdf`
3. View extracted information (name, email, skills)

## Creating Your Own Test Documents

You can add more PDF documents to this folder for testing. The system supports:

- Company policies
- Employee handbooks
- Resumes/CVs
- Any text-based PDF documents
