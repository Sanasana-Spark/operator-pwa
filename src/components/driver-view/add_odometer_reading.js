import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    IconButton
} from '@mui/material';
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";

const AddOdometerReading = ({ openDialog, setOpenDialog, onSubmit }) => {
    const [, setFormData] = useState({});
    const[saving , setSaving] = useState(false);
    const [image, setImage] = useState(null);
    const [odometerReading, setOdometerReading] = useState('');
    const [location, setLocation] = useState(null);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraFacing, setCameraFacing] = useState("environment"); // Default to back camera


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
    console.log(image)

    const initializeMedia = async (cameraFacing) => {
        console.log(cameraFacing)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                 video: { facingMode: cameraFacing }
            });
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
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };



    useEffect(() => {
        if (openDialog) {
            initializeMedia(cameraFacing);
        } else {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
            setStream(null);
        }
    },
    // eslint-disable-next-line
     [openDialog, cameraFacing]);


    const toggleCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setStream(null);
        
        setCameraFacing((prevFacing) => (prevFacing === "user" ? "environment" : "user"));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
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
                    <Box>
                    <Button
                        variant="contained"
                        sx={{ marginTop: 2, background: 'var(--secondary-color)' }}
                        onClick={takePicture}
                    >
                        Capture Image
                    </Button>

                    <IconButton
    sx={{ marginTop: 2 }}
    onClick={toggleCamera}
    color="#01947A"
>
    <FlipCameraAndroidIcon />
</IconButton>
</Box>
                )}

                {image && (
                    <Button
                        variant="contained"
                        sx={{ marginTop: 2, background: 'var(--primary-color)' }}
                        onClick={handleRecapture}
                    >
                        Recapture Image
                    </Button>
                )}

                <TextField
                    label="Odometer Reading"
                    variant="outlined"
                    type="number"
                    fullWidth
                    sx={{ marginTop: 2 }}
                    value={odometerReading}
                    onChange={(e) => setOdometerReading(e.target.value)}
                />

           

            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setImage(null);
                    setOdometerReading(null);
                    setOpenDialog(false);
                    setSaving(false);
                } }
                sx={{ marginRight: 1, color: 'var(--primary-color)' }}
                >Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={saving}
                    sx={{ marginLeft: 1, backgroundColor: 'var(--secondary-color)', color: 'white' }}
                >
                    {saving ? 'Submitting...' : 'Submit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddOdometerReading;