import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TourManager from './components/TourManager';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import Outro from './components/Outro';
import { CssBaseline, ThemeProvider, createTheme, Box, Tab, Tabs, AppBar, Toolbar, Typography, Button, Container, Stack } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f172a',
    },
    secondary: {
      main: '#3b82f6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0',
          boxShadow: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.9rem',
        },
      },
    },
  },
});

const AdminLayout = ({ user, handleLogout }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [editingTourId, setEditingTourId] = useState(null);

  if (!user) return <Navigate to="/login" />;

  const handleSelectTour = (tourId) => {
    setEditingTourId(tourId);
    setCurrentTab(0); // Switch to Tour Editor tab
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
              ImmersiView 360
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color={currentTab === 0 ? "primary" : "inherit"}
                variant={currentTab === 0 ? "contained" : "text"}
                onClick={() => setCurrentTab(0)}
                sx={{
                  px: 2,
                  ...(currentTab === 0 && {
                    bgcolor: 'rgba(15, 23, 42, 0.05)',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.1)' }
                  })
                }}
              >
                Tour Editor
              </Button>
              <Button
                color={currentTab === 1 ? "primary" : "inherit"}
                variant={currentTab === 1 ? "contained" : "text"}
                onClick={() => setCurrentTab(1)}
                sx={{
                  px: 2,
                  ...(currentTab === 1 && {
                    bgcolor: 'rgba(15, 23, 42, 0.05)',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.1)' }
                  })
                }}
              >
                Dashboard
              </Button>
              <Button
                color="error"
                onClick={handleLogout}
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
        {currentTab === 0 && <TourManager initialTourId={editingTourId} />}
        {currentTab === 1 && <AdminDashboard onSelectTour={handleSelectTour} />}
      </Container>
    </Box>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/outro" element={<Outro />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/admin" /> : <Register />}
          />
          <Route path="/admin" element={<AdminLayout user={user} handleLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
