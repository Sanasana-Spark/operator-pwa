import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';

const RequestFuel = ({ trip, baseURL, onFuelRequestSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fuelDetails, setFuelDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleFuelRequest = () => {
    setLoading(true);

    // Simulate taking a picture directly (you would replace this with actual camera API logic)
    const takePicture = () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve("mock-odometer-image.jpg"), 2000); // Simulated delay
      });
    };

    takePicture().then((odometerImage) => {
      fetch(`${baseURL}/fuel/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          f_created_by: "Driver", // Replace with actual data
          f_organization_id: trip.organization_id,
          f_operator_id: trip.operator_id,
          f_asset_id: trip.asset_id,
          f_trip_id: trip.id,
          f_odometer_image: odometerImage, // This is the simulated image
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to request fuel');
          }
          return response.json();
        })
        .then((data) => {
          setFuelDetails(data);
          onFuelRequestSuccess(); // Notify parent component that fuel was successfully requested
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button variant="contained" color="secondary" onClick={handleFuelRequest}>
        Request Fuel
      </Button>
      {fuelDetails && (
        <Box mt={2}>
          <Typography variant="h6">Fuel Request Details:</Typography>
          <Typography variant="body1">Amount: {fuelDetails.amount}</Typography>
          <Typography variant="body1">Fuel Station: {fuelDetails.station}</Typography>
        </Box>
      )}
      {error && (
        <Box mt={2}>
          <Typography variant="body1" color="error">
            Error: {error}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RequestFuel;
