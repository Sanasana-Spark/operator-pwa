import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
} from "@mui/material";

const AddFuelRequest = ({ onSubmit, onCancel, open }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    console.log(imageSrc)
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(capturedImage);
  };

  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Odometer Reading</DialogTitle>
      <DialogContent>
        <Paper className={"classes.paper"}>
          <form onSubmit={handleSubmit}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
            />

            <DialogActions>
              <Button onClick={captureImage} variant="contained" color="secondary" >Capture Image</Button>
              </DialogActions>
              <DialogActions>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button variant="contained" color="primary" onClick={onCancel}>
                Cancel
              </Button>
            </DialogActions>
          </form>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default AddFuelRequest;
