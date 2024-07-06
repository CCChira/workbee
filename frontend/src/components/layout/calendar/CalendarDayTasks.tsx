import { CalendarTaskInstance } from '@/queries/taskInstanceThisMonth.ts';
import React, { useCallback, useEffect, useState } from 'react';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useQueryClient } from 'react-query';
import { PlusIcon, XIcon } from 'lucide-react';
import { debounce } from 'lodash';

import { useAssignUserToTask, useGetEmployeesForTasks, useRemoveUserFromTask } from '@/queries/assignUserToTask.ts';
import { Input } from '@/components/ui/input.tsx';

type CalendarDayTasksProps = {
  date: Date;
  contractId?: string;
  roomId?: string;
  userId?: string;
  tasks: CalendarTaskInstance[];
  qKey: string;
};
export default function CalendarDayTasks({ tasks, date, qKey, contractId, roomId, userId }: CalendarDayTasksProps) {
  const [selectedTask, setSelectedTask] = useState(tasks[0].id);
  const [selectedTaskName, setSelectedTaskName] = useState(tasks[0].taskSchedule.taskTemplate.title);
  const [searchEmployee, setSearchEmployee] = useState('');
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  useEffect(() => {}, []);
  const usersAssigned = tasks.reduce(
    (
      acc: Record<
        number,
        Record<
          string,
          {
            id: string;
            email: string;
            phoneNumber: string;
            name: string;
          }
        >
      >,
      cur,
    ) => {
      acc[cur.id] = cur.TaskAssignment
        ? cur.TaskAssignment.reduce(
            (
              userAcc: Record<
                string,
                {
                  id: string;
                  email: string;
                  phoneNumber: string;
                  name: string;
                }
              >,
              ass,
            ) => {
              userAcc[ass.user.id] = {
                id: ass.user.id,
                email: ass.user.email,
                phoneNumber: ass.user.phoneNumber,
                name: ass.user.name,
              };
              return userAcc;
            },
            {},
          )
        : {};
      return acc;
    },
    {},
  );

  const onSearch = useCallback(
    debounce((data: { searchName: string }) => {
      setSearchEmployee(data.searchName);
    }, 300),
    [],
  );
  const { refetch, data: employeeData, error, isLoading } = useGetEmployeesForTasks(searchEmployee);
  const { mutate, data, error: assignError, isLoading: isLoadingAssign } = useAssignUserToTask();
  const { mutate: unassignUserFromTask, isLoading: isLoadingUnassign, data: unassignData } = useRemoveUserFromTask();
  const [isFocused, setIsFocused] = React.useState(false);
  const handleChange = useCallback(
    debounce((event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchEmployee(event.target.value);
    }, 300),
    [],
  );

  // Focus management
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };
  useEffect(() => {
    (async () => {
      if ((data || unassignData) && !isLoadingUnassign && !isLoadingUnassign) {
        await queryClient.invalidateQueries();
        await queryClient.refetchQueries();
      }
    })();
  }, [isLoadingAssign, isLoadingUnassign, data, unassignData, queryClient]);
  return (
    <div className="h-[500px] space-x-2 ">
      <DialogHeader>
        <DialogTitle>Tasks on {`${format(date, 'd')} ${format(date, 'MMMM')}, ${format(date, 'yyyy')}`}</DialogTitle>
        <DialogDescription>
          Your assigned tasks for {`${format(date, 'd')} ${format(date, 'MMMM')}, ${format(date, 'yyyy')}`}. Click on a
          task to view and assign/unassign its employees
        </DialogDescription>
      </DialogHeader>

      <div className="flex gap-4 space-x-2 py-3 w-full min-h-[200px]">
        <Card className="w-1/2 flex flex-col justify-start ">
          <CardHeader>
            <CardTitle>Scheduled tasks</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <Separator />
            <div className="w-full flex flex-col justify-start items-center">
              {tasks.map((task, index) => {
                return (
                  <React.Fragment key={`${task.id}${task.taskSchedule.endDate}`}>
                    {index !== 0 && <Separator className="opacity-50" />}
                    <div
                      id={`${task.id}${task.taskSchedule.endDate}`}
                      onClick={() => {
                        setSelectedTask(task.id);
                        setSelectedTaskName(task.taskSchedule.taskTemplate.title);
                      }}
                      className="w-full p-2 hover:bg-muted transition ease-in-out duration-200 cursor-pointer"
                    >
                      <span className="font-medium">{`${task.hour}: `}</span>
                      {`${task.taskSchedule.taskTemplate.title}`}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Separator orientation="vertical" />
        <Card className="flex-col gap-4 justify-start items-center flex-wrap w-1/2 h-fit">
          <CardHeader>
            <CardTitle>Assigned Users for {selectedTaskName}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Separator className="mb-2" />
            <div className="flex flex-wrap gap-2 items-center">
              {Object.values(usersAssigned[selectedTask]).map((user) => {
                return (
                  <div className="flex" key={`${user.id}`} id={`${user.id}`}>
                    <Badge className="bg-primary px-2 py-2 rounded-full rounded-r-none whitespace-nowrap text-white cursor-default transition-color hover:bg-primary">
                      {user.name}
                    </Badge>
                    <div
                      className="p-1 bg-destructive text-accent font-medium rounded-r-full cursor-pointer hover:bg-foreground transition-colors"
                      onClick={() => {
                        unassignUserFromTask({ userId: user.id, taskId: selectedTask.toString() });
                      }}
                    >
                      <XIcon className="p-0.5 rounded-r-full mr-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="relative">
              <Input
                placeholder="Assign more users to task"
                onChange={(event) => {
                  console.log(event.target.value);
                  handleChange(event);
                }}
                onFocus={(event) => handleFocus(event)}
                onBlur={(event) => handleBlur(event)}
                autoFocus={false}
                className="relative"
              />
              <div className="absolute w-full">
                {isFocused && (
                  <div className="w-full bg-accent shadow-xl mt-1 max-h-60 overflow-auto rounded-md">
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : error ? (
                      <div>Error: {error.message}</div>
                    ) : (
                      <ul>
                        {employeeData && employeeData.data.length > 0 ? (
                          employeeData.data.map((user) => {
                            if (!usersAssigned[selectedTask][user.id])
                              return (
                                <li
                                  key={user.id}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onMouseDown={async () => {
                                    mutate({ userId: user.id, taskId: selectedTask.toString() });
                                  }}
                                >
                                  {user.name}
                                </li>
                              );
                          })
                        ) : (
                          <li className="p-2">No users</li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
