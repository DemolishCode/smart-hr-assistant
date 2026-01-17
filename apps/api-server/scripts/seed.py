import sys
import os
import uuid
import bcrypt
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add parent directory to path to import app
# apps/api-server/scripts/.. -> apps/api-server
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models import Base, User, Department, UserRole

# Load env vars from root
# apps/api-server/scripts/../../.. -> root
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

def seed():
    session = SessionLocal()
    try:
        print("Starting seed process...")

        # 1. Create Departments
        print("Checking/Creating departments...")
        dept_names = ["HR", "IT", "Sales", "Engineering"]
        departments = {}
        
        for name in dept_names:
            stmt = select(Department).where(Department.name == name)
            dept = session.execute(stmt).scalars().first()
            if not dept:
                print(f"  - Creating department: {name}")
                dept = Department(name=name)
                session.add(dept)
                session.flush() # Flush to assign ID
            else:
                print(f"  - Department exists: {name}")
            departments[name] = dept
        
        # 2. Create Superuser (Admin)
        print("Checking/Creating superuser...")
        admin_email = os.getenv("FIRST_SUPERUSER_EMAIL", "admin@example.com")
        admin_password = os.getenv("FIRST_SUPERUSER_PASSWORD", "admin")
        
        stmt = select(User).where(User.email == admin_email)
        admin = session.execute(stmt).scalars().first()
        
        if not admin:
            print(f"  - Creating superuser: {admin_email}")
            admin = User(
                email=admin_email,
                password_hash=get_password_hash(admin_password),
                full_name="Super Admin",
                role=UserRole.ADMIN,
                is_active=True,
                department_id=departments["IT"].id,
                position="CTO"
            )
            session.add(admin)
            session.flush()
        else:
            print(f"  - Superuser already exists: {admin_email}")

        # 3. Create Mock Employees
        print("Checking/Creating mock employees...")
        employees_data = [
            {"email": "hr@example.com", "name": "Jane HR", "role": UserRole.HR, "dept": "HR", "pos": "HR Manager"},
            {"email": "dev@example.com", "name": "John Dev", "role": UserRole.EMPLOYEE, "dept": "Engineering", "pos": "Senior Engineer"},
            {"email": "manager@example.com", "name": "Mike Manager", "role": UserRole.MANAGER, "dept": "Sales", "pos": "Sales Director"},
        ]

        for emp_data in employees_data:
             stmt = select(User).where(User.email == emp_data["email"])
             user = session.execute(stmt).scalars().first()
             if not user:
                 print(f"  - Creating user: {emp_data['email']}")
                 user = User(
                     email=emp_data["email"],
                     password_hash=get_password_hash("password123"), # Default password
                     full_name=emp_data["name"],
                     role=emp_data["role"],
                     department_id=departments[emp_data["dept"]].id,
                     position=emp_data["pos"],
                     is_active=True
                 )
                 session.add(user)
             else:
                 print(f"  - User exists: {emp_data['email']}")
        
        # 4. Assign Managers (Optional - e.g., Admin manages IT)
        if admin and departments["IT"].manager_id is None:
             print("  - Assigning Admin as IT Manager")
             departments["IT"].manager_id = admin.id
             session.add(departments["IT"])

        session.commit()
        print("SUCCESS: Database seeding completed!")

    except Exception as e:
        print(f"ERROR: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    seed()
