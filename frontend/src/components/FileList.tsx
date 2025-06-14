import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
} from '@mui/material';
import { Download as DownloadIcon, Delete as DeleteIcon, Image as ImageIcon, Description as DescriptionIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { FileMetadata } from '../types/FileMetadata';
import { fileService } from '../services/fileService';

const FileList: React.FC = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState<FileMetadata[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<FileMetadata | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const data = await fileService.listFiles();
            setFiles(data);
            setError(null);
        } catch (err) {
            setError('Failed to load files');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (filename: string) => {
        try {
            const blob = await fileService.downloadFile(filename);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const handleDeleteClick = (file: FileMetadata) => {
        setFileToDelete(file);
        setDeleteDialogOpen(true);
        setDeleteError(null);
    };

    const handleDeleteConfirm = async () => {
        if (!fileToDelete) return;

        try {
            await fileService.deleteFile(fileToDelete.filename);
            setFiles(files.filter(f => f.filename !== fileToDelete.filename));
            setDeleteDialogOpen(false);
            setFileToDelete(null);
        } catch (err) {
            setDeleteError('Failed to delete file');
            console.error('Delete failed:', err);
        }
    };

    const handlePreviewClick = (filename: string) => {
        console.log('Preview clicked for:', filename); // Debug log
        navigate(`/preview/${filename}`);
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) {
            return <ImageIcon />;
        }
        return <DescriptionIcon />;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Your Files
            </Typography>
            <Grid container spacing={3}>
                {files.map((file) => (
                    <Grid item xs={12} sm={6} md={4} key={file.id}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={1}>
                                    {getFileIcon(file.fileType)}
                                    <Typography variant="h6" ml={1} noWrap>
                                        {file.filename}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                    Size: {(file.size / 1024).toFixed(2)} KB
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Uploaded: {new Date(file.uploadTime).toLocaleString()}
                                </Typography>
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <IconButton
                                        onClick={() => handlePreviewClick(file.filename)}
                                        color="primary"
                                        title="Preview"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDownload(file.filename)}
                                        color="primary"
                                        title="Download"
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeleteClick(file)}
                                        color="error"
                                        title="Delete"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Delete File</DialogTitle>
                <DialogContent>
                    {deleteError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {deleteError}
                        </Alert>
                    )}
                    <Typography>
                        Are you sure you want to delete "{fileToDelete?.filename}"?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FileList; 