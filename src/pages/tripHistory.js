/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TripHistory = () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fuelRequested, setFuelRequested] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [odometerImages, setOdometerImages] = useState([]); // State for multiple odometer images
  const navigate = useNavigate();

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
        setTrips(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL]);

  const handleStartTrip = (tripId) => {
    // Confirm the action with the user
    if (window.confirm("Are you sure you want to start this trip?")) {
      // Update the trip status to "In-progress"
      fetch(`${baseURL}/trips/${tripId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'In-progress' }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to update trip status');
          }
          return response.json();
        })
        .then((updatedTrip) => {
          // Update the local state to reflect the change
          setTrips((prevTrips) =>
            prevTrips.map((trip) => (trip.id === tripId ? updatedTrip : trip))
          );
          // Navigate to the /drive route
          navigate('/drive');
        })
        .catch((error) => {
          console.error('Error updating trip status:', error);
        });
    }
  };

  const handleOpenModal = (trip) => {
    setSelectedTrip(trip);
    setFuelRequested(true);
    setOdometerImages([]); // Reset images when opening modal
  };

  const handleCloseModal = () => {
    setFuelRequested(false);
    setSelectedTrip(null);
    setOdometerImages([]); // Clear images on close
  };

  const handleImageCapture = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file)); // Create URLs for the captured images
    setOdometerImages((prevImages) => [...prevImages, ...newImages]); // Append new images to the state
  };

  const handleSubmitOdometerReading = async (tripId) => {
    // Create a FormData object to include images in the request
    const formData = new FormData();
    formData.append('tripId', tripId);

    odometerImages.forEach((image) => {
      // Assuming image is a Blob or a File
      formData.append('odometerImages', image);
    });

    try {
      const response = await fetch(`${baseURL}/fuel/request`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Optionally update trip status if needed
        setTrips((prevTrips) =>
          prevTrips.map((trip) => (trip.id === tripId ? { ...trip, status: 'odometer submitted' } : trip))
        );
        handleCloseModal(); // Close the modal
      } else {
        console.error('Error requesting fuel:', response.statusText);
      }
    } catch (error) {
      console.error('Error requesting fuel:', error);
    }
  };

  const handleCompleteTrip = async (tripId) => {
    // Update the trip status to "Completed"
    try {
      const response = await fetch(`${baseURL}/trips/${tripId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Completed' }),
      });

      if (response.ok) {
        // Submit the odometer reading as well
        await handleSubmitOdometerReading(tripId);
      } else {
        console.error('Error completing trip:', response.statusText);
      }
    } catch (error) {
      console.error('Error completing trip:', error);
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
    <Box padding={2}>
      {trips.map((trip) => (
        <Card key={trip.id} variant="outlined" sx={{ marginBottom: 2 }} onClick={() => trip.status === 'In-progress' && handleOpenModal(trip)}>
          <CardContent>
            <Typography variant="h6">LPO: {trip.lpo}</Typography>
            <Typography variant="body1">Start: {trip.start}</Typography>
            <Typography variant="body1">Destination: {trip.destination}</Typography>
            <Typography variant="body2">Date: {new Date(trip.date).toLocaleDateString()}</Typography>
            <Typography variant="body2">Status: {trip.status}</Typography>
            {trip.status === 'Pending' && (
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => { e.stopPropagation(); handleStartTrip(trip.id); }}
                sx={{ marginTop: 2 }}
              >
                Start Trip
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Fuel Request Modal */}
      <Modal open={fuelRequested} onClose={handleCloseModal}>
        <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 3, maxWidth: 400, margin: 'auto', marginTop: '20%' }}>
          <Typography variant="h6">Request Fuel for {selectedTrip?.destination}</Typography>
          <Typography variant="body1">Trip ID: {selectedTrip?.id}</Typography>
          
          <input
            type="file"
            accept="image/*"
            capture="camera"
            onChange={handleImageCapture}
            multiple // Allow multiple image uploads
            style={{ marginTop: 2 }}
          />
          
          {odometerImages.map((img, index) => (
            <img key={index} src={img} alt={`Odometer ${index}`} style={{ width: '100%', marginTop: 2 }} />
          ))}
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmitOdometerReading(selectedTrip.id)}
            sx={{ marginTop: 2 }}
            disabled={odometerImages.length === 0} // Disable button if no images captured
          >
            Submit Odometer Reading
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleCompleteTrip(selectedTrip.id)}
            sx={{ marginTop: 2, marginLeft: 1 }}
            disabled={odometerImages.length === 0} // Disable button if no images captured
          >
            Complete Trip
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCloseModal}
            sx={{ marginTop: 2, marginLeft: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TripHistory;
