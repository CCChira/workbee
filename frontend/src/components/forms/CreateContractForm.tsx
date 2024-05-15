import { useCreateContractFormStore } from '@/store/createContractFormStore.ts';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form.tsx';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { Button } from '@/components/ui/button.tsx';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar.tsx';
import { cn } from '@/lib/utils.ts';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { useMutation } from 'react-query';
import { createContract } from '@/queries/createContract.ts';
import { useParams } from 'react-router-dom';

interface CreateContractFormProps {
  onSuccess: (contractId: string) => void;
  lockFields?: boolean;
}

const createContractFormSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(1000),
  startDate: z.date(),
  endDate: z.date(),
});

function CreateContractForm({ onSuccess, lockFields }: CreateContractFormProps) {
  const { clientId } = useParams();
  const createContractState = useCreateContractFormStore();
  const form = useForm<z.infer<typeof createContractFormSchema>>({
    resolver: zodResolver(createContractFormSchema),
    defaultValues: {
      title: createContractState.title,
      description: createContractState.description,
      startDate: createContractState.startDate,
      endDate: createContractState.endDate,
    },
  });
  const mutation = useMutation('contract', {
    mutationFn: createContract,
    onSuccess: (response) => onSuccess(response.id),
  });
  const onSubmit = (formData: z.infer<typeof createContractFormSchema>) => {
    mutation.mutate({ ...formData, clientId: clientId as unknown as string });
  };
  const onChange = useCallback(
    debounce((formData: z.infer<typeof createContractFormSchema>) => {
      createContractState.setDescription(formData.description);
      createContractState.setTitle(formData.title);
      createContractState.setStartDate(formData.startDate);
      createContractState.setEndDate(formData.endDate);
    }, 2000),
    [],
  );
  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={form.handleSubmit(onChange)}
          className="flex flex-col gap-8"
        >
          <FormField
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title" {...field} disabled={lockFields} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="description" {...field} disabled={lockFields} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={lockFields}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={lockFields}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={lockFields}>
            Create new Contract!
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateContractForm;
