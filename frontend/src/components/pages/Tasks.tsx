import QueryTable from '@/components/layout/table/QueryTable.tsx';
import { getTaskTemplates, useGetTaskTemplates } from '@/queries/taskTemplatesDetails.ts';
import { ColumnDef } from '@tanstack/react-table';
import { TaskTemplate } from '@/queries/clientDetails.ts';
import { useQuery } from 'react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Sheet } from 'lucide-react';
import { useEffect } from 'react';
const taskTemplateColumns: ColumnDef<TaskTemplate>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
  },
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
    id: 'contractId',
    accessorKey: 'contractId',
    header: 'Contract ID',
  },
  {
    id: 'count',
    accessorKey: '_count',
    header: 'Schedule count',
    cell: ({ row }) => row.original._count.TaskSchedule,
  },
  {
    id: 'necessaryTools',
    accessorFn: (row) => row.necessaryTools.join(', '),
    header: 'Necessary Tools',
  },
];
function Tasks() {
  const { data, error, isLoading, isError } = useQuery('taskTemplatesCount', fetchTaskTemplateCount);

  // Fetch function using the Fetch API
  async function fetchTaskTemplateCount() {
    const response = await fetch('/api/task-templates/count', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }

  return (
    <div className="grid flex-1 items-start gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Information about Task Templates and Task Schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            {isLoading ? (
              <li>Loading...</li>
            ) : (
              <>
                <li className="w-full flex justify-between">
                  <span>Task Templates: </span>
                  <span className="text-primary">{data.totalCount}</span>
                </li>
                <li className="w-full flex justify-between">
                  <span>Used Task Templates: </span>
                  <span className="text-primary">{data.usedCount}</span>
                </li>
                <li className="w-full flex justify-between">
                  <span>Task instances today: </span>
                  <span className="text-primary">{data.instancesToday}</span>
                </li>
                <li className="w-full flex justify-between">
                  <span>Upcoming Task instances: </span>
                  <span className="text-primary">{data.instancesNext7Days}</span>
                </li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>
      <QueryTable
        queryFn={(pagSort) => getTaskTemplates(pagSort)}
        queryKey={`taskTemplates`}
        columns={taskTemplateColumns}
        sortableColumns={{
          title: true,
          necessaryWorkers: true,
          necessaryTools: false,
          contractId: true,
          count: true,
          id: true,
        }}
        defaultSort={'title'}
        navigateTo="/task-templates"
        navigateToState="details"
        searchField="title"
      />
    </div>
  );
}

export default Tasks;
