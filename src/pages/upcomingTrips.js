import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RequestFuel from '../components/request-fuel/requestFuel';

const UpcomingTrips = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [fuelRequested, setFuelRequested] = useState(false);
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
    if (window.confirm("Are you sure you want to start this trip?")) {
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
          setInProgressTrip(updatedTrip);
        })
        .catch((error) => {
          console.error('Error updating trip status:', error);
        });
    }
  };

  const handleFuelRequestComplete = () => {
    setFuelRequested(true);
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
      {!inProgressTrip && trips.map((trip) => (
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

      {inProgressTrip && !fuelRequested && (
        <RequestFuel trip={inProgressTrip} baseURL={baseURL} onFuelRequestComplete={handleFuelRequestComplete} />
      )}

      {inProgressTrip && fuelRequested && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/drive')}
          sx={{ marginTop: 2 }}
        >
          Start Trip
        </Button>
      )}
    </Box>
  );
};

export default UpcomingTrips;
