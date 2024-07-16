import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchRooms, fetchRoomsByLocation, Room } from '@/queries/roomsById.ts';
import { defaultPagSort } from '@/components/pages/LocationDetails.tsx';
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { Popover, PopoverContent } from '@/components/ui/popover.tsx';
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
export default function Rooms() {
  const [hoveredImage, setHoveredImage] = useState('');
  const { data, error, isLoading } = useQuery(`rooms`, () => fetchRooms(defaultPagSort));

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
      <QueryTable
        queryFn={(pagSort) => fetchRooms(pagSort)}
        queryKey={`rooms`}
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
        defaultSort="name"
      />
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
    </>
  );
}
