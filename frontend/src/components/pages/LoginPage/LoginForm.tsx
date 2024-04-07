import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Paper, useTheme } from '@mui/material';
import { loginUser, useLoginUser } from '../../../queries/auth.ts';
import FormInputText from '../../form/FormInputText.tsx';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(100),
});
type LoginType = z.infer<typeof loginSchema>;

function LoginForm() {
  const theme = useTheme();
  const { mutate, isLoading, error, data } = useLoginUser();
  const onSubmit: SubmitHandler<LoginType> = (loginFormData) => {
    mutate(loginFormData);
  };
  const { control, handleSubmit } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper
          sx={{
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            padding: '50% 200px',
            gap: '2rem',
          }}
          elevation={10}
        >
          <FormInputText<LoginType>
            name="email"
            label="Email"
            control={control}
            variant="outlined"
          />
          <FormInputText<LoginType>
            name="password"
            label="Password"
            control={control}
            type="password"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="secondary">
            Submit
          </Button>
        </Paper>
      </form>
    </>
  );
}

export default LoginForm;
