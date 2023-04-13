import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import axiosInstance from '../../../utils/axios';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: 'demo@minimals.cc' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      sessionStorage.setItem('email-recovery', data.email);
      await axiosInstance.post("/market/users/get-reset-code-by-email/", data);

      // navigate(PATH_AUTH.newPassword);
      enqueueSnackbar("Reset code had been sent to your email");
      // navigate(PATH_AUTH.verify.concat(`?email=${data.email}`));
      navigate(PATH_AUTH.verify);
    } catch (error) {
      enqueueSnackbar("Something wrong when sending reset code", {variant: "error"});
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Send Request
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
