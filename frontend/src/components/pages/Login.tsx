import { User, useUserStore } from '@/store/user.ts';
import { useMutation } from 'react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigate } from 'react-router-dom';
import Logo from '@/assets/chira_logo.svg';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form.tsx';

interface LoginForm {
  email: string;
  password: string;
}

const loginFormSchema: z.ZodType<LoginForm> = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function Login() {
  const userStore = useUserStore();

  const mutation = useMutation('user', {
    mutationFn: async (formData: LoginForm) => {
      const response = await fetch(`/api/auth/login`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorBody = await response.json(); // Assuming the server returns JSON with error details

        console.log(errorBody);
        throw new Error(errorBody.message || 'Failed to login');
      }

      return response.json();
    },
    onError: (error, variables) => {
      form.setError('root.serverError', { type: '404' });
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
      email: '',
      password: '',
    },
  });

  const onSubmit = (formData: LoginForm) => mutation.mutate(formData);

  if (userStore.user.loggedIn) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-[calc(100vh-64px)]  ">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">Enter your email below to login to your account</p>
          </div>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" type="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="password" type="password" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-primary">
        <h1 className="text-6xl text-black font-bold">Work Bee</h1>
        <img src={Logo} alt="Workbee logo" className="w-80 h-80" />
      </div>
    </div>
  );
}

export default Login;
