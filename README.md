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

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pdf-chat-assistant.git
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
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

2. Start the frontend development server:
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.