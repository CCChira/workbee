import TasksCalendar from '@/components/layout/calendar/TasksCalendar.tsx';
import { fetchTaskInstancesByMonthYear } from '@/queries/taskInstanceThisMonth.ts';
import TasksCalendar2 from '@/components/layout/calendar/TasksCalendar2.tsx';

export default function Calendar() {
  return <TasksCalendar2 queryFn={fetchTaskInstancesByMonthYear} queryKey="calendar" />;
}
