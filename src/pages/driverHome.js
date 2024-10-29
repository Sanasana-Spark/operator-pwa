import React, { useState, useEffect } from "react";
import RequestFuel from "../components/request-fuel/requestFuel";
import { Box, Typography, Card, CardContent, Button, CircularProgress } from "@mui/material";
import { useAuthContext } from "../components/onboarding/authProvider";

const DriverHome = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_id, userId } = useAuthContext();
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [showRequestFuel, setShowRequestFuel] = useState(false);
  const [fuelRequested, setFuelRequested] = useState(false);

  useEffect(() => {
    fetch(`${baseURL}/trips/${org_id}/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const activeTrip = data.find((trip) => trip.t_status === "Requested");
        if (activeTrip) setInProgressTrip(activeTrip);
      });
  }, [baseURL, org_id, userId]);

  const handleStartTrip = async () => {
    if (fuelRequested) {
      fetch(`${baseURL}/trips/${org_id}/${userId}/${inProgressTrip.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t_status: "In-Progress" }),
      })
      .then((response) => response.json())
      .then((data) => console.log("Trip started:", data));
    } else {
      alert("Please request fuel and take an odometer reading first.");
      setShowRequestFuel(true);
    }
  };

  const handleCompleteTrip = () => {
    if (fuelRequested) {
      fetch(`${baseURL}/trips/${org_id}/${userId}/${inProgressTrip.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t_status: "Completed" }),
      })
      .then((response) => response.json())
      .then((data) => console.log("Trip completed:", data));
    } else {
      alert("Please take an odometer reading first.");
      setShowRequestFuel(true);
    }
  };

  return (
    <Box padding={2}>
      {inProgressTrip && (
        <Card>
          <CardContent>
            <Typography variant="h6">Trip ID: {inProgressTrip.id}</Typography>
            <Button variant="contained" onClick={handleStartTrip}>
              Start Trip
            </Button>
            <Button variant="contained" onClick={handleCompleteTrip}>
              Complete Trip
            </Button>
          </CardContent>
        </Card>
      )}
      <RequestFuel open={showRequestFuel} onCancel={() => setShowRequestFuel(false)} inProgressTripId={inProgressTrip?.id} setFuelRequested={setFuelRequested} onCloseModal={() => setShowRequestFuel(false)} />
    </Box>
  );
};

export default DriverHome;
