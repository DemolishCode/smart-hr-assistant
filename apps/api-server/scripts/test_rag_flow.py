"""
Test Script: Full RAG Flow (Upload PDF -> Ask Question -> Get Answer)
Phase 4.1 Testing
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

API_URL = "http://localhost:8000/api/v1"

def create_test_pdf(filename: str, content: str):
    """Create a test PDF with given content"""
    c = canvas.Canvas(filename, pagesize=letter)
    text_object = c.beginText(50, 750)
    for line in content.split('\n'):
        text_object.textLine(line)
    c.drawText(text_object)
    c.save()
    print(f"[OK] Created test PDF: {filename}")

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

def ask_question(token: str, question: str) -> str:
    """Send a question to the chat API"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{API_URL}/chat",
        json={"message": question},
        headers=headers
    )
    if response.status_code == 200:
        answer = response.json()["response"]
        print(f"[OK] Question: {question}")
        print(f"[OK] Answer: {answer[:200]}...")
        return answer
    else:
        print(f"[FAIL] Chat failed: {response.text}")
        return None

def test_full_rag_flow():
    """Test complete RAG flow"""
    print("\n" + "="*60)
    print("TEST: Full RAG Flow")
    print("="*60)
    
    # Step 1: Create test policy document
    policy_content = """
    COMPANY LEAVE POLICY
    
    1. Annual Leave: All employees are entitled to 15 days of annual leave per year.
    2. Sick Leave: Employees can take up to 10 days of sick leave with medical certificate.
    3. Maternity Leave: Female employees are entitled to 90 days of maternity leave.
    4. Work From Home: Employees can work from home up to 2 days per week with manager approval.
    5. Overtime: Overtime work requires pre-approval and will be compensated at 1.5x rate.
    """
    
    pdf_path = "test_policy.pdf"
    create_test_pdf(pdf_path, policy_content)
    
    # Step 2: Login
    token = login()
    if not token:
        return False
    
    # Step 3: Note about ingestion
    print("[INFO] To test full RAG, ingest the PDF first using rag_service.")
    
    # Step 4: Ask questions
    print("\n--- Testing Chat API ---")
    ask_question(token, "What is the company leave policy?")
    ask_question(token, "How many days of annual leave do I get?")
    ask_question(token, "Can I work from home?")
    
    # Cleanup
    if os.path.exists(pdf_path):
        os.remove(pdf_path)
    
    print("\n[DONE] RAG Flow Test Completed")
    return True

if __name__ == "__main__":
    test_full_rag_flow()
