import os
import shutil
import uuid
import json
from typing import Any
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.core import User
from app.models.recruitment import Candidate, ResumeParsingResult
from app.services import llm_service
from langchain_community.document_loaders import PyPDFLoader

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a resume (PDF), parse it with LLM, and save candidate info.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # 1. Save File
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Extract Text
        loader = PyPDFLoader(file_path)
        pages = loader.load()
        full_text = "\n".join([p.page_content for p in pages])
        
        # 3. Parse with LLM
        prompt = f"""
        Extract the following information from the resume text below and return ONLY valid JSON.
        Fields: "name" (string), "email" (string), "phone" (string), "skills" (list of strings).
        
        Resume Text:
        {full_text[:3000]}
        """
        
        json_response = llm_service.get_chat_response(prompt)
        
        # Cleanup JSON (sometimes LLM adds markdown ```json ... ```)
        json_clean = json_response.replace("```json", "").replace("```", "").strip()
        
        try:
            parsed_data = json.loads(json_clean)
        except json.JSONDecodeError:
            print(f"Failed to parse JSON from LLM: {json_clean}")
            parsed_data = {"name": "Unknown", "email": "Unknown", "phone": "", "skills": []}

        # 4. Save Candidate
        candidate = Candidate(
            name=parsed_data.get("name", "Unknown"),
            email=parsed_data.get("email", "unknown@example.com"),
            phone=parsed_data.get("phone", ""),
            resume_file_path=file_path
        )
        db.add(candidate)
        db.flush()

        # 5. Save Parsing Result & Vector
        # Generate embedding for the resume summary/text
        embedding = llm_service.generate_embedding(full_text[:1000]) # Embed first 1000 chars

        parsing_result = ResumeParsingResult(
            candidate_id=candidate.id,
            parsed_data=parsed_data,
            embedding_vector=embedding
        )
        db.add(parsing_result)
        db.commit()

        return {
            "message": "Resume uploaded and parsed successfully",
            "candidate_id": candidate.id,
            "parsed_data": parsed_data
        }

    except Exception as e:
        print(f"Error processing resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))
