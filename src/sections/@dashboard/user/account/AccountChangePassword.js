import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
// axios
import axiosInstance from '../../../../utils/axios';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    current_password: Yup.string().required('Old Password is required'),
    new_password: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
    confirm_password: Yup.string().oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
  });

  const defaultValues = {
    current_password: '',
    new_password: '',
    confirm_password: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await axiosInstance.post("/market/users/change_password/", {
        ...getValues()
      })
      reset();
      enqueueSnackbar('Update success!');
    } catch (error) {
      enqueueSnackbar("Update Failed", {variant: "error"});
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="current_password" type="password" label="Old Password" />

          <RHFTextField name="new_password" type="password" label="New Password" />

          <RHFTextField name="confirm_password" type="password" label="Confirm New Password" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
