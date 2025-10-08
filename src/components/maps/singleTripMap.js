import React, { useState, useEffect, useMemo } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
  Marker,  
} from "@react-google-maps/api";
const libraries = ["places"];

const DirectionsMap = ({ origin, destination, center, stops }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [routeMarkers, setRouteMarkers] = useState([]);
  
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

    // Helper function to get marker icon based on type
  const getMarkerIcon = (type) => {
    switch (type) {
      case "start":
        return {
          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        };
      case "stop":
        return {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(35, 35),
        };
      case "end":
        return {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        };
      default:
        return {
          url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
          scaledSize: new window.google.maps.Size(35, 35),
        };
    }
  };


  // Calculate and display the route
  const calculateRoute = () => {
    if (origin && destination) {
      const waypoints = stops
        .filter(stop => stop.s_place_query) // Only include stops with valid location data
        .map(stop => ({
          location: stop.s_place_query,
          stopover: true
        }));

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          optimizeWaypoints: true,
          travelMode: window.google.maps.TravelMode.DRIVING, // Can also be WALKING, BICYCLING, etc.
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
            updateRouteMarkers(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  };

    const updateRouteMarkers = (directionsResult) => {
    const markers = [];
    const route = directionsResult.routes[0];

    // Add start marker
    const startLocation = route.legs[0].start_location;
    markers.push({
      position: { lat: startLocation.lat(), lng: startLocation.lng() },
      type: "start",
      title: "Start Location",
      label: "S",
    });

    // Add stop markers (intermediate waypoints)
    route.legs.forEach((leg, index) => {
      if (index < route.legs.length - 1) { // Don't add marker for final destination
        const endLocation = leg.end_location;
        markers.push({
          position: { lat: endLocation.lat(), lng: endLocation.lng() },
          type: "stop",
          title: `Stop ${index + 1}`,
          label: `${index + 1}`,
        });
      }
    });

    // Add end marker
    const lastLeg = route.legs[route.legs.length - 1];
    const endLocation = lastLeg.end_location;
    markers.push({
      position: { lat: endLocation.lat(), lng: endLocation.lng() },
      type: "end",
      title: "End Location",
      label: "E",
    });

    setRouteMarkers(markers);
  };

  // Run when component loads or when origin/destination changes
  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  },
  // eslint-disable-next-line
   [isLoaded, origin, destination, stops]);


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
        <DirectionsRenderer 
        directions={directionsResponse}
        options={{
            suppressMarkers: true, // We'll show custom markers
            polylineOptions: {
              strokeColor: "#2196f3",
              strokeWeight: 4,
              strokeOpacity: 0.8,
            },
          }}
         />
      )}

       {/* Custom route markers (start, stops, end) */}
            {routeMarkers.map((marker, index) => (
              <Marker
                key={`route-${index}`}
                position={marker.position}
                icon={getMarkerIcon(marker.type)}
                title={marker.title}
                label={{
                  text: marker.label,
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "white",
                }}
              />
            ))}


    </GoogleMap>
  );
};

export default DirectionsMap;
