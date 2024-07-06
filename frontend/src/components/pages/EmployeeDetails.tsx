import ReactMapGL, { Marker } from 'react-map-gl';
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import { getTasksAssignedToUserThisWeek, getTasksAssisgnedToUser, TaskInstance } from '@/queries/employees.ts';
import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getTaskTemplates } from '@/queries/taskTemplatesDetails.ts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { TabsContent } from '@radix-ui/react-tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import TasksCalendar from '@/components/layout/calendar/TasksCalendar.tsx';
import { fetchTaskInstancesByMonthYear } from '@/queries/taskInstanceThisMonth.ts';
import { Badge } from '@/components/ui/badge.tsx';
import { colors, taskStatusCell } from '@/utils/taskStatusCell.ts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { updateTaskInstanceStatus } from '@/queries/updateTaskInstanceStatus.ts';
import { queryClient } from '@/main.tsx';
import { io } from 'socket.io-client';

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
    cell: ({ row, table }) => {
      const status = row.original.status;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Badge className={`${colors[status as keyof typeof taskStatusCell]} cursor-pointer`}>
              {taskStatusCell[status as keyof typeof taskStatusCell]}
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent onClick={(event) => event.stopPropagation()}>
            <ul>
              {Object.entries(taskStatusCell).map((pair) => {
                return (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    key={pair[0]}
                    onSelect={async () => {
                      await updateTaskInstanceStatus(row.original.id, pair[0]);
                      await queryClient.invalidateQueries();

                      await queryClient.refetchQueries();
                    }}
                  >
                    {pair[1]}
                  </DropdownMenuItem>
                );
              })}
            </ul>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    id: 'hour',
    accessorKey: 'hour',
    header: 'Hour',
  },
];
function EmployeeDetails() {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, deviceId: '' });

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server!');
      socket.emit('register_user'); // If needed, otherwise just handle it server-side
    });

    socket.on('update_location', (data) => {
      console.log('Location update received:', data);
      setLocation({ latitude: data.latitude, longitude: data.longitude, deviceId: data.deviceId });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server.');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const [center, setCenter] = useState({
    longitude: 23.59991552647557,
    latitude: 46.76698245436452,
    zoom: 12,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  const { employeeId } = useParams();
  const { data: taskData, isLoading: isTaskDataLoading } = useQuery<{ data: TaskInstance[] }>(
    ['employeeTasks', employeeId],
    {
      queryFn: () =>
        getTasksAssisgnedToUser(
          {
            page: 1,
            size: 100000,
            sortOrder: {
              property: 'id',
              direction: 'asc',
            },
          },
          employeeId ?? '',
        ),
    },
  );

  useEffect(() => {
    if (taskData && !isTaskDataLoading) {
      const longitude =
        taskData?.data.reduce((acc, task) => acc + task.room.location.longitude, 0) / taskData?.data.length;
      const latitude =
        taskData?.data.reduce((acc, task) => acc + task.room.location.latitude, 0) / taskData?.data.length;
      if (longitude && latitude) setCenter((prevState) => ({ ...prevState, latitude, longitude }));
    }
  }, [isTaskDataLoading, taskData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Details</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between gap-4">
        <div>
          {taskData && !isTaskDataLoading && (
            <ReactMapGL
              {...center}
              mapboxAccessToken={import.meta.env.VITE_MAPS_KEY}
              style={{ width: 600, height: 400 }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              onMove={(evt) => setCenter(evt.viewState)}
            >
              <Marker latitude={location.latitude} longitude={location.longitude} anchor={'center'}></Marker>
            </ReactMapGL>
          )}
        </div>
        <div className="w-3/4">
          <Tabs defaultValue="calendar">
            <TabsList>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="instances">Task Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="instances" className="w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Task Templates</CardTitle>
                </CardHeader>
                <CardContent className="flex min-w-max">
                  {employeeId && (
                    <QueryTable
                      columns={taskInstanceColumns}
                      queryFn={(pagSort) => getTasksAssignedToUserThisWeek(pagSort, employeeId)}
                      queryKey={[`employeeTasks`, employeeId]}
                      sortableColumns={{
                        email: true,
                        name: true,
                        createdAt: true,
                      }}
                      searchField="name"
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle>Task Instances</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <TasksCalendar userId={employeeId} queryFn={fetchTaskInstancesByMonthYear} queryKey="idkPulaMea" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmployeeDetails;
