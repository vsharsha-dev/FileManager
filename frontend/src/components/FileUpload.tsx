import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { fileService } from '../services/fileService';

const SUPPORTED_FILE_TYPES = ['txt', 'pdf', 'jpg', 'jpeg', 'png', 'json'];

const FileUpload: React.FC = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (!fileExtension || !SUPPORTED_FILE_TYPES.includes(fileExtension)) {
            setError(`File type not supported. Supported types: ${SUPPORTED_FILE_TYPES.join(', ')}`);
            return;
        }

        setSelectedFile(file);
        setError(null);
        setSuccess(null);

        try {
            const files = await fileService.listFiles();
            const isDuplicate = files.some(f => f.originalFilename === file.name);
            
            if (isDuplicate) {
                setShowDuplicateDialog(true);
            } else {
                handleUpload(file);
            }
        } catch (err) {
            setError('Failed to check for duplicate files');
            console.error(err);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'text/plain': ['.txt'],
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'application/json': ['.json']
        }
    });

    const handleUpload = async (file: File) => {
        setUploading(true);
        setError(null);
        setSuccess(null);

        try {
            await fileService.uploadFile(file);
            setSuccess(`File "${file.name}" uploaded successfully!`);
            setSelectedFile(null);
        } catch (err) {
            setError('Failed to upload file. Please try again.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleDuplicateConfirm = () => {
        if (selectedFile) {
            handleUpload(selectedFile);
        }
        setShowDuplicateDialog(false);
    };

    return (
        <Box p={3}>
            <Paper
                {...getRootProps()}
                sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'divider',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
            >
                <input {...getInputProps()} disabled={uploading} />
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                    {isDragActive
                        ? 'Drop the file here'
                        : 'Drag and drop a file here, or click to select'}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Supported file types: {SUPPORTED_FILE_TYPES.join(', ')}
                </Typography>
                {uploading && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <CircularProgress size={24} />
                    </Box>
                )}
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {success}
                </Alert>
            )}

            <Dialog
                open={showDuplicateDialog}
                onClose={() => setShowDuplicateDialog(false)}
            >
                <DialogTitle>Duplicate File</DialogTitle>
                <DialogContent>
                    <Typography>
                        A file with the same name already exists. Do you want to upload it anyway?
                        The file will be renamed with a number appended to it.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDuplicateDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleDuplicateConfirm} color="primary" variant="contained">
                        Upload Anyway
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FileUpload; 