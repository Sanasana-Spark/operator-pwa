import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress, Card, CardContent, Grid } from "@mui/material";
import { useAuthContext } from "../components/onboarding/authProvider";
import Asset_icon from '../assets/asset_icon.png';

const TripHistory = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { userId, org_id, userEmail } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [tripList, setTripList] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const apiUrl = `${baseURL}/trips?userEmail=${userEmail}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTripList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL, userEmail]);

  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip);
  };

  const handleSubmitOdometer = async (tripId, isComplete) => {
    try {
      const response = await fetch(`${baseURL}/trips/${tripId}/odometer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, isComplete }),
      });

      if (response.ok) {
        if (isComplete) {
          setSelectedTrip({ ...selectedTrip, t_status: "Completed" });
          alert("Trip completed");
        } else {
          alert("Odometer reading submitted");
        }
      }
    } catch (error) {
      console.error('Error submitting odometer reading:', error);
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
    <Box>
      <Typography variant="h4">Trip History</Typography>
      <Grid container spacing={3}>
        {tripList.map((trip) => (
          <Grid item key={trip.id} xs={12} sm={6} md={4}>
            <Card onClick={() => handleSelectTrip(trip)}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <img src={Asset_icon} alt="Custom Icon" className="icon" />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">LPO: {trip.t_type}</Typography>
                    <Typography variant="body1">Destination: {trip.t_operator_id}</Typography>
                    <Typography variant="body2">Truck: {trip.a_license_plate}</Typography>
                    <Typography variant="body2">Status: {trip.t_status}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedTrip && selectedTrip.t_status === "In-progress" && (
        <Box mt={2}>
          <Typography variant="h6">Selected Trip: {selectedTrip.t_type}</Typography>

          {/* Odometer submission and trip completion functionality */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => console.log('Odometer image:', e.target.files[0])}
            capture="camera"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleSubmitOdometer(selectedTrip.id, false)}
          >
            Submit Odometer Reading
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmitOdometer(selectedTrip.id, true)}
          >
            Complete Trip
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TripHistory;
