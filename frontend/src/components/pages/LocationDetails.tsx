import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Map, { Marker } from 'react-map-gl';
interface LocationDetailsProps {}
const mapBoxAccessToken = 'pk.eyJ1Ijoic2t5MTMzNyIsImEiOiJjbHZtZXVrbXEwMXJ1MnFsOWZlM3VvZGw3In0.U_n4PkUbZjGV7gor_49rUA';
function LocationDetails({}: LocationDetailsProps) {
  const { state } = useLocation();
  const tempCoords = state.split(', ');
  const coordinates = {
    lat: parseFloat(tempCoords[0]),
    lng: parseFloat(tempCoords[1]),
  };

  return (
    <Map
      mapboxAccessToken={mapBoxAccessToken}
      initialViewState={{
        longitude: coordinates.lng,
        latitude: coordinates.lat,
        zoom: 14,
      }}
      style={{ width: 600, height: 400, border: '5px solid red' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Marker latitude={coordinates.lat} longitude={coordinates.lng} anchor={'center'}></Marker>
    </Map>
  );
}

export default LocationDetails;
