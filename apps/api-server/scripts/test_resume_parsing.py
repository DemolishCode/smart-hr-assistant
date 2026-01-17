"""
Test Script: Resume Parsing with Real PDF
Phase 4.1 Testing
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

API_URL = "http://localhost:8000/api/v1"

def create_sample_resume(filename: str):
    """Create a sample resume PDF using reportlab"""
    c = canvas.Canvas(filename, pagesize=letter)
    
    # Header
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(300, 750, "JOHN DOE")
    
    c.setFont("Helvetica", 10)
    c.drawCentredString(300, 735, "Email: john.doe@email.com | Phone: +66-123-456-789")
    
    # Professional Summary
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 700, "PROFESSIONAL SUMMARY")
    c.setFont("Helvetica", 10)
    c.drawString(50, 685, "Experienced Software Engineer with 5 years of expertise in Python,")
    c.drawString(50, 673, "JavaScript, and cloud technologies.")
    
    # Skills
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 640, "SKILLS")
    c.setFont("Helvetica", 10)
    c.drawString(50, 625, "Python, FastAPI, Django, JavaScript, React, Node.js, PostgreSQL,")
    c.drawString(50, 613, "Docker, Kubernetes, AWS, Git, Machine Learning, LangChain")
    
    # Experience
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 580, "WORK EXPERIENCE")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 565, "Senior Software Engineer - Tech Corp (2020-Present)")
    c.setFont("Helvetica", 10)
    c.drawString(50, 550, "- Led development of microservices architecture")
    c.drawString(50, 538, "- Implemented CI/CD pipelines")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, 510, "Software Developer - StartupXYZ (2018-2020)")
    c.setFont("Helvetica", 10)
    c.drawString(50, 495, "- Built RESTful APIs using FastAPI")
    c.drawString(50, 483, "- Developed React frontend applications")
    
    # Education
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, 450, "EDUCATION")
    c.setFont("Helvetica", 10)
    c.drawString(50, 435, "B.Sc. Computer Science - University of Technology (2018)")
    
    c.save()
    print(f"[OK] Created sample resume: {filename}")

def login() -> str:
    """Login and return access token"""
    response = requests.post(
        f"{API_URL}/auth/login",
        data={"username": "admin@example.com", "password": "1234"}
    )
    if response.status_code == 200:
        token = response.json()["access_token"]
        print("[OK] Login successful")
        return token
    else:
        print(f"[FAIL] Login failed: {response.text}")
        return None

def upload_resume(token: str, filepath: str):
    """Upload resume and get parsing result"""
    headers = {"Authorization": f"Bearer {token}"}
    
    with open(filepath, "rb") as f:
        files = {"file": (os.path.basename(filepath), f, "application/pdf")}
        response = requests.post(
            f"{API_URL}/resumes/upload",
            files=files,
            headers=headers
        )
    
    if response.status_code == 200:
        result = response.json()
        print("[OK] Resume parsed successfully!")
        print(f"    Result ID: {result.get('id', 'N/A')}")
        candidate = result.get('candidate', {})
        print(f"    Name: {candidate.get('full_name', 'N/A')}")
        print(f"    Email: {candidate.get('email', 'N/A')}")
        print(f"    Experience: {candidate.get('experience_years', 'N/A')} years")
        skills = candidate.get('skills', [])
        print(f"    Skills: {', '.join(skills) if skills else 'N/A'}")
        return result
    else:
        print(f"[FAIL] Resume upload failed: {response.status_code}")
        print(f"    Error: {response.text}")
        return None

def test_resume_parsing():
    """Test resume parsing flow"""
    print("\n" + "="*60)
    print("TEST: Resume Parsing with Sample PDF")
    print("="*60)
    
    # Step 1: Create sample resume
    resume_path = "sample_resume.pdf"
    create_sample_resume(resume_path)
    
    # Step 2: Login
    token = login()
    if not token:
        return False
    
    # Step 3: Upload and parse resume
    print("\n--- Uploading Resume ---")
    result = upload_resume(token, resume_path)
    
    # Cleanup
    if os.path.exists(resume_path):
        os.remove(resume_path)
        print(f"[OK] Cleaned up test file")
    
    if result:
        print("\n[DONE] Resume Parsing Test PASSED")
        return True
    else:
        print("\n[DONE] Resume Parsing Test FAILED")
        return False

if __name__ == "__main__":
    test_resume_parsing()
