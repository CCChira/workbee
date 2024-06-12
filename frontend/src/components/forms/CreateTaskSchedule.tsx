import { useForm } from 'react-hook-form';
import { useCreateTaskSchedule, TaskSchedule } from '@/queries/createTaskSchedule.ts';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar.tsx';
import { cn } from '@/lib/utils.ts';
import { Input } from '@/components/ui/input.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Button } from '../ui/button';
import { toast } from '@/components/ui/use-toast.ts';
import { useGetTaskTemplates } from '@/queries/taskTemplatesDetails.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { useCallback, useEffect, useState } from 'react';
import { data } from 'autoprefixer';
import { getRoomByLocationId, useGetLocationsByContract, useGetRoomsByLocation } from '@/queries/locationDetails.ts';
import { useQuery } from 'react-query';
import { debounce } from 'lodash';

// Define the Zod schema based on the TaskSchedule interface
// Type for the form based on the schema

const daysOfWeek = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
];
const weeksOfMonth = [
  { id: 0, name: 'Week 1' },
  { id: 1, name: 'Week 2' },
  { id: 2, name: 'Week 3' },
  { id: 3, name: 'Week 4' },
];

export const CreateTaskScheduleForm = () => {
  const [selectedTaskTemplate, setSelectedTaskTemplate] = useState('');
  const [locationId, setLocationId] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const { mutate } = useCreateTaskSchedule();
  const { data: locations, isLoading: isLocationsLoading } = useGetLocationsByContract('105');
  const {
    data: rooms,
    isLoading: isRoomsLoading,
    refetch: refetchRooms,
  } = useQuery('roomz', () => getRoomByLocationId(locationId), {
    enabled: !!locationId,
    cacheTime: 0,
  });
  const { data: taskTemplates, isLoading: isTaskTemplatesLoading } = useGetTaskTemplates(
    {
      page: 1,
      size: 100,
      sortOrder: { property: 'title', direction: 'asc' },
    },
    '105',
  );
  const form = useForm<TaskSchedule>({
    defaultValues: {
      taskTemplateId: 0,
      description: '',
      dayOfWeek: [],
      frequency: [],
      isActive: true,
      roomId: 0,
      userId: '',
      startDate: '',
      endDate: '',
      locationId: 0,
      hour: '12:00PM',
    },
  });

  const onSubmit = async (data: TaskSchedule) => {
    try {
      await mutate(data);
      toast({ title: 'Task Schedule created successfully!' });
    } catch (error) {
      toast({ title: 'Error creating task schedule', description: error.message });
    }
  };

  const onChange = useCallback(
    debounce((value: string) => {
      const location = locations.find((location) => location.id === parseInt(value));
      setSelectedLocation(location.name);
      setLocationId(value);
    }),
    [locations],
  );
  const onRoomChange = useCallback(
    debounce((value: string) => {
      if (rooms) {
        const room = rooms.data.find((room) => room.id === parseInt(value));
        setSelectedRoom(room.name);
      }
    }),
    [rooms],
  );
  const onTaskTemplateChange = useCallback(
    debounce((value: string) => {
      if (rooms) {
        const taskTempalte = taskTemplates.data.find((room) => room.id === parseInt(value));
        setSelectedTaskTemplate(taskTempalte.title);
      }
    }),
    [taskTemplates],
  );
  useEffect(() => {
    refetchRooms();
  }, [locationId, refetchRooms]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <Select
          onValueChange={(value) => {
            onChange(value);
          }}
          defaultValue={0}
        >
          <FormLabel>Location</FormLabel>
          <SelectTrigger>
            <SelectValue placeholder="Select a location">{selectedLocation}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {!isLocationsLoading &&
              locations &&
              locations.map((location) => (
                <SelectItem value={location.id} key={location.id}>
                  {location.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <FormField
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rooms</FormLabel>
              <Select
                onValueChange={(value) => {
                  form.setValue('roomId', parseInt(value));
                  onRoomChange(value);
                  return field.onChange;
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room">{selectedRoom}</SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!isRoomsLoading &&
                    rooms &&
                    rooms.data.map((room) => (
                      <SelectItem value={room.id} key={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="taskTemplateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Template</FormLabel>
              <Select
                onValueChange={(value) => {
                  form.setValue('taskTemplateId', parseInt(value));
                  onTaskTemplateChange(value);
                  return field.onChange;
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a task template">{selectedTaskTemplate}</SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!isTaskTemplatesLoading &&
                    taskTemplates &&
                    taskTemplates.data.map((taskTemplate) => (
                      <SelectItem value={taskTemplate.id} key={taskTemplate.id}>
                        {taskTemplate.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dayOfWeek"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>Select the items you want to display in the sidebar.</FormDescription>
              </div>
              {daysOfWeek.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="dayOfWeek"
                  render={({ field }) => {
                    return (
                      <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(field.value?.filter((value) => value !== item.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item.name}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="frequency"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>Select the items you want to display in the sidebar.</FormDescription>
              </div>
              {weeksOfMonth.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="frequency"
                  render={({ field }) => {
                    return (
                      <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(field.value?.filter((value) => value !== item.id));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item.name}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="hour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input type={'time'} placeholder="hour" {...field} className="bg-primary" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <FormField
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <Button type="submit">Create new Task Schedule</Button>
      </form>
    </Form>
  );
};

export default CreateTaskScheduleForm;
