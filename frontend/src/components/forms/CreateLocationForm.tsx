import React from 'react';
import ReactMapGL, { Marker, MapLayerMouseEvent, ViewState } from 'react-map-gl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useCreateLocationMarkerStore } from '@/store/useCreateLocationMarkerStore.ts';
import { useCreateMultipleLocationsMutation } from '@/queries/createLocations.ts';

interface CreateLocationFormProps {
  onSuccess: () => void;
  contractId: string;
  lockFields: boolean;
}

const initialViewState: ViewState = {
  longitude: 23.59991552647557,
  latitude: 46.76698245436452,
  zoom: 9,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, right: 0, bottom: 0, left: 0 },
};

const reverseGeocode = async (longitude: number, latitude: number) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${import.meta.env.VITE_MAPS_KEY}`,
  );
  const data = await response.json();
  return data.features[0]?.place_name || 'Unknown Location';
};

const CreateLocationForm = ({ contractId, lockFields, onSuccess }: CreateLocationFormProps) => {
  console.log(lockFields);
  const [viewState, setViewState] = React.useState(initialViewState);
  const { markers, addMarker, updateMarker, deleteMarkers } = useCreateLocationMarkerStore();
  const createMultipleLocations = useCreateMultipleLocationsMutation();

  const handleDoubleClick = async (evt: MapLayerMouseEvent) => {
    evt.preventDefault();
    const { lng, lat } = evt.lngLat;
    const address = await reverseGeocode(lng, lat);

    const newMarker = { longitude: lng, latitude: lat, address, name: '' };

    addMarker(newMarker);
  };

  const updateMarkerField = (index: number, field: keyof (typeof markers)[0], value: string | number) => {
    const updatedMarker = { ...markers[index], [field]: value };
    updateMarker(index, updatedMarker);
  };

  const handleSubmit = () => {
    const markersToSend = markers.map((marker) => ({
      name: marker.name || '',
      address: marker.address || '',
      latitude: marker.latitude,
      longitude: marker.longitude,
    }));

    createMultipleLocations.mutate(
      { locations: markersToSend, contractId: contractId },
      {
        onSuccess: () => {
          onSuccess();
          deleteMarkers();
        },
      },
    );
    console.log('All Locations:', markers);
  };

  return (
    <div className="flex gap-4">
      <ReactMapGL
        {...viewState}
        style={{ width: '800px', height: '400px' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={import.meta.env.VITE_MAPS_KEY}
        onDblClick={handleDoubleClick}
      >
        {markers.map((marker, index) => (
          <Marker key={index} longitude={marker.longitude} latitude={marker.latitude} />
        ))}
      </ReactMapGL>
      <div className="w-full mt-4 gap-4 flex flex-col items-center justify-center max-h-[400px]">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-primary">Editable Locations</CardTitle>
            <CardDescription>Double click on the map to add a new marker</CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto flex gap-4 max-h-[300px] flex-col">
            {markers.map((marker, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">Location {index}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 mb-4 p-2">
                  <Input
                    placeholder="Longitude"
                    className="hidden"
                    value={marker.longitude}
                    disabled={lockFields}
                    onChange={(e) => updateMarkerField(index, 'longitude', parseFloat(e.target.value))}
                  />
                  <Input
                    placeholder="Latitude"
                    className="hidden"
                    value={marker.latitude}
                    disabled={lockFields}
                    onChange={(e) => updateMarkerField(index, 'latitude', parseFloat(e.target.value))}
                  />
                  <Input
                    placeholder="Address"
                    value={marker.address || ''}
                    disabled={lockFields}
                    onChange={(e) => updateMarkerField(index, 'address', e.target.value)}
                  />
                  <Input
                    placeholder="Name"
                    value={marker.name || ''}
                    disabled={lockFields}
                    onChange={(e) => updateMarkerField(index, 'name', e.target.value)}
                  />
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
        <Button onClick={handleSubmit} disabled={lockFields} className="w-1/2">
          Submit All
        </Button>
      </div>
    </div>
  );
};

export default CreateLocationForm;
