import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Paper,
    Alert,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { fileService } from '../services/fileService';

const FilePreviewPage: React.FC = () => {
    const { filename } = useParams<{ filename: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState<string | null>(null);
    const [contentType, setContentType] = useState<string | null>(null);

    useEffect(() => {
        if (!filename) {
            setError('No filename provided');
            setLoading(false);
            return;
        }

        const loadPreview = async () => {
            try {
                const response = await fileService.previewFile(filename);
                setContent(response.content);
                setContentType(response.contentType);
                setError(null);
            } catch (err) {
                console.error('Preview error:', err);
                setError('Failed to load file preview');
            } finally {
                setLoading(false);
            }
        };

        loadPreview();
    }, [filename]);

    const renderContent = () => {
        if (!content || !contentType) return null;

        if (contentType.startsWith('image/')) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                    <img
                        src={`data:${contentType};base64,${content}`}
                        alt={filename}
                        style={{ maxWidth: '100%', maxHeight: '80vh' }}
                    />
                </Box>
            );
        }

        if (contentType.startsWith('text/')) {
            return (
                <Paper elevation={3} sx={{ p: 2, maxHeight: '80vh', overflow: 'auto' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {content}
                    </pre>
                </Paper>
            );
        }

        return (
            <Alert severity="info">
                This file type cannot be previewed. Please download the file to view its contents.
            </Alert>
        );
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mb: 2 }}
                >
                    Back to Files
                </Button>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ mb: 2 }}
            >
                Back to Files
            </Button>
            <Typography variant="h5" gutterBottom>
                {filename}
            </Typography>
            {renderContent()}
        </Box>
    );
};

export default FilePreviewPage; 