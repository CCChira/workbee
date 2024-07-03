import { useEffect, useState } from 'react';
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import { getLocations, Location } from '@/queries/getAllLocations.ts';
import { ColumnDef } from '@tanstack/react-table';
import Map, { Marker, Popup } from 'react-map-gl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.tsx';
import UpdateUserForm from '@/components/forms/UpdateUserForm.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { QueryResponse } from '@/utils/types.ts';
import { useQuery } from 'react-query';
import CreateLocationForm from '@/components/forms/CreateLocationForm.tsx';

const columns: ColumnDef<Location>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="w-full bg-primary h-32 border border-primary-foreground"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onClick={(event) => {
          event.stopPropagation();
        }}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          return row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableHiding: false,
    enableSorting: false,
  },
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
    id: 'contractTitle',
    accessorFn: (row: Location) => row.Contract?.title,
    header: 'Contract Name',
  },
  {
    id: 'clientName',
    accessorFn: (row: Location) => row.Contract?.user?.name,
    header: 'Client Name',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const location = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                navigator.clipboard.writeText(location.id.toString());
              }}
            >
              View Location
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              Delete Location
            </DropdownMenuItem>
            <Dialog>
              <DialogTrigger
                onClick={(event) => event.stopPropagation()}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-primary-foreground"
              >
                Update Location
              </DialogTrigger>
              <DialogContent onClick={(event) => event.stopPropagation()}>
                <UpdateUserForm onSuccess={() => {}} id={row.original.id} />
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function Locations({}) {
  const [popUp, setPopUp] = useState({ latitude: 0, longitude: 0, name: '' });
  const { data, isLoading } = useQuery<QueryResponse<Location>>({ queryKey: `locationsDummy`, queryFn: getLocations });
  let longitude = 0;
  let latitude = 0;
  if (!isLoading && data) {
    (data as unknown as { data: Location[] }).data.forEach((location) => {
      latitude += location.latitude;
      longitude += location.longitude;
    });
    latitude /= (data as unknown as { data: Location[] }).data.length;
    longitude /= (data as unknown as { data: Location[] }).data.length;
  }

  const hoverFn = (rowNo: string) => {
    if (!isLoading && data) {
      setPopUp({
        latitude: (data as unknown as { data: Location[] }).data[parseInt(rowNo)].latitude,
        longitude: (data as unknown as { data: Location[] }).data[parseInt(rowNo)].longitude,
        name: (data as unknown as { data: Location[] }).data[parseInt(rowNo)].name,
      });
    }
  };

  const leaveFn = () => {
    setPopUp({
      latitude: 0,
      longitude: 0,
      name: '',
    });
  };

  return (
    <div>
      {data && (
        <div className="flex flex-col gap-4">
          <Card className="h-fit bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Locations</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Location</Button>
                </DialogTrigger>
                <DialogContent className="min-w-[calc(100vw-800px)] max-h-[900px] h-[600px] flex items-center justify-center">
                  <CreateLocationForm onSuccess={() => console.log('ok')} lockFields={false} />
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
                  {(data as unknown as { data: Location[] }).data.map((location, index) => {
                    const coords = [location.latitude, location.longitude];
                    return (
                      <Marker
                        key={`marker${coords[1]}${coords[0]}${index}`}
                        longitude={coords[1]}
                        latitude={coords[0]}
                        color="hsl(24.6 95% 53.1%)"
                        onClick={(e) => {
                          e.originalEvent.stopPropagation();
                          setPopUp({ latitude: coords[0], longitude: coords[1], name: location.name });
                        }}
                      />
                    );
                  })}
                  {popUp.longitude && popUp.latitude && (
                    <Popup longitude={popUp.longitude} latitude={popUp.latitude} anchor="top">
                      <div className="text-black">{popUp.name}</div>
                    </Popup>
                  )}
                </>
              </Map>
              <div className="w-full">
                <QueryTable
                  queryFn={(pagSort) => getLocations(pagSort)}
                  queryKey="locations"
                  columns={columns}
                  sortableColumns={{
                    name: true,
                    address: true,
                    latitude: true,
                    longitude: true,
                    contractTitle: true,
                    clientName: true,
                  }}
                  searchField="address"
                  onRowHover={hoverFn}
                  onRowExit={leaveFn}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Locations;
