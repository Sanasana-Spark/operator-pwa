import React, { useState, useEffect } from "react";
import Map from "../components/maps/singleTripMap";
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Button } from "@mui/material";
import { useAuthContext } from "../components/onboarding/authProvider";
import Asset_icon from '../assets/asset_icon.png';

const DriverHome = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { userId, org_id, userEmail } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [trips, setTrips] = useState([]);
  const [startPoint, setStartPoint] = useState({ lat: 5.66667, lng: 0.0 });
  const [endPoint, setEndPoint] = useState({ lat: 5.66667, lng: 0.0 });

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
        setLoading(false);
        setTrips(data);
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
  }, [baseURL, userEmail]);

  const handleStartTrip = async (tripId) => {
    try {
      const response = await fetch(`${baseURL}/trips/${tripId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId }),
      });

      if (response.ok) {
        const updatedTrip = trips.find(trip => trip.id === tripId);
        setInProgressTrip({ ...updatedTrip, t_status: 'In-progress' });
      }
    } catch (error) {
      console.error('Error starting trip:', error);
    }
  };

  const handleSubmitOdometer = async (tripId, isComplete) => {
    // Here is where you would handle uploading the odometer image to your backend
    try {
      const response = await fetch(`${baseURL}/trips/${tripId}/odometer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, isComplete }),
      });

      if (response.ok) {
        if (isComplete) {
          setInProgressTrip(null); // The trip is now complete
        } else {
          alert('Odometer reading submitted');
        }
      }
    } catch (error) {
      console.error('Error submitting odometer reading:', error);
    }
  };

  const handleOdometerCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      // This is where you handle the odometer image submission (can be uploaded to backend)
      console.log('Odometer image captured:', file);
    }
  };

  const canStartTrip = trips.some(trip => trip.t_status === 'Fuel Requested' && !inProgressTrip);

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
            </CardContent>
          </Card>
          
          {/* Odometer submission and trip completion functionality */}
          <input
            type="file"
            accept="image/*"
            onChange={handleOdometerCapture}
            capture="camera"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleSubmitOdometer(inProgressTrip.id, false)}
          >
            Submit Odometer Reading
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmitOdometer(inProgressTrip.id, true)}
          >
            Complete Trip
          </Button>
        </Box>
      )}

      {/* Start trip button */}
      {!inProgressTrip && canStartTrip && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleStartTrip(trips.find(trip => trip.t_status === 'Fuel Requested').id)}
        >
          Start Trip
        </Button>
      )}
    </>
  );
};

export default DriverHome;
