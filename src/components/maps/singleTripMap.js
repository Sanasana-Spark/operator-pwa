import React, { useState, useEffect, useMemo } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
const libraries = ["places"];

const DirectionsMap = ({ origin, destination, center }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  
  // Load Google Maps JS API
  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey:process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API Key
  //   libraries: ["places"]
  // });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Map container styles
  const containerStyle = {
    width: '100%',
    height: '500px',
  };

  // Center of the map (you can set it to any default coordinates)
  // const defaultCenter = {
  //   lat: 40.7128, // Example: New York City coordinates
  //   lng: -74.0060,
  // };

  // Calculate and display the route
  const calculateRoute = () => {
    if (origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING, // Can also be WALKING, BICYCLING, etc.
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  };

  console.log(directionsResponse)

  // Run when component loads or when origin/destination changes
  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  },
  // eslint-disable-next-line
   [isLoaded, origin, destination]);


  const options = useMemo(
    () => ({
      mapId: "9ebfa89edaafd2e",
      disableDefaultUI: false,
      clickableIcons: false,
    }),
    []
  );

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      options={options}
    >
      {directionsResponse && (
        <DirectionsRenderer directions={directionsResponse} />
      )}


    </GoogleMap>
  );
};

export default DirectionsMap;
