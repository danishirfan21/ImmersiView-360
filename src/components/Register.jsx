import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Container, Alert, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await api.post('/auth/register', { username, password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed');
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
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join ImmersiView 360 to start creating tours
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>Registration successful! Redirecting to login...</Alert>}

            {!success && (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Username"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{ sx: { borderRadius: 2 } }}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{ sx: { borderRadius: 2 } }}
                    required
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{ sx: { borderRadius: 2 } }}
                    required
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
                    Register
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    component={Link}
                    to="/login"
                  >
                    Already have an account? Sign In
                  </Button>
                </Stack>
              </form>
            )}
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

export default Register;
