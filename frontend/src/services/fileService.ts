import axios from 'axios';
import { FileMetadata } from '../types/FileMetadata';

const API_URL = 'http://localhost:8080/files';

export const fileService = {
    uploadFile: async (file: File): Promise<FileMetadata> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Upload error:', error);
            throw new Error('Failed to upload file');
        }
    },

    listFiles: async (): Promise<FileMetadata[]> => {
        try {
            const response = await axios.get(`${API_URL}`);
            return response.data;
        } catch (error) {
            console.error('List error:', error);
            throw new Error('Failed to list files');
        }
    },

    downloadFile: async (filename: string): Promise<Blob> => {
        try {
            const response = await axios.get(`${API_URL}/${filename}`, {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            console.error('Download error:', error);
            throw new Error('Failed to download file');
        }
    },

    deleteFile: async (filename: string): Promise<void> => {
        try {
            await axios.delete(`${API_URL}/${filename}`);
        } catch (error) {
            console.error('Delete error:', error);
            throw new Error('Failed to delete file');
        }
    },

    previewFile: async (filename: string): Promise<{ content: string; contentType: string }> => {
        try {
            const response = await axios.get(`${API_URL}/preview/${filename}`, {
                responseType: 'blob',
            });
            
            const contentType = response.headers['content-type'];
            const blob = response.data;
            
            if (contentType.startsWith('image/')) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64data = reader.result as string;
                        resolve({
                            content: base64data.split(',')[1],
                            contentType
                        });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } else if (contentType.startsWith('text/')) {
                const text = await blob.text();
                return {
                    content: text,
                    contentType
                };
            } else {
                throw new Error('Unsupported file type for preview');
            }
        } catch (error) {
            console.error('Preview error:', error);
            throw new Error('Failed to preview file');
        }
    }
}; 