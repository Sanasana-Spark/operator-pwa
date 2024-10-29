import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAuthContext } from "../onboarding/authProvider";

// Your API key for Google Cloud Vision
const API_KEY = process.env.REACT_APP_GOOGLE_CLOUD_VISION_API_KEY;

const RequestFuel = ({
  open,
  onCancel,
  inProgressTripId,
  setFuelRequested,
  onCloseModal,
}) => {
  const { userId, org_id } = useAuthContext();
  const baseURL = process.env.REACT_APP_BASE_URL; // Define baseURL here
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const [odometerReading, setOdometerReading] = useState(null);

  const handleImageCapture = (event) => {
    setCapturedImage(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (capturedImage) {
      setLoading(true);
      const formData = new FormData();
      formData.append("f_created_by", userId);
      formData.append("f_organization_id", org_id);
      formData.append("f_trip_id", inProgressTripId);
      formData.append("f_odometer_image", capturedImage, "odometer.jpg");

      // Send the captured image to the Google Vision API for text detection
      detectTextFromImage(capturedImage)
        .then((reading) => {
          if (reading) {
            setOdometerReading(reading);
            // Now send the request for fuel with the odometer reading
            requestFuel(formData, reading);
          } else {
            alert("Odometer reading could not be extracted.");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error detecting text:", err);
          setLoading(false);
        });
    } else {
      alert("Please capture an image of the odometer.");
    }
  };

  const detectTextFromImage = async (imageFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1]; // Get base64 string
        const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image,
                },
                features: [
                  {
                    type: "TEXT_DETECTION",
                  },
                ],
              },
            ],
          }),
        });

        const data = await response.json();
        if (data.responses && data.responses[0].textAnnotations) {
          const odometerText = data.responses[0].textAnnotations[0].description;
          resolve(odometerText); // Return the extracted text
        } else {
          reject("No text found.");
        }
      };
    });
  };

  const requestFuel = (formData, odometerReading) => {
    // Here you would make your request to the server to submit the fuel request
    fetch(`${baseURL}/fuel/${inProgressTripId}/`, {
      method: "POST",
      body: JSON.stringify({
        f_created_by: userId,
        f_organization_id: org_id,
        f_trip_id: inProgressTripId,
        f_odometer_reading: odometerReading,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fuel request failed");
        }
        return response.json();
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
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => inputRef.current.click()}
          style={{ marginBottom: "20px" }}
        >
          Open Camera
        </Button>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RequestFuel;

