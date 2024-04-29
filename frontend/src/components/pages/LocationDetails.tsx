import { useLocation, useParams } from 'react-router-dom';
import MyMapComponent from '@/components/test.tsx';
import { useEffect } from 'react';

interface LocationDetailsProps {}
function LocationDetails({}: LocationDetailsProps) {
  //const { locationId } = useParams();
  const { state } = useLocation();
  const tempCoords = state.split(', ');
  const coordinates = {
    lat: parseFloat(tempCoords[0]),
    lng: parseFloat(tempCoords[1]),
  };
  useEffect(() => {
    console.log(coordinates);
  }, [coordinates]);
  return <MyMapComponent center={coordinates} markers={[coordinates]} />;
}

export default LocationDetails;
