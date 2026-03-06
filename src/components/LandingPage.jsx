import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Tooltip, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PanoramaViewer from './PanoramaViewer';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const [hfov, setHfov] = useState(110);
  const comparisonRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setHfov((prev) => {
        if (prev <= 70) {
          clearInterval(timer);
          return 70;
        }
        return prev - 0.1;
      });
    }, 25); // ~40fps, ~10 seconds to go from 110 to 70
    return () => clearInterval(timer);
  }, []);

  const scrollToComparison = () => {
    comparisonRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Mock room for landing page background
  const landingRoom = {
    panoramaUrl: 'https://pannellum.org/images/alma.jpg',
    name: 'Luxury Suite',
    initialView: { pitch: 0, yaw: 0, hfov: hfov }
  };

  return (
    <Box sx={{ bgcolor: '#0f172a', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box sx={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <PanoramaViewer
            room={landingRoom}
            isPublic
            autoRotate={2.0}
            customHfov={hfov}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            background: 'radial-gradient(circle, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.7) 100%)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Paper
              sx={{
                p: { xs: 4, md: 8 },
                maxWidth: 800,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                mx: 2,
              }}
            >
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '4rem' } }}>
                Revolutionize Real Estate Presentations
              </Typography>
              <Typography variant="h5" sx={{ mb: 6, opacity: 0.9, fontWeight: 400 }}>
                ImmersiView 360: Interactive Virtual Tours for Modern Agents.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={scrollToComparison}
                  sx={{
                    bgcolor: '#3b82f6',
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': { bgcolor: '#2563eb' }
                  }}
                >
                  Watch Tour
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                  }}
                >
                  Property Agent Login
                </Button>
              </Stack>
            </Paper>
          </motion.div>
        </Box>
      </Box>

      {/* Comparison Section */}
      <Container ref={comparisonRef} maxWidth="lg" sx={{ py: 15 }}>
        <Typography variant="h3" textAlign="center" gutterBottom sx={{ mb: 8, fontWeight: 700 }}>
          Experience the Difference
        </Typography>
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom color="grey.400">
                Static 2D Photography
              </Typography>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
                sx={{
                  width: '100%',
                  height: 500,
                  objectFit: 'cover',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom color="secondary">
                ImmersiView 360 Interactive
              </Typography>
              <Tooltip title="Touch to Explore" followCursor arrow>
                <Box sx={{ height: 500, borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                  <PanoramaViewer
                    room={{
                      panoramaUrl: 'https://pannellum.org/images/alma.jpg',
                      name: 'Interactive View'
                    }}
                    isPublic
                    containerHeight="500px"
                  />
                </Box>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
