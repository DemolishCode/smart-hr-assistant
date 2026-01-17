import sys
import os
import time

# Add parent directory to path to import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.llm_service import get_chat_response, generate_embedding

def test_llm():
    print("Testing LLM Connection...")
    start = time.time()
    response = get_chat_response("Hello, are you ready?")
    print(f"Response: {response}")
    print(f"Time taken: {time.time() - start:.2f}s")
    
    if "unable to process" in response:
        print("FAIL: Chat generation failed.")
    else:
        print("PASS: Chat generation successful.")

def test_embedding():
    print("\nTesting Embedding Generation...")
    start = time.time()
    embedding = generate_embedding("This is a test sentence for embedding.")
    if embedding and len(embedding) == 768:
        print(f"PASS: Embedding generated successfully (Dimension: {len(embedding)})")
    else:
        print(f"FAIL: Embedding generation failed or wrong dimension. Got {len(embedding) if embedding else 'None'}")
    print(f"Time taken: {time.time() - start:.2f}s")

if __name__ == "__main__":
    test_llm()
    test_embedding()
