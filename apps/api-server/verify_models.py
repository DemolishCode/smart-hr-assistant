import sys
import os

# Add the project root to sys.path so we can import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

try:
    from sqlalchemy import create_engine
    from app.models import Base
    # Import all models to ensure they are registered
    from app.models import User, Department, LeaveRequest, Job, Document
    
    print("Imports successful.")
    
    # Create in-memory SQLite database
    engine = create_engine("sqlite:///:memory:")
    
    # Note: pgvector types might cause issues with SQLite if not handled or if we strictly check compilation.
    # However, for just schema generation or avoiding import errors, this test is useful.
    # We might need to mock Vector type or just see if it fails.
    # SQLAlchemy generic types usually work, but Vector is dialect specific usually.
    # Let's see if it errors on import or creation.
    
    Base.metadata.create_all(engine)
    print("Schema creation successful (SQLite).")
    
except Exception as e:
    print(f"Verification failed: {e}")
    sys.exit(1)
