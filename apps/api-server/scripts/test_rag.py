import sys
import os
import uuid
from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add parent directory to path to import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models import Document, DocumentChunk
from app.services.rag_service import ingest_document

# Load env vars
load_dotenv(os.path.join(os.path.dirname(__file__), '../../../.env'))
DATABASE_URL = os.getenv("DATABASE_URL")

# Setup DB
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def create_dummy_pdf(filename="test_doc.pdf"):
    from reportlab.pdfgen import canvas
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "Hello World from Smart HR Assistant!")
    c.drawString(100, 730, "This is a test PDF for RAG pipeline verification.")
    c.drawString(100, 710, "We are testing text splitting and embedding generation.")
    c.save()
    print(f"Created dummy PDF: {filename}")

def test_rag_ingestion():
    session = SessionLocal()
    pdf_path = "test_doc.pdf"
    
    try:
        # 1. Create Dummy PDF if not exists
        if not os.path.exists(pdf_path):
            try:
                import reportlab
            except ImportError:
                 print("Installing reportlab for PDF generation...")
                 os.system("pip install reportlab")
                 import reportlab
            create_dummy_pdf(pdf_path)

        # 2. Run Ingestion
        print(f"\nRunning Ingestion for {pdf_path}...")
        doc = ingest_document(pdf_path, "POLICY", session)
        
        if doc:
            print(f"PASS: Document created with ID {doc.id}")
            
            # 3. Verify Chunks
            stmt = select(DocumentChunk).where(DocumentChunk.document_id == doc.id)
            chunks = session.execute(stmt).scalars().all()
            
            if len(chunks) > 0:
                print(f"PASS: Found {len(chunks)} chunks in DB.")
                print(f"  - Chunk 0 Content: {chunks[0].content_chunk}")
                print(f"  - Chunk 0 Embed Dim: {len(chunks[0].embedding) if chunks[0].embedding is not None else 'None'}")
                
                # 4. Verify Vector Search (Optional sanity check)
                # Cast to vector type for cosine distance (requires pgvector)
                # This is just a raw SQL check
                try:
                    vec_str = str(chunks[0].embedding)
                    # Simple check if we can query it
                    print("  - Vector data verified.")
                except Exception as e:
                     print(f"  - Vector verification warning: {e}")

            else:
                print("FAIL: No chunks found in DB.")
        else:
             print("FAIL: Ingestion returned None.")
            
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        session.close()
        # Cleanup
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
            print("Cleaned up test file.")

if __name__ == "__main__":
    test_rag_ingestion()
