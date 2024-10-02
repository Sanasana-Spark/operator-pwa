import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
// Import the useAuthContext hook
import { useAuthContext } from '../components/onboarding/authProvider';
import RequestFuel from '../components/request-fuel/requestFuel';

const UpcomingTrips = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  
  // Get org_id and userId from the useAuthContext
  const { org_id, userId } = useAuthContext();
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestFuel, setshowRequestFuel] = useState(false);
  const [selectedTripId, setselectedTripId] = useState(null);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [fuelRequested, setFuelRequested] = useState(false);

  useEffect(() => {
    if (org_id && userId) {
      const apiUrl = `${baseURL}/trips/${org_id}/${userId}`;  // Update URL with org_id and userId
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const inProgress = data.find(trip => trip.t_status === 'In-progress');
          setInProgressTrip(inProgress); // Set in-progress trip if it exists
          setTrips(data); // Set all trips
          setLoading(false); // Loading is complete
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    } else {
      console.error("User or Organization ID missing.");
    }
  }, [baseURL, org_id, userId]);

  const handleRequestFuel = (tripId) => {
    setselectedTripId(tripId);
    setshowRequestFuel(true);
  };

  const handleFuelRequestSuccess = () => {
    setFuelRequested(true); // Set fuel requested state to true
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
        <Card key={trip.id} variant="outlined" sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">LPO: {trip.t_type}</Typography>
            <Typography variant="body1">Start: {trip.t_origin_place_query}</Typography>
            <Typography variant="body1">Destination: {trip.t_destination_place_query}</Typography>
            <Typography variant="body2">Date: {new Date(trip.t_start_date).toLocaleDateString()}</Typography>
            <Typography variant="body2">Status: {trip.t_status}</Typography>

            <RequestFuel open={showRequestFuel} trip={selectedTripId} onFuelRequestSuccess={handleFuelRequestSuccess} />

            {/* Check if the trip is pending, and the driver has no trip in progress */}
            {inProgressTrip && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleRequestFuel(trip.id)}
                  sx={{ marginTop: 2 }}
                  disabled={!fuelRequested} // Disable Start Trip button until fuel is requested
                >
                  Request Fuel
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default UpcomingTrips;



