import React, { useState, useEffect } from 'react';
import TourManager from './components/TourManager';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { CssBaseline, ThemeProvider, createTheme, Box, Tab, Tabs } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#7c3aed',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
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
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} centered>
          <Tab label="Tour Editor" />
          <Tab label="Dashboard" />
          <Tab label="Logout" onClick={handleLogout} />
        </Tabs>
      </Box>
      <Box sx={{ mt: 2 }}>
        {currentTab === 0 && <TourManager />}
        {currentTab === 1 && <AdminDashboard />}
      </Box>
    </ThemeProvider>
  );
}

export default App;
