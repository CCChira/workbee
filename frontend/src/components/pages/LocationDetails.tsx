import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Map, { Marker } from 'react-map-gl';
interface LocationDetailsProps {}

function LocationDetails({}: LocationDetailsProps) {
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
