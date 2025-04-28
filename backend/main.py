from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
import os
from dotenv import load_dotenv
import platform
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
import openai

# Load environment variables
load_dotenv()

# Platform-specific setup
IS_WINDOWS = platform.system() == "Windows"

# Set OpenAI API Key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

app = FastAPI()

# CORS middleware configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories if they don't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Ensure ChromaDB directory exists
CHROMA_DIR = Path("chroma_db")
CHROMA_DIR.mkdir(exist_ok=True)

# Initialize embeddings
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Initialize vector store
vectorstore = None

def get_vectorstore():
    global vectorstore
    if vectorstore is None:
        vectorstore = Chroma(
            collection_name="pdf_store",
            persist_directory=str(CHROMA_DIR.absolute()),
            embedding_function=embeddings
        )
    return vectorstore

class QuestionRequest(BaseModel):
    question: str
    pdf_name: Optional[str] = None

def process_pdf(file_path: str) -> List[str]:
    # Load and split the PDF
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    # Split the documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    
    chunks = text_splitter.split_documents(documents)
    return chunks

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Delete all existing files in the upload directory
        for existing_file in UPLOAD_DIR.glob("*.pdf"):
            existing_file.unlink()
        
        # Get the vector store instance and reset it
        vectorstore = get_vectorstore()
        vectorstore.delete_collection()
        vectorstore = Chroma(
            collection_name="pdf_store",
            persist_directory=str(CHROMA_DIR.absolute()),
            embedding_function=embeddings
        )
        # Update the global vectorstore
        globals()['vectorstore'] = vectorstore
        
        # Save the uploaded PDF
        file_path = UPLOAD_DIR / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process the PDF
        chunks = process_pdf(str(file_path))
        
        # Add chunks to vector store
        vectorstore.add_documents(chunks)
        
        return {"message": "PDF uploaded and processed successfully", "filename": file.filename}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    try:
        # Get the vector store instance
        vectorstore = get_vectorstore()
        
        # Query vector store for relevant chunks
        docs = vectorstore.similarity_search(request.question, k=3)
        context = "\n\n".join(doc.page_content for doc in docs)
        
        # Create prompt for OpenAI
        prompt = f"""Based on the following context, please answer the question. If the answer cannot be found in the context, say "I cannot find the answer in the provided context."

Context:
{context}

Question: {request.question}

Answer:"""
        
        # Get completion from OpenAI
        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers questions based on the provided context."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return {"answer": completion.choices[0].message.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 