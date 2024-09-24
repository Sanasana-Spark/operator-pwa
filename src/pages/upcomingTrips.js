// import React, { useState, useEffect } from 'react';

// const UpcomingTrips = () => {
//     const [trips, setTrips] = useState([]);
//     const [fuelRequested, setFuelRequested] = useState(false);
//     const [selectedTrip, setSelectedTrip] = useState(null);
//     const baseURL = 'https://your-api-url.com'; // Replace with your actual base URL

//     // Fetch upcoming trips
//     useEffect(() => {
//         const fetchTrips = async () => {
//             try {
//                 const response = await fetch(`${baseURL}/trips/upcoming`);
//                 const data = await response.json();
//                 setTrips(data);
//             } catch (error) {
//                 console.error('Error fetching trips:', error);
//             }
//         };
//         fetchTrips();
//     }, [baseURL]);

//     const handleRequestFuel = async (tripId) => {
//         try {
//             const response = await fetch(`${baseURL}/fuel/request`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     tripId,
//                 }),
//             });

//             if (response.ok) {
//                 // Update trip status after successful fuel request
//                 setTrips((prevTrips) =>
//                     prevTrips.map((trip) =>
//                         trip.id === tripId ? { ...trip, status: 'requested' } : trip
//                     )
//                 );
//                 setFuelRequested(false); // Close the modal
//                 setSelectedTrip(null); // Reset selected trip
//             } else {
//                 console.error('Error requesting fuel:', response.statusText);
//             }
//         } catch (error) {
//             console.error('Error requesting fuel:', error);
//         }
//     };

//     const handleOpenModal = (trip) => {
//         setSelectedTrip(trip);
//         setFuelRequested(true);
//     };

//     return (
//         <>
//             <h1>Upcoming Trips</h1>
//             <ul>
//                 {trips.map((trip) => (
//                     <li key={trip.id}>
//                         <div>
//                             <p>Destination: {trip.destination}</p>
//                             <p>Status: {trip.status}</p>
//                             {trip.status === 'in_progress' && (
//                                 <button onClick={() => handleOpenModal(trip)}>View Trip Details</button>
//                             )}
//                         </div>
//                     </li>
//                 ))}
//             </ul>

//             {/* Fuel Request Modal */}
//             {selectedTrip && fuelRequested && (
//                 <div className="modal">
//                     <h2>Request Fuel for {selectedTrip.destination}</h2>
//                     <p>Trip ID: {selectedTrip.id}</p>
//                     <button onClick={() => handleRequestFuel(selectedTrip.id)}>Confirm Request</button>
//                     <button onClick={() => setFuelRequested(false)}>Cancel</button>
//                 </div>
//             )}
//         </>
//     );
// };

// export default UpcomingTrips;


import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const UpcomingTrips = () => {
    const [trips, setTrips] = useState([]);
    const [fuelRequested, setFuelRequested] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [odometerImage, setOdometerImage] = useState(null); // State to hold the odometer image
    const baseURL = 'https://your-api-url.com'; // Replace with your actual base URL

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

    const handleRequestFuel = async (tripId) => {
        if (!odometerImage) {
            alert('Please capture the odometer image before requesting fuel.');
            return;
        }

        const formData = new FormData();
        formData.append('tripId', tripId);
        formData.append('odometerImage', odometerImage); // Include the odometer image

        try {
            const response = await fetch(`${baseURL}/fuel/request`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Update trip status after successful fuel request
                setTrips((prevTrips) =>
                    prevTrips.map((trip) =>
                        trip.id === tripId ? { ...trip, status: 'requested' } : trip
                    )
                );
                setFuelRequested(false); // Close the modal
                setSelectedTrip(null); // Reset selected trip
                setOdometerImage(null); // Reset the odometer image
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
        setOdometerImage(null); // Reset odometer image when opening modal
    };

    const handleCloseModal = () => {
        setFuelRequested(false);
        setSelectedTrip(null);
        setOdometerImage(null); // Reset the odometer image when closing modal
    };

    const handleCaptureImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            setOdometerImage(file); // Store the captured odometer image
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
                            {trip.status === 'in_progress' && (
                                <button onClick={() => handleOpenModal(trip)}>View Trip Details</button>
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
