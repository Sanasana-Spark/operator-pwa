import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

// Fixing the paths by moving one directory up
import { useAuthContext } from "../onboarding/authProvider"; 
import Asset_icon from '../../assets/asset_icon.png'; // Adjust the path

const RequestFuel = ({
  open,
  onSubmit,
  onCancel,
  inProgressTripId,
  userId,
  org_id,
  inProgressTrip,
  baseURL,
  setFuelRequested
}) => {
  const [capturedImage, setCapturedImage] = useState(null);

  const handleImageCapture = (event) => {
    setCapturedImage(event.target.files[0]);  // Store the captured image file
  };

  const handleSubmit = () => {
    if (capturedImage) {
      onSubmit(capturedImage);  // Pass the captured image to the parent function
    } else {
      alert("Please capture an image of the odometer.");
    }
  };

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Request Fuel</DialogTitle>
      <DialogContent>
        {/* Camera input for capturing the image */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment"  // This tells the browser to open the camera
          onChange={handleImageCapture} 
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestFuel;
