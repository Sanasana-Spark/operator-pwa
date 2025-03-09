import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';

const AddOdometerReading = ({ openDialog, setOpenDialog, onSubmit }) => {
    const [, setFormData] = useState({});
    const [image, setImage] = useState(null);
    const [odometerReading, setOdometerReading] = useState('');
    const [location, setLocation] = useState(null);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const takePicture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageUrl = canvas.toDataURL("image/png");
        setImage(imageUrl);

        if (video.srcObject) {
            video.srcObject.getTracks().forEach((track) => track.stop());
        }
        setStream(null);
    };

    const initializeMedia = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(stream);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        }

        // Get geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    };

    useEffect(() => {
        if (openDialog) {
            initializeMedia();
        } else {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            setStream(null);
        }
    },
    // eslint-disable-next-line
     [openDialog]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newFormData = {
            image: image,
            odometerReading: odometerReading,
            latitude: location ? location.latitude : null,
            longitude: location ? location.longitude : null
        };

        setFormData(newFormData);
        onSubmit(newFormData);

        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setStream(null);
    };

    const handleRecapture = () => {
        setImage(null);
        initializeMedia();
    };

    return (
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            fullWidth
        >
            <DialogTitle>Capture Odometer Reading</DialogTitle>
            <DialogContent>
                <video
                    ref={videoRef}
                    style={{ width: "100%", display: image ? "none" : "block" }}
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />

                {image && (
                    <img
                        src={image}
                        alt="Odometer"
                        style={{ width: "100%", marginTop: "10px" }}
                    />
                )}

                {!image && (
                    <Button
                        variant="contained"
                        sx={{ marginTop: 2 }}
                        onClick={takePicture}
                    >
                        Capture Image
                    </Button>
                )}

                {image && (
                    <Button
                        variant="contained"
                        sx={{ marginTop: 2 }}
                        onClick={handleRecapture}
                    >
                        Recapture Image
                    </Button>
                )}

                <TextField
                    label="Odometer Reading"
                    variant="outlined"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    value={odometerReading}
                    onChange={(e) => setOdometerReading(e.target.value)}
                />

                {/* {location && (
                    <Box sx={{ marginTop: 2 }}>
                        <p>Latitude: {location.latitude}</p>
                        <p>Longitude: {location.longitude}</p>
                    </Box>
                )} */}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddOdometerReading;