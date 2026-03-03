import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Container, Alert, Stack } from '@mui/material';
import { api } from '../api/client';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ p: 3, borderRadius: 4 }}>
          <CardContent>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom color="primary">
                ImmersiView 360
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to manage your virtual tours
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="large"
                  sx={{
                    mt: 1,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={onSwitchToRegister}
                >
                  Don't have an account? Sign Up
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ mt: 3, color: 'rgba(255,255,255,0.5)' }}
        >
          &copy; {new Date().getFullYear()} ImmersiView 360. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
