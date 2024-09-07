import React, { useState, useEffect } from "react";
import Map from "../components/maps/singleTripMap";
import { Button, Box, Typography, Card, CardContent, Grid, CircularProgress } from "@mui/material";
import RequestFuel from "../components/request-fuel/requestFuel";
import { useAuthContext } from "../components/onboarding/authProvider";
import Asset_icon from '../assets/asset_icon.png';

const DriverHome = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { userId, org_id, userEmail } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [inProgressTripId, setInProgressTripId] = useState(null);
  const [startPoint, setStartPoint] = useState({ lat: 5.66667, lng: 0.0 });
  const [endPoint, setEndPoint] = useState({ lat: 5.66667, lng: 0.0 });
  const [fuelRequested, setFuelRequested] = useState(false);
  const [requestFuelOpen, setRequestFuelOpen] = useState(false);
  const [fuelAllocated, setFuelAllocated] = useState(null);

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

        const inProgressTrip = data.find((trip) => trip.t_status === "In-progress");
        if (inProgressTrip) {
          setInProgressTrip(inProgressTrip);
          setInProgressTripId(inProgressTrip.id);
          setStartPoint({ lat: parseFloat(inProgressTrip.t_start_lat), lng: parseFloat(inProgressTrip.t_start_long) });
          setEndPoint({ lat: parseFloat(inProgressTrip.t_end_lat), lng: parseFloat(inProgressTrip.t_end_long) });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL, userEmail]);

  const handleRequestFuel = (capturedImageFile) => {
    if (inProgressTripId) {
      const formData = new FormData();
      formData.append('f_created_by', userId);
      formData.append('f_organization_id', org_id);
      formData.append('f_operator_id', inProgressTrip.t_operator_id);
      formData.append('f_asset_id', inProgressTrip.t_asset_id);
      formData.append('f_trip_id', inProgressTripId);
      formData.append('f_odometer_image', capturedImageFile);

      return fetch(`${baseURL}/fuel/create`, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error("Backend error: " + (errorData.message || "Unknown error"));
            });
          }
          return response.json();
        })
        .then((data) => {
          setFuelAllocated(data.fuel_allocated);  // Store fuel allocated response
          return data; // Return the data to handle in the component
        })
        .catch((error) => {
          console.error("Error submitting fuel request:", error);
          throw error; // Rethrow error to be handled in component
        });
    } else {
      console.error("No in-progress trip found.");
      return Promise.reject(new Error("No in-progress trip found."));
    }
  };

  const handleOpenRequestFuel = () => setRequestFuelOpen(true);
  const handleCloseRequestFuel = () => setRequestFuelOpen(false);

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
          {!fuelRequested ? (
            <Button
              onClick={handleOpenRequestFuel}
              sx={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#01947A',
                color: 'white',
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: '#047A9A',
                },
              }}
            >
              Request Fuel
            </Button>
          ) : (
            <Button
              onClick={() => {
                // Implement start trip functionality here if needed
              }}
              sx={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#01947A',
                color: 'white',
                boxShadow: 3,
                '&:hover': {
                  backgroundColor: '#047A9A',
                },
              }}
            >
              Start Trip
            </Button>
          )}
          <RequestFuel
            open={requestFuelOpen}
            onSubmit={handleRequestFuel}
            onCancel={handleCloseRequestFuel}
            inProgressTripId={inProgressTripId}
            userId={userId}
            org_id={org_id}
            inProgressTrip={inProgressTrip}
            baseURL={baseURL}
            setFuelRequested={setFuelRequested}
            setFuelAllocated={setFuelAllocated}
            fuelAllocated={fuelAllocated}
          />
        </Box>
      )}
    </>
  );
};

export default DriverHome;
 