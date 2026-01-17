import os
import uuid
import sys
from typing import List, Optional
from sqlalchemy.orm import Session
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Add parent directory to path to import app services/models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.models.ai import Document, DocumentChunk
from app.services.llm_service import generate_embedding

def ingest_document(file_path: str, doc_type: str, session: Session) -> Optional[Document]:
    """
    Ingests a document (PDF), splits it, generates embeddings, and saves to DB.
    """
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return None

    try:
        print(f"Starting ingestion for: {file_path}")
        
        # 1. Load Document
        loader = PyPDFLoader(file_path)
        pages = loader.load()
        print(f"  - Loaded {len(pages)} pages.")

        # 2. Split Text
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            length_function=len,
            is_separator_regex=False,
        )
        chunks = text_splitter.split_documents(pages)
        print(f"  - Split into {len(chunks)} chunks.")

        # 3. Create Document Record
        filename = os.path.basename(file_path)
        new_doc = Document(
            title=filename,
            file_path=file_path,
            doc_type=doc_type
        )
        session.add(new_doc)
        session.flush() # Get ID
        print(f"  - Created Document record (ID: {new_doc.id})")

        # 4. Generate Embeddings & Save Chunks
        doc_chunks_db = []
        for i, chunk in enumerate(chunks):
            content = chunk.page_content
            # Generate Embedding
            embedding = generate_embedding(content)
            
            if not embedding:
                print(f"Warning: Failed to generate embedding for chunk {i}")
                continue

            chunk_db = DocumentChunk(
                document_id=new_doc.id,
                content_chunk=content,
                chunk_index=i,
                embedding=embedding
            )
            doc_chunks_db.append(chunk_db)
        
        if doc_chunks_db:
            session.add_all(doc_chunks_db)
            session.commit()
            print(f"SUCCESS: Ingested {len(doc_chunks_db)} chunks for {filename}.")
            return new_doc
        else:
            print("Error: No chunks were processed successfully.")
            session.rollback()
            return None

    except Exception as e:
        print(f"Error ingesting document: {e}")
        session.rollback()
        return None

def search_documents(query: str, session: Session, limit: int = 5) -> List[DocumentChunk]:
    """
    Searches for document chunks relevant to the query using vector similarity.
    """
    try:
        # 1. Generate Query Embedding
        query_embedding = generate_embedding(query)
        if not query_embedding:
            print("Error: Could not generate embedding for query.")
            return []

        # 2. Perform Vector Search (Cosine Distance)
        # Using pgvector's cosine distance operator (<=>)
        # Order by distance ASC (nearest neighbors)
        stmt = select(DocumentChunk).order_by(
            DocumentChunk.embedding.cosine_distance(query_embedding)
        ).limit(limit)
        
        results = session.execute(stmt).scalars().all()
        return results

    except Exception as e:
        print(f"Error searching documents: {e}")
        return []
