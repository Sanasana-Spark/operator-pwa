import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box, CircularProgress } from "@mui/material";

const RequestFuel = ({
  open,
  onCancel,
  inProgressTripId,
  userId,
  org_id,
  inProgressTrip,
  baseURL,
  setFuelRequested,
  setFuelAllocated,
  onCloseModal // Handler to close the modal
}) => {
  const [capturedImage, setCapturedImage] = useState(null); // State for captured image
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error messages
  const [fuelAllocated, setLocalFuelAllocated] = useState(null); // Local state for fuel allocation

  const handleImageCapture = (event) => {
    setCapturedImage(event.target.files[0]); // Store the captured image file
  };

  const handleSubmit = () => {
    if (capturedImage) {
      setLoading(true); // Set loading state to true
      const formData = new FormData();
      formData.append('f_created_by', userId);
      formData.append('f_organization_id', org_id);
      formData.append('f_operator_id', inProgressTrip.t_operator_id);
      formData.append('f_asset_id', inProgressTrip.t_asset_id);
      formData.append('f_trip_id', inProgressTripId);
      formData.append('f_odometer_image', capturedImage);

      fetch(`${baseURL}/fuel/create`, {
        method: "POST",
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
          setLoading(false); // Set loading state to false
          setFuelAllocated(data.fuel_allocated); // Update parent state with allocated fuel
          onCloseModal(); // Close the modal after submission
        })
        .catch((error) => {
          setError(error.message); // Set error message
          setLoading(false); // Set loading state to false
        });
    } else {
      alert("Please capture an image of the odometer.");
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
      <DialogTitle>Request Fuel</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          Capture an image of the odometer to request fuel for your trip.
        </Typography>
        <input
          type="file"
          accept="image/*"
          capture="environment" // Opens the camera
          onChange={handleImageCapture}
          style={{ marginBottom: "20px", width: "100%" }}
        />
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
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
