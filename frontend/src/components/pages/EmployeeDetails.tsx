import ReactMapGL, { Marker } from 'react-map-gl';
import Map from 'react-map-gl';
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import {
  getEmployees,
  getTasksAssignedToUserThisWeek,
  getTasksAssisgnedToUser,
  TaskInstance,
} from '@/queries/employees.ts';
import { ColumnDef } from '@tanstack/react-table';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import employees from '@/components/pages/Employees.tsx';
import { useQuery } from 'react-query';
const mapBoxAccessToken = 'pk.eyJ1Ijoic2t5MTMzNyIsImEiOiJjbHZtZXVrbXEwMXJ1MnFsOWZlM3VvZGw3In0.U_n4PkUbZjGV7gor_49rUA';
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
function EmployeeDetails() {
  const [center, setCenter] = useState({
    longitude: 23.59991552647557,
    latitude: 46.76698245436452,
    zoom: 14,
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
      setCenter((prevState) => ({ ...prevState, latitude, longitude }));
    }
  }, [isTaskDataLoading, taskData]);

  return (
    <div>
      <div className="grid-cols-2">
        <div>
          {taskData && !isTaskDataLoading && (
            <ReactMapGL
              {...center}
              mapboxAccessToken={mapBoxAccessToken}
              style={{ width: 600, height: 400 }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              onMove={(evt) => setCenter(evt.viewState)}
            >
              {taskData &&
                !isTaskDataLoading &&
                taskData.data.map((task) => {
                  return (
                    <Marker
                      latitude={task.room.location.latitude}
                      longitude={task.room.location.longitude}
                      anchor={'center'}
                    ></Marker>
                  );
                })}
            </ReactMapGL>
          )}
        </div>
        <div>
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
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
