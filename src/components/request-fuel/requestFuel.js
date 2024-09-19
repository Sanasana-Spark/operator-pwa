/* eslint-disable no-undef */
import React, { useState, useRef } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box, CircularProgress } from '@mui/material';

const RequestFuel = ({
  open,
  onCancel,
  trip,
  userId,
  org_id,
  baseURL,
  setFuelRequested,
  setFuelAllocated,
  onCloseModal, // Handler to close the modal
}) => {
  const [capturedImage, setCapturedImage] = useState(null); // State for captured image
  const [readingNote, setReadingNote] = useState(''); // State for odometer reading note
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error messages
  const [fuelAllocated, setLocalFuelAllocated] = useState(null); // Local state for fuel allocation
  const inputRef = useRef(null); // Reference to the hidden input

  const handleImageCapture = (event) => {
    setCapturedImage(event.target.files[0]); // Store the captured image file
  };

  const handleSubmit = () => {
    if (capturedImage && readingNote) {
      setLoading(true); // Set loading state to true
      const formData = new FormData();
      formData.append('f_created_by', userId);
      formData.append('f_organization_id', org_id);
      formData.append('f_operator_id', trip.t_operator_id);
      formData.append('f_asset_id', trip.t_asset_id);
      formData.append('f_trip_id', trip.id); // Use trip ID
      formData.append('f_odometer_image', capturedImage);
      formData.append('f_reading_note', readingNote); // Add reading note

      fetch(`${baseURL}/odometer/readings`, { // Update endpoint to handle multiple readings
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || "Unknown error");
            });
          }
          return response.json();
        })
        .then((data) => {
          setLocalFuelAllocated(data.fuel_allocated); // Update local state with fuel allocated response
          setFuelRequested(true); // Mark fuel as requested
          setFuelAllocated(data.fuel_allocated); // Update parent state with allocated fuel
          setLoading(false); // Set loading state to false
          setTimeout(() => {
            onCloseModal(); // Close the modal after 3 seconds
          }, 3000);
        })
        .catch((error) => {
          setError(error.message); // Set error message
          setLoading(false); // Set loading state to false
        });
    } else {
      alert("Please capture an image of the odometer and add a reading note.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
        }
      }}
    >
      <DialogTitle>Submit Odometer Reading</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          Capture an image of the odometer and provide a note for the reading.
        </Typography>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment" // Opens the camera
          onChange={handleImageCapture}
          style={{ display: 'none' }} // Hides the input field
        />

        {/* Custom button to trigger the camera */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => inputRef.current.click()} // Opens the camera when clicked
          style={{ marginBottom: "20px", display: 'block', margin: 'auto' }}
        >
          Open Camera
        </Button>

        {/* Text area for reading note */}
        <textarea
          rows="4"
          placeholder="Add a note for this reading..."
          value={readingNote}
          onChange={(e) => setReadingNote(e.target.value)}
          style={{ width: '100%', marginBottom: '20px' }}
        />

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <CircularProgress />
            <Typography variant="h6" color="textSecondary" mt={2}>
              Processing...
            </Typography>
          </Box>
        )}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        {fuelAllocated !== null && !loading && !error && (
          <Typography variant="body1" paragraph>
            Fuel allocated: {fuelAllocated}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestFuel;
