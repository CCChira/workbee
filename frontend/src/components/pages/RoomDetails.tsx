import { getTasksFromRoom, useGetRoom } from '@/queries/getRoom.ts';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel.tsx';
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import { fetchRoomsByLocation } from '@/queries/roomsById.ts';
import { ColumnDef } from '@tanstack/react-table';
import { TaskInstance } from '@/queries/employees.ts';
const taskInstanceColumns: ColumnDef<TaskInstance>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'hour',
    accessorKey: 'hour',
    header: 'Hour',
  },
];
export default function RoomDetails() {
  const { roomId } = useParams<{ roomId: string }>();
  const { data: roomData, error: roomError, isLoading: roomIsLoading } = useGetRoom(roomId ?? '0');
  return (
    <>
      <Card>
        <CardHeader>
          {roomData && !roomIsLoading && (
            <>
              <CardTitle> {roomData.room.name}</CardTitle>{' '}
              <CardDescription>Presentation of room {roomData.room.name} and its tasks</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {roomData && !roomIsLoading && (
            <div className="flex gap-4">
              <QueryTable
                queryFn={(pagSort) => getTasksFromRoom(roomId ?? '0', pagSort)}
                queryKey={`taskRoom${roomId}`}
                columns={taskInstanceColumns}
                sortableColumns={{
                  status: true,
                }}
                searchField="name"
              />
              <Carousel className="w-full max-w-xs mx-12">
                <CarouselContent>
                  {roomData.room.images.map((img, index) => (
                    <CarouselItem key={img.presignedUrl}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <img src={img.presignedUrl} alt={`image${index}FromRoom${img.roomId}`} />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
