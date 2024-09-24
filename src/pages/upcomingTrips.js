import React, { useState, useEffect } from 'react';

const UpcomingTrips = () => {
    const [trips, setTrips] = useState([]);
    const [fuelRequested, setFuelRequested] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [userId, setUserId] = useState(''); // Local state for userId
    const [orgId, setOrgId] = useState(''); // Local state for orgId
    const baseURL = 'https://your-api-url.com'; // Replace with your actual base URL

    // Simulate fetching user data
    useEffect(() => {
        // Example: set userId and orgId
        setUserId('exampleUserId'); // Replace with actual logic to get userId
        setOrgId('exampleOrgId'); // Replace with actual logic to get orgId
    }, []);

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
        try {
            const response = await fetch(`${baseURL}/fuel/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tripId,
                    userId, // Use local state for userId
                    orgId,  // Use local state for orgId
                }),
            });

            if (response.ok) {
                // Update trip status after successful fuel request
                setTrips((prevTrips) =>
                    prevTrips.map((trip) =>
                        trip.id === tripId ? { ...trip, status: 'requested' } : trip
                    )
                );
                setFuelRequested(false); // Close the modal
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
    };

    const handleCloseModal = () => {
        setFuelRequested(false);
        setSelectedTrip(null);
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
                                <button onClick={() => handleOpenModal(trip)}>Request Fuel</button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal for Fuel Request */}
            {fuelRequested && selectedTrip && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.modal}>
                        <h2>Request Fuel</h2>
                        <p>Trip ID: {selectedTrip.id}</p>
                        <p>Destination: {selectedTrip.destination}</p>
                        <p>Status: {selectedTrip.status}</p>
                        <button onClick={() => handleRequestFuel(selectedTrip.id)}>Confirm Request</button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
};

// Simple styles for the modal
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
    },
};

export default UpcomingTrips;
