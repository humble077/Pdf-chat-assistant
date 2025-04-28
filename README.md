# PDF Chat Assistant

A modern web application that allows users to upload PDF documents and interact with them through a chat interface. Built with React, TypeScript, and FastAPI, this application uses advanced RAG (Retrieval-Augmented Generation) techniques to provide accurate answers based on the content of uploaded PDFs.

## Features

- PDF document upload and processing
- Interactive chat interface
- Real-time question answering
- Modern, responsive UI
- Secure file handling
- Efficient document indexing and retrieval

## Tech Stack

### Frontend
- React
- TypeScript
- Styled Components
- Axios for API calls

### Backend
- FastAPI
- Python
- LangChain
- HuggingFace Transformers
- ChromaDB for vector storage

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- npm or yarn
- OpenAI API key (required for the backend)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/humble077/Pdf-chat-assistant.git
cd pdf-chat-assistant
```

2. Install frontend dependencies:
```bash
npm install
```

3. Set up the backend:
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Environment Configuration

1. Create a `.env` file in the root directory with the following variables:
```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here  # Get this from https://platform.openai.com/api-keys

# Backend Configuration
BACKEND_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:3000

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000
```

2. Create a `.env` file in the backend directory with the same variables.

Note: Make sure to never commit your actual `.env` files to version control. They are already included in `.gitignore`.

### Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

2. In a new terminal, start the frontend development server:
```bash
cd ..
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Usage

1. Upload a PDF document through the web interface
2. Wait for the document to be processed
3. Start asking questions about the document's content
4. Receive accurate answers based on the document's content

## Troubleshooting

### Common Issues

1. **Backend Server Not Starting**
   - Ensure Python virtual environment is activated
   - Check if all dependencies are installed correctly
   - Verify OpenAI API key is set correctly

2. **Frontend Not Connecting to Backend**
   - Ensure both servers are running
   - Check if CORS is properly configured
   - Verify environment variables are set correctly

3. **PDF Upload Issues**
   - Ensure the file is a valid PDF
   - Check file size (should be reasonable)
   - Verify backend has write permissions to upload directory

## Development

### Project Structure
```
pdf-chat-assistant/
├── backend/           # FastAPI backend
│   ├── main.py       # Main application file
│   ├── requirements.txt
│   ├── uploads/      # PDF upload directory
│   └── chroma_db/    # Vector store directory
├── src/              # React frontend
│   ├── components/   # React components
│   ├── services/     # API services
│   └── ...
└── public/           # Static files
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request