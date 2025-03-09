/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, IconButton, Button, CardMedia } from '@mui/material';
import { useAuthContext } from '../components/onboarding/authProvider';
import pin_location from '../../src/assets/pin_location.png';
import navigation_icon from '../../src/assets/navigation_icon.png';
import clock_icon from '../../src/assets/clock_icon.png';
import truck_image from '../../src/assets/truck.png';

const TripHistory = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_id, userId } = useAuthContext();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const apiUrl = `${baseURL}/trips/${org_id}/${userId}/`;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTrips(data.filter((trip) => trip.t_status === "Completed"));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL, org_id, userId]);


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
        <Card key={trip.id} sx={{ display: 'flex', marginBottom: 3, borderRadius: 5, alignItems: 'flex-start', justifyContent: 'space-between' }}>
           
<Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 5, marginLeft:2 }}>
            <CardMedia
              component="img"
              sx={{ width: 130, marginTop: 2,}}
              image={truck_image}
              alt="Live from space album cover"
            />
          </Box>

 <Box sx={{ display: 'flex', flexDirection: 'column',borderRadius: 5, alignItems: 'flex-start' }}>
            <CardContent
              sx={{
                flex: '1 0 auto',
                alignContent: 'left',
                justifyContent: 'left',
                color: 'var(--main-text-color)',
                textAlign: 'left'
              }}
            >
 <Typography component="h4" variant="h4 " sx={{ color: 'var(--main-text-color)', fontSize: 'large' }}>
                {trip.t_type}
              </Typography>

              <Typography variant="h6" component="h6" sx={{ color:'var(--gray-color)', fontSize: 'medium'}}>
                <IconButton aria-label="location">
                  <img src={pin_location} alt="custom icon" width={20} height={25} />
                </IconButton>
                {trip.t_destination_place_query}
              </Typography>

              <Typography variant="h6" component="h6" sx={{ color: 'var(--gray-color)',fontSize:'small' }}>
                <IconButton aria-label="location">
                  <img src={clock_icon} alt="custom icon" width={20} height={20} />
                </IconButton>
                {trip.t_duration}
              </Typography>


              <Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 'small' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      padding: 0,
                      paddingRight: '5px',
                      backgroundColor: 'var(--secondary-color)',
                      width: 'fit-content',
                      height: 30,
                      fontSize: '0.55rem', // Adjust font size to fit the button size
                    }}
                  >
                    <IconButton aria-label="location">
                      <img src={navigation_icon} alt="custom icon" width={15} height="inherit" />
                    </IconButton>
                    {trip.t_distance}
                  </Button>

               
                  </Box>
                  </Typography>

                  <Typography sx={{ color: 'var(--main-text-color)', fontSize: 'medium' }}>
                    Status :{trip.t_status}
                  </Typography>
                </CardContent>
                </Box>
        </Card>
      ))}

    </Box>
  );
};

export default TripHistory;
