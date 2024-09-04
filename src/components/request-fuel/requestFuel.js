import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Modal } from '@mui/material';

const RequestFuel = ({ trip, baseURL, onFuelRequestComplete }) => {
  const [odometerImage, setOdometerImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsRequesting(true);

    const payload = {
      f_created_by: trip.userId,
      f_organization_id: trip.org_id,
      f_operator_id: trip.t_operator_id,
      f_asset_id: trip.t_asset_id,
      f_trip_id: trip.id,
      f_odometer_image: odometerImage,
    };

    try {
      const response = await fetch(`${baseURL}/fuel/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResponseMessage(`Fuel request successful! Amount credited: ${data.amount}`);
      onFuelRequestComplete(); // Notify parent component that fuel request is complete
    } catch (error) {
      console.error('Error submitting fuel request:', error);
      setResponseMessage('Fuel request failed. Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextField
          type="file"
          onChange={(e) => setOdometerImage(e.target.files[0])}
          required
        />
        <Button type="submit" variant="contained" disabled={isRequesting}>
          {isRequesting ? 'Requesting...' : 'Request Fuel'}
        </Button>
      </form>
      {responseMessage && (
        <Typography variant="body1" color="primary" sx={{ marginTop: 2 }}>
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
};

export default RequestFuel;
