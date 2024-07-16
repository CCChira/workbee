import { User, useUserStore } from '../store/userStore.ts';
import { useMutation } from 'react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {Navigate, useNavigate} from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../components/ui/form.tsx';
import {loginEmployee} from "../queries.ts";

interface LoginForm {
  code: string;
}

const loginFormSchema: z.ZodType<LoginForm> = z.object({
  code: z.string().min(6, "Verification code must be at least 6 characters"), // Adjust length as needed
});

function Login() {
  const userStore = useUserStore();
  const navigate = useNavigate();
  const mutation = useMutation('user', {
    mutationFn: loginEmployee,
    onError: (error, variables) => {
      form.setError('root.serverError', { type: 'error', message: error.message });
      console.log('Error:', error);
      console.log('Variables:', variables);
    },
    onSuccess: (data: Omit<User, 'loggedIn'>) => {
      userStore.setUser({
        ...data,
        loggedIn: true,
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = (formData: LoginForm) => mutation.mutate(formData);

  if (userStore.user.loggedIn) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Enter Your Verification Code</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter code" type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Login;
