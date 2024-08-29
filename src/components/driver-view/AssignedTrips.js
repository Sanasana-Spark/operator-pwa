// src/components/AssignedTrips.js
import React from 'react';
import './AssignedTrips.css'; // Make sure to create this CSS file for styling
// import backIcon from '../assets/backIcon.png'; // Ensure you have this icon in your assets folder

const tripsData = [
  {
    id: 1,
    location: 'East Legon',
    pickupPoint: 'Madina',
    loadingZone: 'Accra Mall',
    deliveryZone: 'Tema',
    kilometers: 20,
    time: '2 hours',
  },
  {
    id: 2,
    location: 'West Legon',
    pickupPoint: 'Labone',
    loadingZone: 'Circle',
    deliveryZone: 'Kasoa',
    kilometers: 25,
    time: '2.5 hours',
  },
  // Add more trip data as needed
];

const AssignedTrips = ({ onBack }) => {
  return (
    <div className="assigned-trips">
      <header className="header">
        {/* <img src={backIcon} alt="Back" className="back-icon" onClick={onBack} /> */}
        <h2>Assigned Trips</h2>
      </header>
      <div className="trips-container">
        {tripsData.map((trip) => (
          <div key={trip.id} className="trip-card">
            <h3>Location: {trip.location}</h3>
            <p>Pickup Point: {trip.pickupPoint}</p>
            <p>Loading Zone: {trip.loadingZone}</p>
            <p>Delivery Zone: {trip.deliveryZone}</p>
            <p>Kilometers: {trip.kilometers} km</p>
            <p>Time: {trip.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedTrips;
