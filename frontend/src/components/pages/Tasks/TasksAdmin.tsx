import { useQuery } from 'react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import QueryTable from '@/components/layout/table/QueryTable.tsx';
import { getTaskTemplates } from '@/queries/taskTemplatesDetails.ts';
import { ColumnDef } from '@tanstack/react-table';
import { TaskTemplate } from '@/queries/clientDetails.ts';
import { Progress } from '@/components/ui/progress.tsx';
import { useMemo } from 'react';

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
async function fetchTaskInstanceStatusCount() {
  const response = await fetch('/api/taskinstance/statuscount', {
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
function TasksAdmin() {
  const { data: taskTemplateData, isLoading: taskTemplateIsLoading } = useQuery(
    'taskTemplatesCount',
    fetchTaskTemplateCount,
  );
  const { data: taskInstanceStatuses, isLoading: taskInstanceStatusesLoading } = useQuery(
    'taskStatusesCount',
    fetchTaskInstanceStatusCount,
  );
  const percentage = useMemo(() => {
    if (!taskInstanceStatusesLoading && taskInstanceStatuses) {
      const totals = taskInstanceStatuses.reduce(
        (
          acc: { completed: number; inProgress: number; notStarted: number },
          status: { _count: { status: number }; status: 'IN_PROGRESS' | 'COMPLETED' | 'INCOMPLETE' },
        ) => {
          switch (status.status) {
            case 'IN_PROGRESS':
              return { ...acc, inProgress: status._count.status };
            case 'COMPLETED':
              return { ...acc, completed: status._count.status };
            case 'INCOMPLETE':
              return { ...acc, incomplete: status._count.status };
          }
        },
        {
          completed: 0,
          inProgress: 0,
          incomplete: 0,
        },
      );
      return (totals.completed / (totals.completed + totals.inProgress + totals.incomplete)) * 100;
    }
  }, [taskInstanceStatuses, taskInstanceStatusesLoading]);
  return (
    <div className="grid flex-1 items-start gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Information about Task Templates and Task Schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {taskTemplateIsLoading ? (
                <li>Loading...</li>
              ) : (
                <>
                  <li className="w-full flex justify-between">
                    <span>Task Templates: </span>
                    <span className="text-primary">{taskTemplateData.totalCount}</span>
                  </li>
                  <li className="w-full flex justify-between">
                    <span>Used Task Templates: </span>
                    <span className="text-primary">{taskTemplateData.usedCount}</span>
                  </li>
                  <li className="w-full flex justify-between">
                    <span>Task instances today: </span>
                    <span className="text-primary">{taskTemplateData.instancesToday}</span>
                  </li>
                  <li className="w-full flex justify-between">
                    <span>Upcoming Task instances: </span>
                    <span className="text-primary">{taskTemplateData.instancesNext7Days}</span>
                  </li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Progress of tasks</CardTitle>
            <CardDescription>Tasks this week</CardDescription>
          </CardHeader>
          <CardContent>{!taskInstanceStatusesLoading && <Progress value={percentage} />}</CardContent>
        </Card>
      </div>

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

export default TasksAdmin;
