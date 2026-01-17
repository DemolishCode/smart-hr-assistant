import requests
import sys
import time
import os
from reportlab.pdfgen import canvas

BASE_URL = "http://localhost:8000/api/v1"

def create_dummy_resume(filename="resume.pdf"):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "John Doe")
    c.drawString(100, 730, "Email: johndoe@example.com")
    c.drawString(100, 710, "Phone: 123-456-7890")
    c.drawString(100, 690, "Skills: Python, FastAPI, Docker, React")
    c.drawString(100, 670, "Experience: Software Engineer at Tech Corp.")
    c.save()
    return filename

def test_features():
    print("Starting Feature Tests...")
    
    # 1. Login to get Token
    print("\n[1] Logging in...")
    auth_payload = {"username": "admin@example.com", "password": "1234"}
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", data=auth_payload)
        if resp.status_code != 200:
            print(f"FAIL: Login failed ({resp.status_code})")
            return
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("PASS: Login successful.")
    except Exception as e:
        print(f"ERROR: Login failed with exception: {e}")
        return

    # 2. Test User Profile
    print("\n[2] Testing GET /users/me...")
    resp = requests.get(f"{BASE_URL}/users/me", headers=headers)
    if resp.status_code == 200:
        data = resp.json()
        print(f"PASS: Got profile for {data['email']} ({data['role']})")
    else:
        print(f"FAIL: /users/me failed ({resp.status_code})")

    # 3. Test Chat
    print("\n[3] Testing POST /chat...")
    chat_payload = {"message": "Hello, who are you?"}
    resp = requests.post(f"{BASE_URL}/chat/", json=chat_payload, headers=headers)
    if resp.status_code == 200:
        data = resp.json()
        print(f"PASS: Chat response received: {data['response'][:50]}...")
    else:
        print(f"FAIL: /chat failed ({resp.status_code}) - {resp.text}")

    # 4. Test Resume Upload
    print("\n[4] Testing POST /resumes/upload...")
    pdf_path = create_dummy_resume("test_resume.pdf")
    try:
        with open(pdf_path, "rb") as f:
            files = {"file": ("test_resume.pdf", f, "application/pdf")}
            resp = requests.post(f"{BASE_URL}/resumes/upload", headers=headers, files=files)
        
        if resp.status_code == 200:
            data = resp.json()
            print("PASS: Resume uploaded.")
            print(f"  - Parsed: {data['parsed_data']}")
        else:
            print(f"FAIL: /resumes/upload failed ({resp.status_code}) - {resp.text}")
    except Exception as e:
        print(f"ERROR: Upload failed: {e}")
    finally:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

if __name__ == "__main__":
    test_features()
