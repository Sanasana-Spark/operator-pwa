
// src/components/UpcomingTrips.js
import React, { useState, useEffect } from 'react';
import {  Box, Typography, Button,Card,CardContent,CircularProgress } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import RequestFuel from '../components/request-fuel/requestFuel'
const UpcomingTrips = () => {

  const baseURL = process.env.REACT_APP_BASE_URL;
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestFuel, setshowRequestFuel] = useState(false);
  const [selectedTripId, setselectedTripId] = useState(null);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [fuelRequested, setFuelRequested] = useState(false);
//   const navigate = useNavigate();

  // Fetch trips and check if there's any trip in progress
  useEffect(() => {
    const apiUrl = `${baseURL}/trips`;
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
  }, [baseURL]);

  const handleRequestFuel = (tripId) =>{
 setselectedTripId(tripId);
    setshowRequestFuel(true);
  }
  // Handle starting a trip
//   const handleStartTrip = (tripId) => {
//     if (fuelRequested) {
//       if (window.confirm("Are you sure you want to start this trip?")) {
//         fetch(`${baseURL}/trips/${tripId}/status`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ status: 'In-progress' }),
//         })
//           .then((response) => {
//             if (!response.ok) {
//               throw new Error('Failed to update trip status');
//             }
//             return response.json();
//           })
//           .then((updatedTrip) => {
//             setInProgressTrip(updatedTrip); // Set the in-progress trip to state
//             navigate('/drive'); // Navigate to /drive route
//           })
//           .catch((error) => {
//             console.error('Error updating trip status:', error);
//           });
//       }
//     } else {
//       alert("You must request fuel before starting the trip.");
//     }
//   };

  // Handle successful fuel request
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

            <RequestFuel open={showRequestFuel} trip={selectedTripId}  onFuelRequestSuccess={handleFuelRequestSuccess} />

            {/* Check if the trip is pending, and the driver has no trip in progress */}
            { inProgressTrip && (
              <>
                {/* Render the RequestFuel component with the trip and baseURL as props */}
                
                
                {/* Start Trip button - Enabled only after fuel is requested */}
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
