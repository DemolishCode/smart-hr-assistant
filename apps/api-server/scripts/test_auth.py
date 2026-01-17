import requests
import sys
import time

BASE_URL = "http://localhost:8000/api/v1/auth"

def test_login():
    print("Testing Login Endpoint...")
    
    # 1. Success Case
    payload = {
        "username": "admin@example.com",
        "password": "admin"
    }
    try:
        response = requests.post(f"{BASE_URL}/login", data=payload)
        if response.status_code == 200:
            token = response.json().get("access_token")
            if token:
                print("PASS: Login successful. Token received.")
                print(f"  - Token: {token[:20]}...")
            else:
                print("FAIL: Login successful but no token in response.")
        else:
            print(f"FAIL: Login failed with status {response.status_code}")
            print(f"  - Response: {response.text}")

    except Exception as e:
        print(f"ERROR: Could not connect to API. Is it running? {e}")
        return

    # 2. Failure Case
    print("\nTesting Invalid Login...")
    payload_bad = {
        "username": "admin@example.com",
        "password": "wrongpassword"
    }
    response = requests.post(f"{BASE_URL}/login", data=payload_bad)
    if response.status_code == 400:
        print("PASS: Invalid login correctly rejected.")
    else:
        print(f"FAIL: Invalid login got status {response.status_code}")

if __name__ == "__main__":
    # Wait for server to start
    print("Waiting for server to start...")
    time.sleep(5)
    test_login()
