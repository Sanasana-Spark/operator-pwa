import React, { useState, useEffect, useRef } from "react";
import Map from "../components/maps/singleTripMap";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Fade,
} from "@mui/material";
import { useAuthContext } from "../components/onboarding/authProvider";
import navigation_icon from '../../src/assets/navigation_icon.png';
import AddOdReading from "../components/driver-view/add_odometer_reading";

const DriverHome = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { apiFetch } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [pendingTrips, setPendingTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCompleteTripDialog, setOpenCompleteTripDialog] = useState(false);
  const [openStartTripDialog, setOpenStartTripDialog] = useState(false);
  const [hovered,] = useState(false);

  const [, setImage] = useState(null);
  const [, setOdometerReading] = useState("");
  const [, setLocation] = useState(null);
  const [success, setSuccess] = useState(null);
  const [, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const apiUrl = `${baseURL}/trips/by_user/`;
    apiFetch(apiUrl, { method: "GET" })
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
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL, apiFetch, success]);

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
      const response = await apiFetch(`${baseURL}/trips/odometer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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
      const response = await apiFetch(`${baseURL}/trips/${selectedTrip.id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

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
      const response = await apiFetch(
        `${baseURL}/trips/${inProgressTrip.id}/`,
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
            apiFetch(`${baseURL}/trips/location_phone/${inProgressTrip.id}/`, {
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
  }, [baseURL, inProgressTrip, apiFetch]);

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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="text.secondary">
          No approved trips found. Check new trip requests.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 2 }}
    >
      {success && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "green",
            border: "1px solid var(--secondary-color)",
            zIndex: 1300, // ensures it appears above other components
            minWidth: 300,
          }}
        >
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Box>
      )}

      {inProgressTrip && (
        <Box sx={{ pb: 2 }}>
 

          <div
            className="home-card"
          >
            <div class="tr-head">
              <div class="tr-route">{inProgressTrip.t_origin_place_query} → {inProgressTrip.t_destination_place_query}</div>
            </div>


            {/* Distance */}
            <Chip
              size="small"
              label={inProgressTrip.t_distance}
              variant="outlined"
              sx={{
                ml: 1,
                fontSize: "0.75rem",
                fontWeight: 500,
                borderRadius: "8px",
              }}
            />

             {/* Sticky info box (shown only when hovering) */}
          <Fade in={hovered}>
            <Box
          sx={{
            mb: 2,
            mt: 2,
            position: "fixed",
            bottom: "40%",
            left: "25%",
            zIndex: 1300,
            backgroundColor: "white",
            border: "2px solid var(--secondary-color)",
            color: "var(--secondary-color)",
            boxShadow: 3,
            borderRadius: 2,
            px: 2,
            py: 1,
            transition: "opacity 0.3s ease",
          }}
        >
                  {inProgressTrip.stops.length > 0 && (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  ({inProgressTrip.stops.length}) Stops:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {inProgressTrip.stops.map((stop, index) => (
                    <Chip
                      key={index}
                      label={`${index + 1}. ${
                        stop.s_place_query || "Unknown Location"
                      }`}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                  ))}
                </Box>
              </Grid>
            )}

            </Box>
          </Fade>


          </div>

          <div sx={{ height: '58vh', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
            <Map
              origin={inProgressTrip.t_origin_place_query}
              destination={inProgressTrip.t_destination_place_query}
              key={inProgressTrip.id}
              center={inProgressTrip.t_origin_place_query}
              stops={inProgressTrip.stops || []}
            />
          </div>

          <div className="tr-body"  >
            <button
              className="btn-secondary"
              onClick={handleOdometerReading}
            >
              Send Reading
            </button>
            <button
              className="btn-primary"
              onClick={handleCompleteTripReading}
            >
              Complete Trip
            </button>
          </div>

        </Box>
      )}

      {pendingTrips.length > 0 && !inProgressTrip && (
        <Box>
          {pendingTrips.map((trip) => (
        <div class="trip-row" key={trip.id}>

          <div class="tr-head">
            
              <div class="tr-type">{trip.t_type}</div>
          </div>

          <div class="tr-head">
          <div class="tr-route">{trip.t_origin_place_query} → {trip.t_destination_place_query}</div>
          </div>

            <div class="tr-body">
            <div>
            <div class="tr-stat-l">
            <IconButton aria-label="location">
              <img src={navigation_icon} alt="custom icon" width={15} height="inherit" />
              </IconButton>

            </div>

            <div class="tr-stat-v">{trip.t_distance}</div>

            </div>


            <div>
              <div class="tr-stat-l"> .</div>
              <div class="tr-stat-v">

                 {/* Start Trip Button */}
                    <button
                    className="btn btn-primary"
                      onClick={() => handleStartTripReading(trip)}
                    >
                      Start Trip
                    </button>

              </div>
            </div>
         
          
          


            </div>
        
            </div>
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
