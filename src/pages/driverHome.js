import React, { useState, useEffect } from "react";
import Map from "../components/maps/singleTripMap";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";
import { useAuthContext } from "../components/onboarding/authProvider";
import Asset_icon from "../assets/asset_icon.png";

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

        const inProgressTrip = data.find(
          (trip) => trip.t_status === "Requested"
        );
        if (inProgressTrip) {
          setInProgressTrip(inProgressTrip);
          const startLat = parseFloat(inProgressTrip.t_start_lat);
          const startLong = parseFloat(inProgressTrip.t_start_long);
          const endLat = parseFloat(inProgressTrip.t_end_lat);
          const endLong = parseFloat(inProgressTrip.t_end_long);

          setStartPoint({ lat: startLat, lng: startLong });
          setEndPoint({ lat: endLat, lng: endLong });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL, org_id, userId]); // Update dependencies to include org_id and userId
console.log(inProgressTrip)

  const handleStartTrip = () => {
    const url = `${baseURL}/trips/${org_id}/${userId}/${inProgressTrip.id}`;
    const data = {
      id: inProgressTrip.id,
      t_status: "In-Progress",
    };
    const options = {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Specify the content type of the request body
      },
      body: JSON.stringify(data), // Convert data to JSON string for the request body
    };
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update trip");
        }
        console.log("trip updated successfully");
      })
      .catch((error) => {
        console.error("Error updating trip:", error);
      });
  };

  const handleCompleteTrip = () => {
    const startTripUrl = `${baseURL}/trips/${org_id}/${userId}/${inProgressTrip.id}`;
    const tripPayload = {
      id: inProgressTrip.id,
      t_status: "Completed",
    };

    fetch(startTripUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(tripPayload), // Convert payload object to JSON string
    })
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {!loading && inProgressTrip && (
        <Box container alignItems="center" spacing={1}>
          <Map origin={startPoint}
              destination={endPoint}
              key={inProgressTrip.id}
              center={startPoint}/>

          <Card
            variant="elevation"
            sx={{
              margin: 3,
              alignItems: "center",
              zIndex: 1,
              width: "70%",
              boxShadow: 5,
            }}
          >
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <img src={Asset_icon} alt="Custom Icon" className="icon" />
                </Grid>
                <Grid alignItems="right" >
                  <Typography variant="body2">
                    LPO: {inProgressTrip.id} {inProgressTrip.t_type}
                  </Typography>
                  <Typography variant="body2">
                    Origin: {inProgressTrip.t_origin_place_query}
                  </Typography>
                  <Typography variant="body2">
                    Destination: {inProgressTrip.t_destination_place_query}
                  </Typography>
                  <Typography variant="body2">
                    Distance: {inProgressTrip.t_distance}
                  </Typography>
                </Grid>
              </Grid>

               </CardContent>
                </Card>
              {/* Start Trip Button */}
              <Box mt={2}>
                {inProgressTrip.t_status === "Requested" ? (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#047A9A',
                      '&:hover': {
                        backgroundColor: '#035F75', // Darker shade for hover effect
                      },
                    }}
                    onClick={handleStartTrip}
                  >
                    Start Trip
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#01947A',
                      '&:hover': {
                        backgroundColor: '#035F75', // Darker shade for hover effect
                      },
                    }}
                    onClick={handleCompleteTrip}
                  >
                    Complete Trip
                  </Button>
                )}
              </Box>

           
         
          {/* You can add other functionality here if needed */}
        </Box>
      )}
    </>
  );
};

export default DriverHome;
