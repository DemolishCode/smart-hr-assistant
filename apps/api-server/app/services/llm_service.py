import os
from langchain_ollama import ChatOllama, OllamaEmbeddings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
LLM_MODEL_NAME = os.getenv("LLM_MODEL_NAME", "llama3")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME", "nomic-embed-text")

class LLMService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LLMService, cls).__new__(cls)
            cls._instance.initialize()
        return cls._instance
    
    def initialize(self):
        print(f"Initializing AI Service with Ollama at {OLLAMA_BASE_URL}...")
        print(f"  - Chat Model: {LLM_MODEL_NAME}")
        print(f"  - Embedding Model: {EMBEDDING_MODEL_NAME}")
        
        try:
            self.llm = ChatOllama(
                base_url=OLLAMA_BASE_URL,
                model=LLM_MODEL_NAME,
                temperature=0.7
            )
            
            self.embeddings = OllamaEmbeddings(
                base_url=OLLAMA_BASE_URL,
                model=EMBEDDING_MODEL_NAME
            )
            print("AI Service initialized successfully.")
        except Exception as e:
            print(f"Failed to initialize AI Service: {e}")
            raise e

    def get_chat_response(self, message: str) -> str:
        """
        Get a simple chat response from the LLM.
        """
        try:
            response = self.llm.invoke(message)
            return response.content
        except Exception as e:
            print(f"Error generating chat response: {e}")
            return "Sorry, I am unable to process your request at the moment."

    def generate_embedding(self, text: str) -> list[float]:
        """
        Generate vector embedding for a given text.
        """
        try:
            return self.embeddings.embed_query(text)
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return []

# Singleton instance
llm_service = LLMService()

def get_chat_response(message: str) -> str:
    return llm_service.get_chat_response(message)

def generate_embedding(text: str) -> list[float]:
    return llm_service.generate_embedding(text)
