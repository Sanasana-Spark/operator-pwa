/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RequestFuel from '../components/request-fuel/RequestFuel'; // Import the RequestFuel component

const UpcomingTrips = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null); // State for the selected trip
  const [fuelRequested, setFuelRequested] = useState({}); // Track fuel request status per trip
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

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
    setFuelRequested(fuelRequested[trip.id] || false); // Update fuel request status for selected trip
  };

  const handleStartTrip = () => {
    if (fuelRequested) {
      if (window.confirm("Are you sure you want to start this trip?")) {
        fetch(`${baseURL}/trips/${selectedTrip.id}/status`, {
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
            setSelectedTrip(updatedTrip); // Set the in-progress trip to state
            navigate('/drive'); // Navigate to /drive route
          })
          .catch((error) => {
            console.error('Error updating trip status:', error);
          });
      }
    } else {
      alert("You must request fuel before starting the trip.");
    }
  };

  const handleFuelRequestSuccess = (tripId) => {
    setFuelRequested((prev) => ({ ...prev, [tripId]: true }));
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
        <Card key={trip.id} variant="outlined" sx={{ marginBottom: 2 }} onClick={() => handleTripClick(trip)}>
          <CardContent>
            <Typography variant="h6">LPO: {trip.t_type}</Typography>
            <Typography variant="body1">Start: {trip.t_origin_place_query}</Typography>
            <Typography variant="body1">Destination: {trip.t_destination_place_query}</Typography>
            <Typography variant="body2">Date: {new Date(trip.t_start_date).toLocaleDateString()}</Typography>
            <Typography variant="body2">Status: {trip.t_status}</Typography>
            {selectedTrip && selectedTrip.id === trip.id && trip.t_status === 'In-progress' && (
              <>
                <RequestFuel
                  open={selectedTrip.id === trip.id}
                  trip={trip}
                  baseURL={baseURL}
                  onCloseModal={() => setSelectedTrip(null)} // Close modal when odometer reading is submitted
                  setFuelRequested={handleFuelRequestSuccess}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStartTrip}
                  sx={{ marginTop: 2 }}
                >
                  Start Trip
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      {selectedTrip && (
        <Box>
          <Card variant="outlined" sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">Trip Details</Typography>
              <Typography variant="body1">LPO: {selectedTrip.t_type}</Typography>
              <Typography variant="body1">Start: {selectedTrip.t_origin_place_query}</Typography>
              <Typography variant="body1">Destination: {selectedTrip.t_destination_place_query}</Typography>
              <Typography variant="body2">Date: {new Date(selectedTrip.t_start_date).toLocaleDateString()}</Typography>
              <Typography variant="body2">Status: {selectedTrip.t_status}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default UpcomingTrips;
