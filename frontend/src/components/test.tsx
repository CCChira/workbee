import { GoogleMap, Libraries, LoadScript, MarkerF, useLoadScript } from '@react-google-maps/api';
import { Coordinates } from '@/utils/types.ts';

const containerStyle = {
  width: '400px',
  height: '400px',
};

interface MapComponentProps {
  center: Coordinates;
  markers: Coordinates[];
}

const libraries: Libraries = ['places'];
function MyMapComponent({ center, markers }: MapComponentProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GMAPS_KEY,
    libraries: libraries,
  });
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <GoogleMap mapContainerStyle={containerStyle} zoom={10} center={center}>
      {markers && markers.map((marker) => <MarkerF position={marker} key={`i${marker.lat + marker.lng}`} />)}
    </GoogleMap>
  );
}

export default MyMapComponent;
