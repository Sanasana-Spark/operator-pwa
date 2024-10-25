import React, { useState, useRef } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, CircularProgress } from "@mui/material";
import { useAuthContext } from "../onboarding/authProvider";

const RequestFuel = ({
  open,
  onCancel,
  inProgressTripId,
  inProgressTrip,
  setFuelRequested,
  onCloseModal // Handler to close the modal
}) => {

  const baseURL = process.env.REACT_APP_BASE_URL;
  const {  userId,org_id } = useAuthContext();
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleImageCapture = (event) => {
    setCapturedImage(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (capturedImage) {
      setLoading(true);
      const formData = new FormData();
      const data = {
        f_created_by:userId,
        f_organization_id:org_id,
        f_trip_id:inProgressTripId,
        f_odometer_image:capturedImage
      }
      formData.append('f_created_by', userId);
      formData.append('f_organization_id', org_id);
      formData.append('f_trip_id', inProgressTripId);
      formData.append('f_odometer_image', capturedImage, 'odometer.jpg');

      // Request fuel
      fetch(`${baseURL}/fuel/${inProgressTripId}/`, {
        method: "POST",
        body: JSON.stringify(data),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fuel request failed");
        }
        return response.json();
      })
      .then(() => {
        // Update trip status to Requested
        return fetch(`${baseURL}/trips/${inProgressTripId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Requested' }),
        });
      })
      .then(() => {
        setFuelRequested(true);
        setLoading(false);
        setTimeout(() => {
          onCloseModal();
        }, 3000);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
    } else {
      alert("Please capture an image of the odometer.");
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Request Fuel</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          Capture an image of the odometer to request fuel for your trip.
        </Typography>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageCapture}
          style={{ display: 'none' }}
        />
        <Button variant="contained" color="primary" onClick={() => inputRef.current.click()} style={{ marginBottom: "20px" }}>
          Open Camera
        </Button>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
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
