import { User, useUserStore } from '@/store/user.ts';
import { useMutation, useQuery } from 'react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigate } from 'react-router-dom';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form.tsx';

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

  const mutation = useMutation('user', async (formData: LoginForm) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(formData),
    });
    const user = await response.json();
    userStore.setUser({ ...user, loggedIn: true });
    return user;
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
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
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
                      <FormControl>
                        <Input placeholder="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="password" {...field} />
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
      {/*<div className="hidden bg-muted lg:block">*/}
      {/*  <img*/}
      {/*    src="/placeholder.svg"*/}
      {/*    alt="Image"*/}
      {/*    width="1920"*/}
      {/*    height="1080"*/}
      {/*    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"*/}
      {/*  />*/}
      {/*</div>*/}
    </div>
  );
}

export default Login;
