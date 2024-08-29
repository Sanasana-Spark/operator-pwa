import React, { useState, useEffect } from "react";
import Map from "../components/maps/singleTripMap";
import { Button, Box, Typography, Card, CardContent, Grid } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import AddFuelRequest from "../components/driver-view/addFuelRequest";
import Loader from "../components/loader";
import { useAuthContext } from "../components/onboarding/authProvider";
import Asset_icon from '../assets/asset_icon.png'

const DriverHome = () => {
  // const center = { lat: 5.66667, lng: 0.0 };
  const baseURL = process.env.REACT_APP_BASE_URL;

  const { userId, org_id } = useAuthContext();
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // const [trips, setTrips] = useState([]);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [inProgressTripId, setInProgressTripId] = useState(null);
  const [startPoint, setStartPoint] = useState({ lat: 5.66667, lng: 0.0 });
  const [endPoint, setEndPoint] = useState({ lat: 5.66667, lng: 0.0 });

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
        setLoading(false);

        // Find the first trip with status "In-progress"
        const inProgressTrip = data.find(
          (trip) => trip.t_status === "In-progress"
        );
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
  }, [baseURL]);

  console.log(startPoint, endPoint)
  

  const handleSubmit = (capturedImage) => {
    capturedImage.preventDefault();

    if (inProgressTripId) {
      const payload = {
        // Your payload data
        f_created_by: userId,
        f_organization_id: org_id,
        f_operator_id: inProgressTrip.t_operator_id,
        f_asset_id: inProgressTrip.t_asset_id,
        f_trip_id: inProgressTripId,
        f_odometer_image: capturedImage,
      };

      fetch(`${baseURL}/fuel/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
        });
    } else {
      console.error("No in-progress trip found.");
    }
  };
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // const handleStartTrip = () => {
  //   navigate("/newtrips");
  // };

  if (loading) return <div>Loading...</div>;

  return (
    <>
    {!loading && inProgressTrip && (
<Box container alignItems="center" spacing={1}>
<Map startpoint={startPoint} endpoint={endPoint} key={1} />



<Card variant="elevation" 
sx={{ marginTop: 2,marginRight: 3,marginLeft:3, zIndex:1 , width:"70%", boxShadow: 5, }}>
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
          <img src={Asset_icon} alt="Custom Icon" className="icon"/>
          </Grid>
          <Grid item>
            <Typography variant="body1">LPO: {inProgressTrip.t_type}</Typography>
            <Typography variant="body1">Destination: {inProgressTrip.t_operator_id}</Typography>
            <Typography variant="body2">Truck: {inProgressTrip.a_license_plate}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

    <AddFuelRequest
      open={open}
      onSubmit={handleSubmit}
      onCancel={handleClose}
    />

    <Button onClick={handleOpen}
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
    >Request Fuel</Button>
  </Box>


    ) }


{ loading && ( <div className="loader-container">
        <Loader />
      </div> )}




    </>
  );
};

export default DriverHome;
