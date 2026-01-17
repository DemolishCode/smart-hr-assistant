from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.api import deps
from app.models.core import User
from app.models.ai import ChatSession, ChatMessage, MessageSender
from app.services import llm_service, rag_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: str = None # Optional, for future use

class ChatResponse(BaseModel):
    response: str
    sources: List[str] = []

@router.post("/", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Chat with the AI Assistant using RAG.
    """
    user_message = request.message
    
    # 1. RAG Search
    relevant_chunks = rag_service.search_documents(user_message, session=db, limit=3)
    
    context_text = ""
    sources = []
    if relevant_chunks:
        context_text = "\n\n".join([c.content_chunk for c in relevant_chunks])
        # Deduplicate sources
        sources = list(set([c.document.title for c in relevant_chunks]))
    
    # 2. Construct Prompt
    system_prompt = "You are a helpful HR Assistant. Use the following context to answer the user's question. If you don't know the answer, say you don't know."
    if context_text:
        full_prompt = f"{system_prompt}\n\nContext:\n{context_text}\n\nUser: {user_message}"
    else:
        full_prompt = f"{system_prompt}\n\nUser: {user_message}"

    # 3. Call LLM
    print(f"Calling LLM with prompt length: {len(full_prompt)}")
    ai_response = llm_service.get_chat_response(full_prompt)

    # 4. Save Chat History (basic implementation, just create session info if needed)
    # For now, we just save the interaction if we had a proper session management
    
    return ChatResponse(response=ai_response, sources=sources)
