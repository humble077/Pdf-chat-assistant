const API_URL = 'http://localhost:8000';

export const uploadPDF = async (file: File): Promise<{ filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload PDF');
    }

    return response.json();
};

export const askQuestion = async (question: string, pdfName?: string): Promise<{ answer: string }> => {
    const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question,
            pdf_name: pdfName,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to get answer');
    }

    return response.json();
}; 