/* eslint-disable react/prop-types */
import React, {  useMemo, useCallback, useRef } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const PropCard = ({ startpoint, endpoint, key }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const google = window.google;



  const mapRef = useRef();
  const options = useMemo(
    () => ({
      mapId: "9ebfa89edaafd2e",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  if (!isLoaded) return <div>Loading...</div>;




        return (

            
                <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={startpoint}
                zoom={13}
                options={options}
                onLoad={onLoad}
              >
                <Marker
                  position={startpoint}
                  key={key}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: 'red',
                    fillOpacity: 1,
                    strokeColor: 'red',
                    strokeWeight: 1,
                    scale: 10,
                  }}
                   />
  
              </GoogleMap>

     



        );
    

};

export default PropCard;
