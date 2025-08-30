import React, { useState, useEffect, useRef } from "react";
import Map from "../components/maps/singleTripMap";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { useAuthContext } from "../components/onboarding/authProvider";
import truck_image from "../../src/assets/truck.png";
import pin_location from "../../src/assets/pin_location.png";
import clock_icon from "../../src/assets/clock_icon.png";
import AddOdReading from "../components/driver-view/add_odometer_reading";

const DriverHome = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_id, userId } = useAuthContext(); // Extract org_id and userId
  const [loading, setLoading] = useState(true);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [pendingTrips, setPendingTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCompleteTripDialog, setOpenCompleteTripDialog] = useState(false);
  const [openStartTripDialog, setOpenStartTripDialog] = useState(false);

  const [, setImage] = useState(null);
  const [, setOdometerReading] = useState("");
  const [, setLocation] = useState(null);
  const [success, setSuccess] = useState(null);
  const [, setError] = useState(null);
   const intervalRef = useRef(null);

  useEffect(() => {
    // Construct the API URL using org_id and userId
    const apiUrl = `${baseURL}/trips/by_user/${org_id}/${userId}/`;
    console.log(apiUrl);

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
          (trip) => trip.t_status === "In-Progress"
        );
        setInProgressTrip(inProgressTrip);

        setPendingTrips(data.filter((trip) => trip.t_status === "Requested"));
        // console.log("Pending Trips:", pendingTrips);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL, org_id, userId, success]); // Update dependencies to include org_id and userId

  const handleStartTripReading = async (trip) => {
    setOpenStartTripDialog(true);
    setSelectedTrip(trip);
  };
  const handleOdometerReading = async () => {
    setOpenDialog(true); // Open dialog for capturing image and entering details
  };
  const handleCompleteTripReading = async () => {
    setOpenCompleteTripDialog(true);
  };
  const cancelDialog = async () => {
    setOpenDialog(false);
    setOpenStartTripDialog(false);
    setOpenCompleteTripDialog(false);
  };

  const handleSubmit = async (formData) => {
    setError(null);
    setSuccess(null);

    const payload = {
      or_trip_id: inProgressTrip.id,
      or_asset_id: inProgressTrip.t_asset_id,
      or_operator_id: inProgressTrip.t_operator_id,
      or_image: formData.image,
      or_by_drivers: formData.odometerReading,
      or_reading: null,
      or_latitude: formData.latitude,
      or_longitude: formData.longitude,
      or_description: "continous",
    };

    try {
      const response = await fetch(
        `${baseURL}/trips/odometer/${org_id}/${userId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit odometer reading");
      }

      setSuccess("Odometer reading submitted successfully!");
      setOpenDialog(false);
      setOdometerReading(null);
      setImage(null);
      setLocation(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async (formData) => {
    setError(null);
    setSuccess(null);
    const payload = {
      id: selectedTrip.id,
      t_status: "In-Progress",
      or_description: "start_trip",
      or_trip_id: selectedTrip.id,
      or_asset_id: selectedTrip.t_asset_id,
      or_operator_id: selectedTrip.t_operator_id,
      or_image: formData.image,
      or_by_drivers: formData.odometerReading,
      or_reading: null,
      or_latitude: formData.latitude,
      or_longitude: formData.longitude,
    };
    try {
      const response = await fetch(
        `${baseURL}/trips/${org_id}/${userId}/${selectedTrip.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed start trip");
      }

      setSuccess("Trip started successfully!");
      setOpenStartTripDialog(false);
      setOdometerReading(null);
      setImage(null);
      setLocation(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTrip = async (formData) => {
    setError(null);
    setSuccess(null);
    const payload = {
      id: inProgressTrip.id,
      t_status: "Completed",
      or_description: "complete_trip",
      or_trip_id: inProgressTrip.id,
      or_asset_id: inProgressTrip.t_asset_id,
      or_operator_id: inProgressTrip.t_operator_id,
      or_image: formData.image,
      or_by_drivers: formData.odometerReading,
      or_reading: null,
      or_latitude: formData.latitude,
      or_longitude: formData.longitude,
    };
    try {
      const response = await fetch(
        `${baseURL}/trips/${org_id}/${userId}/${inProgressTrip.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete trip");
      }

      setSuccess("trip completed successfully!");
      setOpenCompleteTripDialog(false);

      setOdometerReading(null);
      setImage(null);
      setLocation(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inProgressTrip && "geolocation" in navigator) {
      const getLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = {
              or_trip_id: inProgressTrip.id,
              or_asset_id: inProgressTrip.t_asset_id,
              or_operator_id: inProgressTrip.t_operator_id,
              or_latitude: pos.coords.latitude,
              or_longitude: pos.coords.longitude,
              or_description: "continous",

            };

            // Send to backend
            fetch(`${baseURL}/trips/location_phone/${org_id}/${userId}/${inProgressTrip.id}/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(coords),
            }).catch(console.error);
          },
          (err) => setError(err.message),
          { enableHighAccuracy: true }
        );
      };

      // Run immediately and then every 10 mins
      getLocation();
      intervalRef.current = setInterval(getLocation, 600000);

      // Cleanup when trip ends or component unmounts
      return () => clearInterval(intervalRef.current);
    } else {
      // If trip stops, clear any running interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [baseURL, inProgressTrip, org_id, userId]);

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
  if (pendingTrips.length === 0 && !inProgressTrip) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="text.secondary">
          No approved trips found. Check new trip requests.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 1, paddingTop:0, height:"80vh" ,maxHeight: "80vh", overflowY: "scroll" }}>
      {success && (
        <Box sx={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'green',
    border: '1px solid var(--secondary-color)',
    zIndex: 1300, // ensures it appears above other components
    minWidth: 300,
  }}>
          <Alert severity='success' onClose={() => setSuccess(null)} >{success}</Alert>
        </Box>
      )}
      {inProgressTrip && (
        <Box>
          

          <Map
            origin={inProgressTrip.t_origin_place_query}
            destination={inProgressTrip.t_destination_place_query}
            key={inProgressTrip.id}
            center={inProgressTrip.t_origin_place_query}
          />

          <Box sx={{ display: "grid", alignItems: "center", marginBottom: 2 }}>
          <Typography variant="body1" gutterBottom>
           ( {inProgressTrip.t_distance} ) From {inProgressTrip.t_origin_place_query}
          </Typography>
          <Typography variant="body1" gutterBottom>
            To {inProgressTrip.t_destination_place_query}
          </Typography>
          </Box>

<Box>
  <Button variant="contained" onClick={handleOdometerReading}
  sx={{ marginRight: 2,
    backgroundColor: "var(--primary-color)",
    "&:hover": {
      backgroundColor: "var(--primary-hover-color)",
    },
    borderRadius: 10,
  }}
  >
     Send Reading
  </Button>
  <Button variant="contained" onClick={handleCompleteTripReading}
   sx={{
                  backgroundColor: "var(--secondary-color)",
                  "&:hover": {
                    backgroundColor: "var(--secondary-hover-color)",
                  },
                  borderRadius: 10,
                }}
                >
    Complete Trip
  </Button>
   </Box>

          </Box>
      )}

