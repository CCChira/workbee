import { useMutation } from 'react-query';
import { useUserStore } from '@/store/user.ts';

export interface TaskSchedule {
  taskTemplateId: number;
  description: string;
  dayOfWeek: number[];
  frequency: number[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  roomId: number;
  userId: string;
  locationId: number;
  hour: string;
}
export const useCreateTaskSchedule = () => {
  return useMutation(async (taskScheduleData: TaskSchedule) => {
    const { user } = useUserStore.getState();
    taskScheduleData.userId = user.id;
    const response = await fetch('/api/taskschedules', {
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
