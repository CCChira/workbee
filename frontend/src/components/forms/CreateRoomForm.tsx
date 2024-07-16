import React, { useState, useCallback } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from '@/components/ui/use-toast.ts';
import { queryClient } from '@/main.tsx';

interface CreateRoomFormProps {
  onSuccess: (roomId: string) => void;
  lockFields?: boolean;
  locationId: number;
}

const createRoomFormSchema = z.object({
  name: z.string().min(3).max(100, 'Name should be between 3 and 100 characters.'),
  locationId: z.coerce.number().positive('Location ID must be positive.'),
  accessMode: z.enum(['STAIRS', 'PUBLIC', 'RESTRICTED']),
});

function CreateRoomForm({ onSuccess, lockFields, locationId }: CreateRoomFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof createRoomFormSchema>>({
    resolver: zodResolver(createRoomFormSchema),
    defaultValues: {
      name: '',
      locationId: locationId,
      accessMode: 'STAIRS',
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        console.log('Submitting form data to the server...');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`Failed to create room: ${response.statusText}`);
        }
        return response.json();
      } catch (error) {
        console.error('Error occurred during request:', error);
        throw error;
      }
    },
    onSuccess: (response) => {
      toast({
        title: 'Room created',
        description: 'Room was created successfully. You can now create schedules for it',
      });
      queryClient.invalidateQueries('rooms' + locationId);
      queryClient.refetchQueries('rooms' + locationId);
      onSuccess(response.id);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });

  const onSubmit = (formData: z.infer<typeof createRoomFormSchema>) => {
    console.log('Form data:', formData);

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('locationId', formData.locationId);
    formPayload.append('accessMode', formData.accessMode);

    selectedFiles.forEach((file) => {
      formPayload.append('imageFiles', file);
    });

    mutation.mutate(formPayload);
  };

  const onFilesChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
      console.log('Files selected:', event.target.files);
    }
  }, []);

  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="accessMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Mode</FormLabel>
                <FormControl>
                  <Input placeholder="Access Mode" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Image Files</FormLabel>
            <FormControl>
              <input type="file" multiple onChange={onFilesChange} />
            </FormControl>
          </FormItem>

          <Button type="submit" disabled={lockFields || mutation.isSuccess || mutation.isLoading}>
            Create new Room!
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default CreateRoomForm;
