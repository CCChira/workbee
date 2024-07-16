import { useQuery } from 'react-query';

export type CalendarTaskInstance = {
  date: string;
  hour: string;
  id: number;
  roomId: number;
  status: string;
  taskScheduleId: number;
  taskSchedule: {
    id: number;
    taskTemplateId: number;
    description: string;
    dayOfWeek: number[];
    frequency: number[];
    hour: string;
    endDate: string;
    startDate: string;
    taskTemplate: {
      id: number;
      title: string;
      necessaryWorkers: number;
      necessaryTools: string[];
      contractId: number;
    };
    taskScheduleId: number;
  };
  TaskAssignment: {
    user: {
      id: string;
      email: string;
      phoneNumber: string;
      name: string;
    };
  }[];
};
type DateState = {
  month: string;
  year: string;
};
export type CalendarTaskInstanceResponse = Record<number, CalendarTaskInstance[]>;

export const fetchTaskInstancesThisMonth = async (contractId: string, roomId: string, locationId: string) => {
  const response = await fetch('/api/taskinstance/this-month', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
export const fetchTaskInstancesByMonthYear = async (
  date: DateState,
  contractId: string,
  roomId: string,
  locationId: string,
  userId: string,
) => {
  console.log(contractId);
  const response = await fetch(
    `/api/taskinstance/by-date-state?month=${date.month}&year=${date.year}&includeWorkers=true${contractId && `&contractId=${contractId}`}${roomId && `&roomId=${roomId}`}${locationId && `&locationId=${locationId}`}${userId && `&userId=${userId}`}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
export const useTaskInstancesThisMonth = () => {
  return useQuery('taskInstancesThisMonth', fetchTaskInstancesThisMonth);
};
