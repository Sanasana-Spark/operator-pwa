import React, { useState, useEffect } from "react";
import Map from "../components/maps/singleTripMap";
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Button } from "@mui/material";
import { useAuthContext } from "../components/onboarding/authProvider";
import Asset_icon from '../assets/asset_icon.png';

const DriverHome = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_id, userId } = useAuthContext(); // Extract org_id and userId
  const [loading, setLoading] = useState(true);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [startPoint, setStartPoint] = useState({ lat: 5.66667, lng: 0.0 });
  const [endPoint, setEndPoint] = useState({ lat: 5.66667, lng: 0.0 });

  useEffect(() => {
    // Construct the API URL using org_id and userId
    const apiUrl = `${baseURL}/trips/${org_id}/${userId}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);

        const inProgressTrip = data.find((trip) => trip.t_status === "In-progress");
        if (inProgressTrip) {
          setInProgressTrip(inProgressTrip);
          setStartPoint({ lat: parseFloat(inProgressTrip.t_start_lat), lng: parseFloat(inProgressTrip.t_start_long) });
          setEndPoint({ lat: parseFloat(inProgressTrip.t_end_lat), lng: parseFloat(inProgressTrip.t_end_long) });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL, org_id, userId]); // Update dependencies to include org_id and userId

  const handleStartTrip = () => {
    // Logic to start the trip
    const startTripUrl = `${baseURL}/trips/start/${inProgressTrip.id}`; // Update with the correct URL for starting a trip
    fetch(startTripUrl, { method: "POST" }) // Assuming starting a trip requires a POST request
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to start the trip");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful trip start
        console.log("Trip started:", data);
        // Optionally, update the inProgressTrip state or redirect
      })
      .catch((error) => {
        console.error("Error starting trip:", error);
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
    <>
      {!loading && inProgressTrip && (
        <Box container alignItems="center" spacing={1}>
          <Map startPoint={startPoint} endPoint={endPoint} />
          <Card variant="elevation" sx={{ marginTop: 2, marginRight: 3, marginLeft: 3, zIndex: 1, width: "70%", boxShadow: 5 }}>
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <img src={Asset_icon} alt="Custom Icon" className="icon" />
                </Grid>
                <Grid item>
                  <Typography variant="body1">LPO: {inProgressTrip.t_type}</Typography>
                  <Typography variant="body1">Destination: {inProgressTrip.t_operator_id}</Typography>
                  <Typography variant="body2">Truck: {inProgressTrip.a_license_plate}</Typography>
                </Grid>
              </Grid>
              {/* Start Trip Button */}
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleStartTrip}>
                  Start Trip
                </Button>
              </Box>
            </CardContent>
          </Card>
          {/* You can add other functionality here if needed */}
        </Box>
      )}
    </>
  );
};

export default DriverHome;
