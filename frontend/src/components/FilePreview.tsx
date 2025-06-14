import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    IconButton,
    Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { fileService } from '../services/fileService';

interface FilePreviewProps {
    filename: string;
    onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ filename, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState<string | null>(null);
    const [contentType, setContentType] = useState<string | null>(null);

    useEffect(() => {
        const loadPreview = async () => {
            try {
                const { data, contentType } = await fileService.previewFile(filename);
                setContentType(contentType);

                if (contentType.startsWith('text/') || contentType === 'application/json') {
                    const text = await data.text();
                    setContent(text);
                } else if (contentType.startsWith('image/')) {
                    const url = URL.createObjectURL(data);
                    setContent(url);
                } else if (contentType === 'application/pdf') {
                    const url = URL.createObjectURL(data);
                    setContent(url);
                } else {
                    const text = await data.text();
                    setContent(text);
                }
            } catch (err) {
                setError('Failed to load file preview');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadPreview();
    }, [filename]);

    const renderContent = () => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Alert severity="error" sx={{ m: 2 }}>
                    {error}
                </Alert>
            );
        }

        if (!content) {
            return (
                <Alert severity="info" sx={{ m: 2 }}>
                    No preview available
                </Alert>
            );
        }

        if (contentType?.startsWith('image/')) {
            return (
                <Box display="flex" justifyContent="center" p={2}>
                    <img
                        src={content}
                        alt={filename}
                        style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                    />
                </Box>
            );
        }

        if (contentType === 'application/pdf') {
            return (
                <Box height="80vh" p={2}>
                    <iframe
                        src={content}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={filename}
                    />
                </Box>
            );
        }

        return (
            <Box p={2}>
                <pre style={{ 
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    maxHeight: '80vh',
                    overflow: 'auto',
                    margin: 0,
                    padding: '1rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px'
                }}>
                    {content}
                </pre>
            </Box>
        );
    };

    return (
        <Paper
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90vw',
                maxWidth: '1200px',
                height: '90vh',
                zIndex: 1300,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Typography variant="h6">{filename}</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {renderContent()}
            </Box>
        </Paper>
    );
};

export default FilePreview; 