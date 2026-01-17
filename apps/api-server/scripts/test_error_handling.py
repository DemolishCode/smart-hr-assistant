"""
Test Script: Error Handling Verification
Phase 4.1 Testing
"""
import requests

API_URL = "http://localhost:8000/api/v1"

def test_error_handling():
    """Test various error scenarios"""
    print("\n" + "="*60)
    print("TEST: Error Handling Verification")
    print("="*60)
    
    all_passed = True
    
    # Test 1: Invalid Login
    print("\n--- Test 1: Invalid Login Credentials ---")
    response = requests.post(
        f"{API_URL}/auth/login",
        data={"username": "wrong@email.com", "password": "wrongpassword"}
    )
    if response.status_code == 400:
        print(f"[OK] Invalid login returns 400: {response.json().get('detail', 'No detail')}")
    else:
        print(f"[FAIL] Expected 400, got {response.status_code}")
        all_passed = False
    
    # Test 2: Access Protected Endpoint Without Token
    print("\n--- Test 2: Access Without Token ---")
    response = requests.get(f"{API_URL}/users/me")
    if response.status_code == 401:
        print(f"[OK] Unauthorized access returns 401")
    else:
        print(f"[FAIL] Expected 401, got {response.status_code}")
        all_passed = False
    
    # Test 3: Invalid Token
    print("\n--- Test 3: Invalid Token ---")
    response = requests.get(
        f"{API_URL}/users/me",
        headers={"Authorization": "Bearer invalid_token_here"}
    )
    if response.status_code == 401:
        print(f"[OK] Invalid token returns 401")
    else:
        print(f"[FAIL] Expected 401, got {response.status_code}")
        all_passed = False
    
    # Test 4: Upload Invalid File Type
    print("\n--- Test 4: Upload Non-PDF File ---")
    login_resp = requests.post(
        f"{API_URL}/auth/login",
        data={"username": "admin@example.com", "password": "1234"}
    )
    if login_resp.status_code == 200:
        token = login_resp.json()["access_token"]
        files = {"file": ("test.txt", b"This is not a PDF", "text/plain")}
        response = requests.post(
            f"{API_URL}/resumes/upload",
            files=files,
            headers={"Authorization": f"Bearer {token}"}
        )
        if response.status_code in [400, 422]:
            print(f"[OK] Invalid file type returns error: {response.status_code}")
        else:
            print(f"[WARN] File type validation may accept non-PDF: {response.status_code}")
    
    # Test 5: Chat with Empty Message
    print("\n--- Test 5: Chat with Empty Message ---")
    if login_resp.status_code == 200:
        response = requests.post(
            f"{API_URL}/chat",
            json={"message": ""},
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"[INFO] Empty message response: {response.status_code}")
    
    # Summary
    print("\n" + "="*60)
    if all_passed:
        print("[DONE] All Error Handling Tests PASSED")
    else:
        print("[DONE] Some Error Handling Tests FAILED")
    print("="*60)
    
    return all_passed

if __name__ == "__main__":
    test_error_handling()
