import React from 'react';
import { Box, Typography, Button, Container, Stack, Link, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import { motion } from 'framer-motion';

const Outro = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0f172a',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#3b82f6' }}>
              ImmersiView 360
            </Typography>

            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Thank You for Exploring
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7, fontSize: '1.1rem' }}>
                We hope you enjoyed this cinematic demonstration of the future of real estate presentations.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#3b82f6',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: '#2563eb' }
              }}
            >
              Back to Start
            </Button>

            <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
              <IconButton
                component={Link}
                href="https://github.com"
                target="_blank"
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#3b82f6' },
                  transition: 'all 0.3s'
                }}
              >
                <GitHubIcon fontSize="large" />
              </IconButton>
              <IconButton
                component={Link}
                href="#"
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#3b82f6' },
                  transition: 'all 0.3s'
                }}
              >
                <LanguageIcon fontSize="large" />
              </IconButton>
            </Stack>

            <Typography variant="caption" sx={{ opacity: 0.4 }}>
              &copy; {new Date().getFullYear()} ImmersiView 360. All rights reserved.
            </Typography>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Outro;
