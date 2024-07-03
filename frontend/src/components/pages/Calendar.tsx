import TasksCalendar from '@/components/layout/calendar/TasksCalendar.tsx';
import { fetchTaskInstancesByMonthYear } from '@/queries/taskInstanceThisMonth.ts';

export default function Calendar() {
  return <TasksCalendar queryFn={fetchTaskInstancesByMonthYear} queryKey="idkPulaMea" />;
}
