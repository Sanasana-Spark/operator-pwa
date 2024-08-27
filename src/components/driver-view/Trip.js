import React, { useState, useEffect } from 'react';

const Trip = ({ tripDistance = 5, onTripEnd }) => {
  const [tripStarted, setTripStarted] = useState(false);
  const [actualDistanceCovered, setActualDistanceCovered] = useState(0);

  useEffect(() => {
    let watchId;
    let distanceInterval;

    if (tripStarted) {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            // Simulate distance calculation (replace this with actual logic)
            setActualDistanceCovered((prev) => prev + 1); // Increment distance by 1 km (dummy implementation)
          },
          (error) => {
            console.error("Error getting GPS position:", error);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }

      // Increment distance every second
      distanceInterval = setInterval(() => {
        setActualDistanceCovered((prev) => {
          if (prev + 1 >= tripDistance) {
            clearInterval(distanceInterval);
            handleEndTrip();
            return tripDistance;
          }
          return prev + 1;
        });
      }, 5); // 1 second interval
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (distanceInterval) {
        clearInterval(distanceInterval);
      }
    };
  }, );

  const handleStartTrip = () => {
    setTripStarted(true);
  };

  const handleEndTrip = () => {
    setTripStarted(false);
    onTripEnd(); // Notify parent component that the trip has ended
  };

  return (
    <div>
      {tripStarted ? (
        actualDistanceCovered >= tripDistance ? (
          <button className="end-trip-button red-button" onClick={handleEndTrip}>
            End Trip
          </button>
        ) : (
          <p>Currently covering {actualDistanceCovered} Km...</p>
        )
      ) : (
        <button className="start-trip-button green-button" onClick={handleStartTrip}>
          Start Trip
        </button>
      )}
    </div>
  );
};

export default Trip;