{pendingTrips.length > 0 &&  !inProgressTrip && (
        <Box >
          
            {pendingTrips.map((trip) => (
                <Card
                  key={trip.id}
                  sx={{
                    display: "flex",
                    marginBottom: 3,
                    borderRadius: 5,
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 5,
                      marginLeft: 2,
                    }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 130, marginTop: 2 }}
                      image={truck_image}
                      alt="Live from space album cover"
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 5,
                      alignItems: "flex-start",
                    }} >
                    <CardContent
                      sx={{
                        flex: "1 0 auto",
                        alignContent: "left",
                        justifyContent: "left",
                        color: "var(--main-text-color)",
                        textAlign: "left",
                      }}
                    >
                      <Typography
                        component="h4"
                        variant="h4 "
                        sx={{
                          color: "var(--main-text-color)",
                          fontSize: "large",
                        }}
                      >
                        {trip.t_type}
                      </Typography>

                      <Typography
                        variant="h6"
                        component="h6"
                        sx={{ color: "var(--gray-color)", fontSize: "medium" }}
                      >
                        <IconButton aria-label="location">
                          <img
                            src={pin_location}
                            alt="custom icon"
                            width={20}
                            height={25}
                          />
                        </IconButton>
                        {trip.t_destination_place_query}
                      </Typography>

                      <Typography
                        variant="h6"
                        component="h6"
                        sx={{ color: "var(--gray-color)", fontSize: "small" }}
                      >
                        <IconButton aria-label="navigation">
                          <img
                            src={clock_icon}
                            alt="custom icon"
                            width={20}
                            height={20}
                          />
                        </IconButton>
                        {trip.t_distance}
                      </Typography>

                      <Typography>
                        {/* Start Trip Button */}
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#047A9A",
                            "&:hover": {
                              backgroundColor: "#035F75",
                            },
                          }}
                          onClick={() => handleStartTripReading(trip)}
                        >
                          Start Trip
                        </Button>
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              ))}

           </Box>
      )}



       <AddOdReading
                    openDialog={openDialog}
                    setOpenDialog={cancelDialog}
                    onSubmit={handleSubmit}
                    
                    />

                      <AddOdReading
                                  openDialog={openCompleteTripDialog}
                                  setOpenDialog={cancelDialog}
                                  onSubmit={handleCompleteTrip}
                                  
                                  />

                                     {/* Odometer Dialog */}
                                        <AddOdReading
                                                openDialog={openStartTripDialog}
                                                setOpenDialog={cancelDialog}
                                                onSubmit={handleStartTrip}
                                                
                                                />
    </Box>
  );
};

export default DriverHome;
