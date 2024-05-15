import { useParams } from 'react-router-dom';
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import { getContractLocations } from '@/queries/contractDetails.ts';
import { ColumnDef } from '@tanstack/react-table';
import { LocationData, TaskTemplate } from '@/queries/clientDetails.ts';
import Map, { Marker, Popup } from 'react-map-gl';
import { useQuery } from 'react-query';
import { QueryResponse } from '@/utils/types.ts';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { getTaskTemplates } from '@/queries/taskTemplatesDetails.ts';

const locationColumns: ColumnDef<LocationData>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: 'Address',
  },
  {
    id: 'rooms',
    accessorKey: 'rooms',
    header: 'Rooms',
  },
];
const taskTemplateColumns: ColumnDef<TaskTemplate>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
  },
  {
    id: 'necessaryWorkers',
    accessorKey: 'necessaryWorkers',
    header: 'Necessary Workers',
  },
  {
    id: 'necessaryTools',
    accessorFn: (row) => row.necessaryTools.join(', '),
    header: 'Necessary Tools',
  },
];

const mapBoxAccessToken = 'pk.eyJ1Ijoic2t5MTMzNyIsImEiOiJjbHZtZXVrbXEwMXJ1MnFsOWZlM3VvZGw3In0.U_n4PkUbZjGV7gor_49rUA';
function ContractDetails() {
  const [popUp, setPopUp] = useState({ latitude: 0, longitude: 0 });
  const { contractId } = useParams();
  const { data, isLoading } = useQuery<QueryResponse<LocationData>>(`locationContract${contractId}`, {
    queryFn: () => getContractLocations(contractId ?? ''),
  });
  let longitude = 0;
  let latitude = 0;

  if (!isLoading && data) {
    data.data.forEach((location) => {
      latitude += location.latitude;
      longitude += location.longitude;
    });
    latitude /= data.data.length;
    longitude /= data.data.length;
  }
  const hoverFn = (rowNo: string) => {
    if (!isLoading && data) {
      setPopUp({
        latitude: data.data[rowNo as keyof typeof data.data].latitude,
        longitude: data.data[rowNo as keyof typeof data.data].longitude,
      });
    }
  };
  const leaveFn = (rowNo: string) => {
    setPopUp({
      latitude: 0,
      longitude: 0,
    });
  };
  useEffect(() => {
    console.log(popUp);
  }, [popUp]);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Details for contract</CardTitle>
        </CardHeader>
      </Card>
      {contractId && data && (
        <div className="flex flex-col gap-4">
          <Card className="h-fit bg-transparent">
            <CardHeader>
              <CardTitle>Locations</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 w-full">
              <Map
                mapboxAccessToken={mapBoxAccessToken}
                style={{ width: '400px', height: '400px', borderRadius: '2.5%' }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                initialViewState={{
                  latitude: latitude,
                  longitude: longitude,
                }}
              >
                <>
                  {data.data.map((location) => {
                    const coords = [location.latitude, location.longitude];
                    return (
                      <Marker
                        key={`marker${coords[1]}${coords[2]}`}
                        longitude={coords[1]}
                        latitude={coords[0]}
                        color="hsl(24.6 95% 53.1%)"
                        onClick={(e) => {
                          e.originalEvent.stopPropagation();
                          setPopUp({ latitude: coords[0], longitude: coords[1] });
                        }}
                      />
                    );
                  })}
                  {popUp.longitude && popUp.latitude && (
                    <Popup longitude={popUp.longitude} latitude={popUp.latitude} anchor="top">
                      <div className="text-black">
                        {popUp.latitude} {popUp.longitude}
                      </div>
                    </Popup>
                  )}
                </>
              </Map>
              <div className="w-1/2">
                <QueryTable
                  queryFn={(pagSort) => getContractLocations(contractId, pagSort)}
                  queryKey={`locationContract${contractId}`}
                  columns={locationColumns}
                  sortableColumns={{
                    name: true,
                    contractId: true,
                  }}
                  navigateTo="/locations"
                  navigateToState="coords"
                  onRowHover={hoverFn}
                  onRowExit={leaveFn}
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col w-full">
            <QueryTable
              queryFn={(pagSort) => getTaskTemplates(pagSort, contractId ?? '')}
              queryKey={`taskTemplatesContract${contractId}`}
              columns={taskTemplateColumns}
              sortableColumns={{
                title: true,
                necessaryWorkers: true,
                necessaryTools: false,
              }}
              defaultSort={'title'}
              navigateTo="/task-templates"
              navigateToState="details"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ContractDetails;
