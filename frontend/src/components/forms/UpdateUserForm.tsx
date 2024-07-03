import { Role, UpdateUserType, useUpdateUser } from '@/queries/updateUser';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from 'react-query';

type UpdateUserFormProps = {
  onSuccess: (userId: string) => void;
  id: string;
  invalidate?: boolean;
};
const updateUserFormSchema = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  name: z.string().optional(),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(Role).optional(),
});
export default function UpdateUserForm({ onSuccess, id, invalidate }: UpdateUserFormProps) {
  const form = useForm<UpdateUserType>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      name: '',
      password: '',
      role: undefined,
    },
  });
  const queryClient = useQueryClient();
  const mutation = useUpdateUser();

  const onSubmit = (formData: UpdateUserType) => {
    mutation.mutate(
      { id: id as unknown as string, data: formData },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries('employees');
          queryClient.refetchQueries('employees');
          onSuccess(response.id);
        },
      },
    );
  };

  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone Number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="name"
            control={form.control}
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
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="role"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Role" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Update User</Button>
        </form>
      </Form>
    </div>
  );
}
