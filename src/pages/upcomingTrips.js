import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { useAuthContext } from '../components/onboarding/authProvider';
// import RequestFuel from '../components/request-fuel/requestFuel';
import '../App.css';
import navigation_icon from '../../src/assets/navigation_icon.png';

const UpcomingTrips = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { org_id, user_id, apiFetch } = useAuthContext();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [fuelRequested, setFuelRequested] = useState(false);

  useEffect(() => {
    const apiUrl = `${baseURL}/trips/by_user/`;  // Update URL with org_id and user_id
    apiFetch(apiUrl, { method: 'GET'})
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const inProgress = data.find(trip => trip.t_status === 'In-progress');
        setInProgressTrip(inProgress); // Set in-progress trip if it exists
        setTrips(data.filter((trip) => ["Requested", "Pending"].includes(trip.t_status)));

        setLoading(false); // Loading is complete
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL,fuelRequested, apiFetch]);

  const handleRequestFuel = (tripId) => {
    const url = `${baseURL}/fuel/${tripId}/`;
    const data = {
      f_created_by:user_id,
      f_organization_id:org_id,
      f_request_type:"Original"
    };
    const Options = { 
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    };
    apiFetch(url, Options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fuel request failed");
        }
        setFuelRequested(true);
        console.log("fuel requested successfully");
      });
    };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }
  if (trips.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="text.secondary">
          No assigned trips found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 2, mt: 1.5, mb: 0.5 }}>
      {trips.map((trip) => (
        
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

               

           <button
                    className={`btn ${trip.t_status !== 'Pending' ? 'btn-secondary-disabled' :'btn-primary' }`}
                    onClick={() => handleRequestFuel(trip.id)}
                    disabled={trip.t_status !== 'Pending'}
                    >
                    {trip.t_status !== 'Pending' ? 'Requested' : 'Request Fuel'}
            </button>
       
              {inProgressTrip && (
              <button
                className="btn btn-secondary"
                onClick={() => handleRequestFuel(trip.id)}
                disabled={!fuelRequested} // Disable Start Trip button until fuel is requested
              >
                Request Fuel
              </button>
            )}
             </div>

            </div>
           

       </div>
            


   
        </div>
      ))}
    </Box>
  );
};

export default UpcomingTrips;



