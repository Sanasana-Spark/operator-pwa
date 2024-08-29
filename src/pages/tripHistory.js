/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TripHistory = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = `${baseURL}/trips`;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL]);

  const handleStartTrip = (tripId) => {
    // Confirm the action with the user
    if (window.confirm("Are you sure you want to start this trip?")) {
      // Update the trip status to "In-progress"
      fetch(`${baseURL}/trips/${tripId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'In-progress' }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to update trip status');
          }
          return response.json();
        })
        .then((updatedTrip) => {
          // Update the local state to reflect the change
          setTrips((prevTrips) =>
            prevTrips.map((trip) => (trip.id === tripId ? updatedTrip : trip))
          );
          // Navigate to the /drive route
          navigate('/drive');
        })
        .catch((error) => {
          console.error('Error updating trip status:', error);
        });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={2}>
      {trips.map((trip) => (
        <Card key={trip.id} variant="outlined" sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">LPO: {trip.lpo}</Typography>
            <Typography variant="body1">Start: {trip.start}</Typography>
            <Typography variant="body1">Destination: {trip.destination}</Typography>
            <Typography variant="body2">Date: {new Date(trip.date).toLocaleDateString()}</Typography>
            <Typography variant="body2">Status: {trip.status}</Typography>
            {trip.status === 'Pending' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStartTrip(trip.id)}
                sx={{ marginTop: 2 }}
              >
                Start Trip
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default TripHistory;
