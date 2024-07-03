import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UpdateLocationType, useUpdateLocation } from '@/queries/updateLocation.ts';

interface UpdateLocationFormProps {
  locationId: number;
  onSuccess: () => void;
  lockFields?: boolean;
}

const updateLocationSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const UpdateLocationForm: React.FC<UpdateLocationFormProps> = ({ locationId, onSuccess, lockFields }) => {
  const form = useForm<UpdateLocationType>({
    resolver: zodResolver(updateLocationSchema),
    defaultValues: {
      name: '',
      address: '',
      latitude: undefined,
      longitude: undefined,
    },
  });

  const mutation = useUpdateLocation();

  const onSubmit = (formData: UpdateLocationType) => {
    mutation.mutate(
      { id: locationId, data: formData },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} disabled={lockFields} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} disabled={lockFields} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="latitude"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input placeholder="Latitude" {...field} disabled={lockFields} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="longitude"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input placeholder="Longitude" {...field} disabled={lockFields} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={lockFields}>
            Update Location
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateLocationForm;
