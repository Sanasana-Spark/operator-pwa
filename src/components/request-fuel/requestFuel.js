import React, { useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';

const RequestFuel = ({ trip, baseURL }) => {
  const [fuelResponse, setFuelResponse] = useState(null);

  const handleRequestFuel = () => {
    const payload = {
      f_created_by: trip.userId,
      f_organization_id: trip.org_id,
      f_operator_id: trip.operator_id,
      f_asset_id: trip.asset_id,
      f_trip_id: trip.id,
      f_odometer_image: "image_data_placeholder", // Replace with actual image data
    };

    fetch(`${baseURL}/fuel/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFuelResponse(data);
        alert(`Fuel request successful! Amount credited: ${data.amount}`);
      })
      .catch((error) => {
        console.error("Error submitting fuel request:", error);
        alert("Error submitting fuel request");
      });
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleRequestFuel}
        sx={{ marginTop: 2 }}
      >
        Request Fuel
      </Button>

      {fuelResponse && (
        <Card variant="outlined" sx={{ marginTop: 2 }}>
          <CardContent>
            <Typography variant="body1">Fuel Request Response:</Typography>
            <Typography variant="body2">Amount Credited: {fuelResponse.amount}</Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RequestFuel;
