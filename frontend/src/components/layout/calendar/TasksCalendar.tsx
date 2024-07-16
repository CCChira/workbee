import { CalendarTaskInstanceResponse, fetchTaskInstancesThisMonth } from '@/queries/taskInstanceThisMonth.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as date from 'date-fns';
import { daysBeforeStart, getArrayOfDays } from '@/lib/utils.ts';
import { EmptyDayGenerator } from '@/components/layout/calendar/EmptyDayGenerator.tsx';
import { format, parse } from 'date-fns';
import { useQuery } from 'react-query';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Calendar } from '@/components/ui/calendar.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.tsx';
import CalendarDayTasks from '@/components/layout/calendar/CalendarDayTasks.tsx';
import React from 'react';
import { colors, hovers } from '@/utils/taskStatusCell.ts';
type DateState = {
  month: string;
  year: string;
};
type TaskCalendarProps = {
  dateState?: DateState;
  queryFn?: (
    date: DateState,
    contractId?: string,
    roomId?: string,
    locationId?: string,
    userId?: string,
  ) => CalendarTaskInstanceResponse;
  queryKey?: string;
  contractId?: string;
  roomId?: string;
  enableTaskInstanceCreation?: boolean;
  locationId?: string;
  userId?: string;
};
export default function TasksCalendar({
  dateState,
  queryFn,
  queryKey,
  enableTaskInstanceCreation,
  contractId,
  roomId,
  locationId,
  userId,
}: TaskCalendarProps) {
  const colors = {
    PENDING: 'bg-secondary text-black',
    IN_PROGRESS: 'bg-primary',
    REDO: 'bg-destructive',
    COMPLETED: 'bg-green-500',
    INCOMPLETE: 'bg-destructive',
    UNASSIGNED: 'bg-muted-foreground',
  };
  const hovers = {
    PENDING: 'hover:bg-secondary text-black',
    IN_PROGRESS: 'hover:bg-primary hover:text-white',
    REDO: 'hover:bg-destructive hover:text-white',
    COMPLETED: 'hover:bg-green-500 hover:text-white',
    INCOMPLETE: 'hover:bg-destructive hover:text-white',
    UNASSIGNED: 'hover:bg-muted-foreground hover:text-white',
  };

  const [ownDate, setOwnDate] = useState<DateState>({
    month: date.format(new Date(), 'MMMM'),
    year: date.getYear(new Date()).toString(),
  });
  useEffect(() => {
    if (dateState) {
      setOwnDate(dateState);
    }
  }, [dateState]);
  const qKey = queryKey ? `${queryKey}${ownDate.month}${ownDate.year}` : 'taskInstancesThisMonth';

  const { data, isLoading } = useQuery<CalendarTaskInstanceResponse>(
    qKey,
    queryFn
      ? () => queryFn(ownDate, contractId, roomId, locationId, userId)
      : () => fetchTaskInstancesThisMonth(contractId ?? '', roomId ?? '', locationId ?? ''),
    {
      cacheTime: 0,
    },
  );
  useEffect(() => {
    console.log(data);
  }, [data, isLoading]);
  const thisMonth = ownDate.month;
  const thisYear = ownDate.year;
  const formattedDate = useMemo(() => {
    return parse(`${ownDate.year}-${ownDate.month}`, 'yyyy-MMMM', new Date());
  }, [ownDate]);
  const startsOn = date.format(formattedDate, 'eee');
  const incrementMonth = () => {
    const formattedDate = parse(`${ownDate.year}-${ownDate.month}`, 'yyyy-MMMM', new Date());
    const newDate = date.addMonths(formattedDate, 1);
    setOwnDate({ month: date.format(newDate, 'MMMM'), year: date.getYear(newDate).toString() });
  };
  const decrementMonth = () => {
    const formattedDate = parse(`${ownDate.year}-${ownDate.month}`, 'yyyy-MMMM', new Date());
    const newDate = date.subMonths(formattedDate, 1);
    setOwnDate({ month: date.format(newDate, 'MMMM'), year: date.getYear(newDate).toString() });
  };
  const passSelectedDateAndYear = useCallback(
    (dateToChangeTo: Date | undefined) => {
      if (dateToChangeTo) {
        const month = date.format(dateToChangeTo, 'MMMM');
        const year = date.getYear(dateToChangeTo).toString();
        setOwnDate({ month, year });
      }
    },
    [setOwnDate],
  );

  return (
    <div className="text-gray-700">
      <div className="flex flex-grow w-full h-[calc(100vh/1.5)] overflow-auto">
        <div className="flex flex-col flex-grow">
          <div className="flex items-center mt-4">
            <div className="flex ml-6 mr-6 gap-3">
              <button
                onClick={decrementMonth}
                className="hover:bg-primary hover:text-white transition-colors rounded-md p-1"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={incrementMonth}
                className="hover:bg-primary hover:text-white transition-colors rounded-md p-1"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="hover:bg-primary hover:text-accent p-2 rounded-md flex items-center justify-center cursor-pointer">
                  <CalendarIcon />
                  <h2 className="ml-2 text-xl font-bold leading-none">{`${thisMonth}, ${thisYear}`}</h2>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  onSelect={(date) => passSelectedDateAndYear(date)}
                  selected={formattedDate}
                  captionLayout="dropdown-buttons"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-7 mt-4">
            <div className="pl-1 text-sm font-medium">Mon</div>
            <div className="pl-1 text-sm font-medium">Tue</div>
            <div className="pl-1 text-sm font-medium">Wed</div>
            <div className="pl-1 text-sm font-medium">Thu</div>
            <div className="pl-1 text-sm font-medium">Fri</div>
            <div className="pl-1 text-sm font-medium">Sat</div>
            <div className="pl-1 text-sm font-medium">Sun</div>
          </div>
          <>
            {data && !isLoading && (
              <div className="grid flex-grow w-full h-auto grid-cols-7 grid-rows-5 gap-px pt-px mt-1 bg-gray-200">
                <EmptyDayGenerator numDivs={daysBeforeStart[startsOn as keyof typeof daysBeforeStart]} />
                {getArrayOfDays(thisMonth).map((day) => {
                  return (
                    <React.Fragment key={`${day}}`}>
                      {data[day] && data[day].length > 0 ? (
                        <div className="relative flex flex-col bg-white group">
                          <span className="mx-2 my-1 text-xs font-bold">{day}</span>
                          <Dialog>
                            <DialogTrigger className="w-full h-full">
                              <div className="h-full relative flex flex-col bg-white group overflow-auto">
                                {data[day] &&
                                  data[day].map((task) => {
                                    return (
                                      <button
                                        className={`
                                          flex items-center flex-shrink-0 h-5 px-1 text-xs  ${hovers[task.status as keyof typeof hovers]} transition-colors
                                        `}
                                        key={`${day}${task.taskScheduleId}`}
                                        id={`${day}${task.taskScheduleId}`}
                                      >
                                        <span
                                          className={`flex-shrink-0 w-2 h-2 rounded-full ${colors[task.status as keyof typeof colors]}`}
                                        ></span>
                                        <span className="ml-2 font-light leading-none">{task.hour}</span>
                                        <span className="ml-2 font-medium leading-none truncate">
                                          {task.taskSchedule.taskTemplate.title}
                                        </span>
                                      </button>
                                    );
                                  })}
                                {enableTaskInstanceCreation && (
                                  <Dialog>
                                    <DialogTrigger onClick={(event) => event.stopPropagation()}>
                                      <div className="absolute bottom-0 right-0 flex items-center justify-center hidden w-6 h-6 mb-2 mr-2 text-white bg-gray-400 rounded group-hover:flex hover:bg-gray-500">
                                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                          <path
                                            fillRule="evenodd"
                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                            clipRule="evenodd"
                                          ></path>
                                        </svg>
                                      </div>
                                    </DialogTrigger>
                                    <DialogContent>putsa</DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-none w-[1200px]">
                              <CalendarDayTasks date={formattedDate} tasks={data[day]} qKey={qKey} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      ) : (
                        <div
                          className="relative flex flex-col bg-white group"
                          key={`${day}${data[day]}`}
                          id={`${day}${data[day]}`}
                        >
                          <span className="mx-2 my-1 text-xs font-bold">{day}</span>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
