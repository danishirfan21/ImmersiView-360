import React, { useState, useEffect } from 'react';
import TourManager from './components/TourManager';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
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

function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

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

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
          {currentTab === 0 && <TourManager />}
          {currentTab === 1 && <AdminDashboard />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
