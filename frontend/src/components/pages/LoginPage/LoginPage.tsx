import { Box, styled, Typography, useTheme } from '@mui/material';
import Logo from '../../Logo.tsx';
import LoginForm from './LoginForm.tsx';

type LoginPageProps = {};

function LoginPage({}: LoginPageProps) {
  const theme = useTheme();
  const LoginHalf = styled(Box)({
    display: 'flex',
    height: '100%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  });
  const LoginBannerHalf = styled(LoginHalf)({});
  const LoginFormHalf = styled(LoginHalf)({
    width: '50%',
    padding: '100px 100px 100px 100px',
  });
  const LoginPageContainer = styled(Box)({
    height: '100%',
    width: '100%',
    display: 'flex',
  });
  return (
    <LoginPageContainer>
      <LoginBannerHalf>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100%',
            padding: '16px',
          }}
        >
          <Logo />
        </Box>
        <Typography
          color={theme.palette.grey[50]}
          variant="h1"
          sx={{ fontSize: '4rem' }}
        >
          WorkBee
        </Typography>
      </LoginBannerHalf>
      <LoginFormHalf>
        <LoginForm />
      </LoginFormHalf>
    </LoginPageContainer>
  );
}

export default LoginPage;
