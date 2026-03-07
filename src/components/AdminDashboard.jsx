import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardActions, Button, Divider, Stack, IconButton } from '@mui/material';
import { api } from '../api/client';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const AdminDashboard = ({ onSelectTour }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await api.get('/tours');
      setTours(data);
    } catch (err) {
      console.error('Failed to fetch tours', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleCreateTour = async () => {
    const name = window.prompt("Enter name for the new tour:");
    if (!name || !name.trim()) return;

    try {
      await api.post('/tours', { name: name.trim() });
      fetchTours();
    } catch (err) {
      alert("Failed to create tour: " + err.message);
    }
  };

  const handleDeleteTour = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will delete all rooms within it.`)) return;

    try {
      await api.delete(`/tours/${id}`);
      fetchTours();
    } catch (err) {
      alert("Failed to delete tour: " + err.message);
    }
  };

  const handleEditTourName = async (id, currentName) => {
    const newName = window.prompt("Enter new name for the tour:", currentName);
    if (!newName || !newName.trim() || newName === currentName) return;

    try {
      await api.patch(`/tours/${id}`, { name: newName.trim() });
      fetchTours();
    } catch (err) {
      alert("Failed to update tour name: " + err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4">Admin Dashboard</Typography>
          <Typography color="text.secondary">Manage your virtual tours and system settings</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          size="large"
          onClick={handleCreateTour}
        >
          Create New Tour
        </Button>
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              All Tours ({tours.length})
            </Typography>
            <Stack spacing={2}>
              {tours.map((tour) => (
                <Card
                  key={tour._id}
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(15, 23, 42, 0.02)',
                    }
                  }}
                  onClick={() => onSelectTour(tour._id)}
                >
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '16px !important' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {tour.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created on {new Date(tour.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTourName(tour._id, tour.name);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTour(tour._id, tour.name);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
              {!loading && tours.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No tours found. Create your first tour to get started.
                </Typography>
              )}
              {loading && <Typography align="center" sx={{ py: 4 }}>Loading tours...</Typography>}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                System Overview
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Tours</Typography>
                  <Typography variant="body2" fontWeight={600}>{tours.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Active Users</Typography>
                  <Typography variant="body2" fontWeight={600}>1</Typography>
                </Box>
                <Divider />
                <Typography variant="caption" color="text.secondary">
                  Logged in as <strong>Admin</strong>
                </Typography>
              </Stack>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                User Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Control user access and permissions for your team.
              </Typography>
              <Button variant="outlined" fullWidth sx={{ py: 1.5 }}>
                Manage Users
              </Button>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
