import { useParams } from 'react-router-dom';
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import { getContractLocations } from '@/queries/contractDetails.ts';
import { ColumnDef } from '@tanstack/react-table';
import { LocationData, TaskTemplate } from '@/queries/clientDetails.ts';
import Map, { Marker, Popup } from 'react-map-gl';
import { useQuery } from 'react-query';
import { QueryResponse } from '@/utils/types.ts';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { getTaskTemplates } from '@/queries/taskTemplatesDetails.ts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.tsx';
import CreateLocationForm from '@/components/forms/CreateLocationForm.tsx';
import { Location } from '@/queries/getAllLocations.ts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import TasksCalendar from '@/components/layout/calendar/TasksCalendar.tsx';
import { fetchTaskInstancesByMonthYear } from '@/queries/taskInstanceThisMonth.ts';

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

function ContractDetails() {
  const [popUp, setPopUp] = useState({ latitude: 0, longitude: 0 });
  const { contractId } = useParams();
  const { data, isLoading } = useQuery<QueryResponse<LocationData[]>>(`locationContract${contractId}`, {
    queryFn: () => getContractLocations(contractId ?? ''),
  });
  let longitude = 0;
  let latitude = 0;

  if (!isLoading && data) {
    (data as unknown as { data: Location[] }).data.forEach((location) => {
      latitude += location.latitude;
      longitude += location.longitude;
    });
    latitude /= data.data.length;
    longitude /= data.data.length;
  }
  const hoverFn = (rowNo: string) => {
    if (!isLoading && data) {
      setPopUp({
        latitude: (data as unknown as { data: Location[] }).data[rowNo as keyof typeof data.data].latitude,
        longitude: (data as unknown as { data: Location[] }).data[rowNo as keyof typeof data.data].longitude,
      });
    }
  };
  const leaveFn = (rowNo: string) => {
    setPopUp({
      latitude: 0,
      longitude: 0,
    });
  };

  return (
    <>
      <h1 className="text-3xl font-medium">Details for contract</h1>
      {contractId && data && (
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="locations">
            <TabsList>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="templates">Task Templates</TabsTrigger>
              <TabsTrigger value="instances">Task Instances</TabsTrigger>
            </TabsList>
            <TabsContent value="locations">
              <Card className="h-fit bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Locations</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Location</Button>
                    </DialogTrigger>
                    <DialogContent className="min-w-[calc(100vw-400px)] max-h-[900px] h-[600px] flex items-center justify-center">
                      <CreateLocationForm
                        onSuccess={() => console.log('ok')}
                        contractId={contractId}
                        lockFields={false}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="flex gap-4 w-full">
                  <Map
                    mapboxAccessToken={import.meta.env.VITE_MAPS_KEY}
                    style={{ width: '400px', height: '400px', borderRadius: '2.5%' }}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                    initialViewState={{
                      latitude: latitude,
                      longitude: longitude,
                      zoom: 10,
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
                  <div className="w-full">
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
                      searchField="name"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Task Templates</CardTitle>
                </CardHeader>
                <CardContent>
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
                    searchField="title"
                  />
                </CardContent>{' '}
              </Card>
            </TabsContent>
            <TabsContent value="instances">
              <Card>
                <CardHeader>
                  <CardTitle>Task Instances</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <TasksCalendar
                    contractId={contractId}
                    queryFn={fetchTaskInstancesByMonthYear}
                    queryKey="idkPulaMea"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col w-full"></div>
        </div>
      )}
    </>
  );
}

export default ContractDetails;
