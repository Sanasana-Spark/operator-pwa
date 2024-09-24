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
  const [odometerImage, setOdometerImage] = useState(null); // For storing captured image

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

  const handleCaptureImage = (e) => {
    const file = e.target.files[0];
    setOdometerImage(file); // Store the captured image file
    console.log("Captured image:", file);
  };

  const handleSubmitOdometer = async (tripId, isComplete) => {
    if (!odometerImage) {
      alert("Please capture the odometer image before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("odometerImage", odometerImage);
      formData.append("tripId", tripId);
      formData.append("isComplete", isComplete);

      const response = await fetch(`${baseURL}/trips/${tripId}/odometer`, {
        method: 'POST',
        body: formData, // Send image as part of form data
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

          {/* Camera capture input for capturing odometer image */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCaptureImage}
          />

          {/* Submit Odometer and Complete Trip buttons */}
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
