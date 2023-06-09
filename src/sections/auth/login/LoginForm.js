import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// Google OAuth
import { GoogleLogin } from '@react-oauth/google';
// utils
import axiosInstance from '../../../utils/axios';
import {setSession} from '../../../utils/jwt'
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login, setUser } = useAuth();

  const navigate = useNavigate();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: 'nightowl.usernormal.1@gmail.com',
    password: '0937461321Huy@',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error(error);

      reset();

      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message || error.detail });
      }
    }
  };

  const responseMessage = (response) => {
    const loginWithGoogle = async () => {
      try {
        const resp = await axiosInstance.post("/market/users/login-with-google/", {
          "id_token": response.credential
        });
        if (resp.status === 203) {
          navigate(PATH_AUTH.register.concat(`?email=${resp.data?.email}&firstName=${resp.data?.first_name}&lastName=${resp.data?.last_name}`));
        }
        else if (resp.status === 200) {
          const {access, refresh} = resp.data;
          setSession(access, refresh);
          const currentUserResp = await axiosInstance.get("/market/users/current-user/");
          setUser(currentUserResp.data);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    loginWithGoogle();
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
      <Stack sx={{p: 2}} direction="row" justifyContent="center">
        <Button>
          <GoogleLogin  onSuccess={responseMessage} onError={errorMessage} text='signin' shape='pill' theme='outlined' />
        </Button>
      </Stack>
    </FormProvider>
  );
}
