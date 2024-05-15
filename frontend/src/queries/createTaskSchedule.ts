import { useMutation } from 'react-query';

export interface TaskSchedule {
  taskTemplateId: number;
  description: string;
  dayOfWeek: number[];
  frequency: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  roomId: number;
  userId: string;
}
export const useCreateTaskSchedule = () => {
  return useMutation(async (taskScheduleData: TaskSchedule) => {
    const response = await fetch('/api/task-schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
      },
      body: JSON.stringify(taskScheduleData),
    });
    if (!response.ok) {
      throw new Error('Failed to create task schedule');
    }
    return response.json();
  });
};
