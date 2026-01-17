import sys
import os
import bcrypt
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add parent directory to path to import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models import Base, User

# Load env vars from root
load_dotenv(os.path.join(os.path.dirname(__file__), '../../../.env'))

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Error: DATABASE_URL not set in .env")
    sys.exit(1)

# Setup DB connection
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def fix_password():
    session = SessionLocal()
    try:
        email = "admin@example.com"
        new_password = "1234"
        
        stmt = select(User).where(User.email == email)
        user = session.execute(stmt).scalars().first()
        
        if user:
            print(f"Updating password for {email} to '{new_password}'...")
            user.password_hash = get_password_hash(new_password)
            session.add(user)
            session.commit()
            print("SUCCESS: Password updated.")
        else:
            print(f"ERROR: User {email} not found.")

    except Exception as e:
        print(f"ERROR: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    fix_password()
