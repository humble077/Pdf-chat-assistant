# PDF Chat Assistant - Source Code Documentation

## Project Structure
```
pdf-chat-assistant/
├── backend/
│   ├── main.py              # FastAPI application and endpoints
│   ├── requirements.txt     # Python dependencies
│   ├── uploads/            # Temporary PDF storage
│   └── chroma_db/         # Vector store persistence
├── src/
│   ├── components/        # React components
│   ├── services/         # API services
│   ├── App.tsx          # Main application component
│   └── index.tsx        # Application entry point
└── public/              # Static assets
```

## Backend Documentation

### main.py
The core backend file containing the FastAPI application and all endpoints.

#### Key Components:

1. **FastAPI Application Setup**
```python
app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. **Vector Store Management**
```python
def get_vectorstore():
    global vectorstore
    if vectorstore is None:
        vectorstore = Chroma(
            collection_name="pdf_store",
            persist_directory=str(CHROMA_DIR.absolute()),
            embedding_function=embeddings
        )
    return vectorstore
```

3. **PDF Processing Pipeline**
```python
def process_pdf(file_path: str) -> List[str]:
    # Load and split the PDF
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    # Split into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    
    return text_splitter.split_documents(documents)
```

4. **API Endpoints**
```python
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # PDF upload and processing logic

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    # Question answering logic
```

## Frontend Documentation

### Components

1. **App.tsx**
```typescript
// Main application component
function App() {
  return (
    <div className="App">
      <PDFUploader />
      <ChatInterface />
    </div>
  );
}
```

2. **PDFUploader Component**
```typescript
// Handles PDF file upload
const PDFUploader = () => {
  const handleUpload = async (file: File) => {
    try {
      await uploadPDF(file);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
};
```

3. **ChatInterface Component**
```typescript
// Manages chat interactions
const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handleQuestion = async (question: string) => {
    try {
      const response = await askQuestion(question);
      // Update messages
    } catch (error) {
      // Handle error
    }
  };
};
```

### Services

1. **API Service (api.ts)**
```typescript
// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// PDF upload service
export const uploadPDF = async (file: File): Promise<{ filename: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
};

// Question asking service
export const askQuestion = async (question: string): Promise<{ answer: string }> => {
  const response = await fetch(`${API_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });
  
  return response.json();
};
```

## Data Flow

### 1. PDF Upload Flow
```
User → Frontend → Backend → Vector Store
1. User selects PDF file
2. Frontend sends file to backend
3. Backend processes PDF and stores in vector store
4. Success response sent to frontend
```

### 2. Question Answering Flow
```
User → Frontend → Backend → Vector Store → OpenAI → User
1. User asks question
2. Frontend sends question to backend
3. Backend retrieves relevant context from vector store
4. Backend sends context + question to OpenAI
5. OpenAI generates answer
6. Answer sent back to user
```

## Key Classes and Interfaces

### Backend Models
```python
class QuestionRequest(BaseModel):
    question: str
    pdf_name: Optional[str] = None
```

### Frontend Types
```typescript
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface PDFFile {
  name: string;
  size: number;
  type: string;
}
```

## Error Handling

### Backend Error Handling
```python
try:
    # Operation
except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
```

### Frontend Error Handling
```typescript
try {
  // API call
} catch (error) {
  // Display error to user
  console.error('Error:', error);
}
```

## Configuration

### Environment Variables
```bash
# Backend
OPENAI_API_KEY=your_key
ALLOWED_ORIGINS=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## Testing

### Backend Testing
```python
# Example test case
def test_upload_pdf():
    # Test PDF upload functionality
    pass

def test_ask_question():
    # Test question answering
    pass
```

### Frontend Testing
```typescript
// Example test case
test('PDF upload works correctly', async () => {
  // Test upload functionality
});

test('Question answering works correctly', async () => {
  // Test question answering
});
```

## Performance Optimization

### Backend Optimizations
1. **PDF Processing**
   - Efficient chunking
   - Parallel processing
   - Memory management

2. **Vector Search**
   - Index optimization
   - Query optimization
   - Caching

### Frontend Optimizations
1. **State Management**
   - Efficient updates
   - Memoization
   - Lazy loading

2. **API Calls**
   - Request batching
   - Response caching
   - Error retry logic

## Security Considerations

### Backend Security
1. **Input Validation**
   - PDF file validation
   - Question sanitization
   - API key protection

2. **Access Control**
   - CORS configuration
   - Rate limiting
   - Error handling

### Frontend Security
1. **Data Protection**
   - Input sanitization
   - Secure API calls
   - Error handling

2. **User Experience**
   - Loading states
   - Error messages
   - Retry mechanisms 