import { useParams } from 'react-router-dom';
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import { fetchRoomsByLocation, Room } from '@/queries/roomsById.ts';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel.tsx';
import { useQuery, useQueryClient } from 'react-query';
import { PaginationSortingState } from '@/utils/types.ts';
import { Popover, PopoverContent } from '@/components/ui/popover.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import CreateLocationForm from '@/components/forms/CreateLocationForm.tsx';
import { getContractLocations } from '@/queries/contractDetails.ts';
import { getTaskTemplates } from '@/queries/taskTemplatesDetails.ts';
import TasksCalendar from '@/components/layout/calendar/TasksCalendar.tsx';
import { fetchTaskInstancesByMonthYear } from '@/queries/taskInstanceThisMonth.ts';

const columns: ColumnDef<Room>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'accessMode',
    accessorKey: 'accessMode',
    header: 'Access Mode',
  },
  {
    id: 'location',
    accessorKey: 'location.name',
    header: 'Location',
  },
  {
    id: 'images',
    accessorFn: (row) => row.images.length,
    header: 'Images',
  },
];
export const defaultPagSort: PaginationSortingState = {
  size: 10,
  page: 1,
  sortOrder: {
    property: 'name',
    direction: 'asc',
  },
};
function LocationDetails() {
  const { locationId } = useParams<{ locationId: string }>();
  const [hoveredImage, setHoveredImage] = useState('');
  const { data, error, isLoading } = useQuery(`rooms${locationId}`, () =>
    fetchRoomsByLocation(parseInt(locationId ?? '0'), defaultPagSort),
  );

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX + 15, y: event.clientY + 15 });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  return (
    <>
      <h1 className="text-3xl font-medium">Rooms</h1>
      {locationId && (
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="locations">
            <TabsList>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="instances">Task Instances</TabsTrigger>
            </TabsList>
            <TabsContent value="locations">
              <Card className="h-fit bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Rooms</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 w-full">
                  {data && !isLoading && (
                    <QueryTable
                      queryFn={(pagSort) => fetchRoomsByLocation(parseInt(locationId ?? '0'), pagSort)}
                      queryKey={`rooms${locationId}`}
                      columns={columns}
                      sortableColumns={{
                        name: true,
                        accessMode: true,
                      }}
                      onRowHover={(rowNo) => {
                        setHoveredImage(data.data[rowNo].images[0] ? data.data[rowNo].images[0].url : '');
                      }}
                      onRowExit={() => setHoveredImage('')}
                      searchField="name"
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="instances">
              <Card>
                <CardHeader>
                  <CardTitle>Task Instances</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <TasksCalendar locationId={locationId} queryFn={fetchTaskInstancesByMonthYear} queryKey="calendar" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {hoveredImage !== '' && (
            <Popover open={hoveredImage !== ''} defaultOpen={true}>
              <PopoverContent
                style={{
                  top: position.y - 210,
                  left: position.x,
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  backgroundImage: `url(${hoveredImage})`,
                  backgroundSize: 'cover',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  pointerEvents: 'none',
                }}
              ></PopoverContent>
            </Popover>
          )}
        </div>
      )}
    </>
  );
}

export default LocationDetails;
