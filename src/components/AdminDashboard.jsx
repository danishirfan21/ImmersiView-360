import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardActions, Button, Divider } from '@mui/material';
import { api } from '../api/client';

const AdminDashboard = ({ onEditTour }) => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await api.get('/tours');
        setTours(data);
      } catch (err) {
        console.error('Failed to fetch tours', err);
      }
    };
    fetchTours();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Admin Dashboard
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              All Tours
            </Typography>
            <Grid container spacing={2}>
              {tours.map((tour) => (
                <Grid item xs={12} key={tour._id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {tour.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created: {new Date(tour.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => onEditTour(tour._id)}>Edit</Button>
                      <Button size="small" color="error">Delete</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Currently logged in as Admin.
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} fullWidth>
              Manage Users
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
