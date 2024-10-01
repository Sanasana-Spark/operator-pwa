
// src/components/UpcomingTrips.js
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const UpcomingTrips = () => {
    const [trips, setTrips] = useState([]);
    const [fuelRequested, setFuelRequested] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [odometerImage, setOdometerImage] = useState(null);
    const baseURL = process.env.REACT_APP_BASE_URL;


    // Fetch upcoming trips
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await fetch(`${baseURL}/trips/upcoming`);
                const data = await response.json();
                setTrips(data);
            } catch (error) {
                console.error('Error fetching trips:', error);
            }
        };
        fetchTrips();
    }, [baseURL]);

    const handleStartTrip = async (tripId) => {
        try {
            const response = await fetch(`${baseURL}/trips/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tripId }),
            });

            if (response.ok) {
                setTrips((prevTrips) =>
                    prevTrips.map((trip) =>
                        trip.id === tripId ? { ...trip, status: 'in_progress' } : trip
                    )
                );
            } else {
                console.error('Error starting trip:', response.statusText);
            }
        } catch (error) {
            console.error('Error starting trip:', error);
        }
    };

    const handleCompleteTrip = async (tripId) => {
        try {
            const response = await fetch(`${baseURL}/trips/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tripId }),
            });

            if (response.ok) {
                setTrips((prevTrips) =>
                    prevTrips.map((trip) =>
                        trip.id === tripId ? { ...trip, status: 'completed' } : trip
                    )
                );
            } else {
                console.error('Error completing trip:', response.statusText);
            }
        } catch (error) {
            console.error('Error completing trip:', error);
        }
    };

    const handleRequestFuel = async (tripId) => {
        if (!odometerImage) {
            alert('Please capture the odometer image before requesting fuel.');
            return;
        }

        const formData = new FormData();
        formData.append('tripId', tripId);
        formData.append('odometerImage', odometerImage);

        try {
            const response = await fetch(`${baseURL}/fuel/request`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setTrips((prevTrips) =>
                    prevTrips.map((trip) =>
                        trip.id === tripId ? { ...trip, fuelRequested: true } : trip
                    )
                );
                setFuelRequested(false);
                setSelectedTrip(null);
                setOdometerImage(null);
            } else {
                console.error('Error requesting fuel:', response.statusText);
            }
        } catch (error) {
            console.error('Error requesting fuel:', error);
        }
    };

    const handleOpenModal = (trip) => {
        setSelectedTrip(trip);
        setFuelRequested(true);
        setOdometerImage(null);
    };

    const handleCloseModal = () => {
        setFuelRequested(false);
        setSelectedTrip(null);
        setOdometerImage(null);
    };

    const handleCaptureImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            setOdometerImage(file);
        }
    };

    const handleSubmitOdometerReading = async (tripId) => {
        if (!odometerImage) {
            alert('Please capture the odometer image before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('tripId', tripId);
        formData.append('odometerImage', odometerImage);

        try {
            const response = await fetch(`${baseURL}/odometer/submit`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setTrips((prevTrips) =>
                    prevTrips.map((trip) =>
                        trip.id === tripId ? { ...trip, lastOdometerReading: odometerImage } : trip
                    )
                );
                setOdometerImage(null);
            } else {
                console.error('Error submitting odometer reading:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting odometer reading:', error);
        }
    };

    return (
        <>
            <h1>Upcoming Trips</h1>
            <ul>
                {trips.map((trip) => (
                    <li key={trip.id}>
                        <div>
                            <p>Destination: {trip.destination}</p>
                            <p>Status: {trip.status}</p>
                            {trip.status === 'pending' && (
                                <Button variant="contained" onClick={() => handleStartTrip(trip.id)}>Start Trip</Button>
                            )}
                            {trip.status === 'in_progress' && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCaptureImage}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={() => handleSubmitOdometerReading(trip.id)}
                                        disabled={!odometerImage}
                                    >
                                        Submit Odometer Reading
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleCompleteTrip(trip.id)}
                                    >
                                        Complete Trip
                                    </Button>
                                </>
                            )}
                            {trip.fuelRequested === false && trip.status !== 'in_progress' && (
                                <Button
                                    variant="outlined"
                                    onClick={() => handleOpenModal(trip)}
                                >
                                    Request Fuel
                                </Button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {/* Fuel Request Modal */}
            {selectedTrip && fuelRequested && (
                <Modal open={fuelRequested} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            padding: 2,
                            backgroundColor: 'white',
                            borderRadius: 2,
                            boxShadow: 3,
                            maxWidth: 400,
                            margin: 'auto',
                            marginTop: '20%',
                        }}
                    >
                        <Typography variant="h6">Request Fuel for {selectedTrip.destination}</Typography>
                        <Typography variant="body1">Trip ID: {selectedTrip.id}</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCaptureImage}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleRequestFuel(selectedTrip.id)}
                            sx={{ marginTop: 2 }}
                        >
                            Confirm Request
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
            )}
        </>
    );
};

export default UpcomingTrips;
