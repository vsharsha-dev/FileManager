import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Button,
    Box,
    CssBaseline,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import FileList from './components/FileList';
import FileUpload from './components/FileUpload';
import FilePreviewPage from './pages/FilePreviewPage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                File Manager
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Files
              </Button>
              <Button color="inherit" component={Link} to="/upload">
                Upload
              </Button>
            </Toolbar>
          </AppBar>
          <Container>
            <Routes>
              <Route path="/" element={<FileList />} />
              <Route path="/upload" element={<FileUpload />} />
              <Route path="/preview/:filename" element={<FilePreviewPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 