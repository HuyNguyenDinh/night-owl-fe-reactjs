import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, OutlinedInput, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hook
import useAuth from '../../../hooks/useAuth';
// utils
import axiosInstance from '../../../utils/axios';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function VerifyCodeForm() {

  const { pathname } = useLocation();

  const isKYC = pathname.includes("kyc");
  const isPhone = pathname.includes("phone");

  const navigate = useNavigate();

  const { loginWithToken, setUser } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required('Code is required'),
    code2: Yup.string().required('Code is required'),
    code3: Yup.string().required('Code is required'),
    code4: Yup.string().required('Code is required'),
    // code5: Yup.string().required('Code is required'),
    // code6: Yup.string().required('Code is required'),
  });

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    // code5: '',
    // code6: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    const target = document.querySelector('input.field-code');

    target?.addEventListener('paste', handlePaste);

    return () => {
      target?.removeEventListener('paste', handlePaste);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaste = (event) => {
    let data = event.clipboardData.getData('text');

    data = data.split('');

    [].forEach.call(document.querySelectorAll('.field-code'), (node, index) => {
      node.value = data[index];

      const fieldIndex = `code${index + 1}`;

      setValue(fieldIndex, data[index]);
    });

    event.preventDefault();
  };

  const handleChangeWithNextField = (event, handleChange) => {
    const { maxLength, value, name } = event.target;

    const fieldIndex = name.replace('code', '');

    const fieldIntIndex = Number(fieldIndex);

    if (value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);

        if (nextfield !== null) {
          nextfield.focus();
        }
      }
    }

    handleChange(event);
  };

  const onSubmit = async (data) => {
    try {
      const code = Object.values(data).join('');
      if (isKYC) {
        let url = "/market/users"
        if (isPhone) {
          url = url.concat("/check-verified-code-to-phone-number/");
        }
        else {
          url = url.concat("/check-verified-code-to-email/");
        }
        await axiosInstance.post(url, {
          code
        });
        enqueueSnackbar("Verify success");
        const response =await axiosInstance.get("/market/users/current-user/");
        setUser(response.data);
        navigate(PATH_DASHBOARD.user.account.concat("?tab=verify"));
      }
      else {
        const email = sessionStorage.getItem('email-recovery');
        const resp = await axiosInstance.post("/market/users/get-token-by-email-and-reset-code/", {
          email,
          code
        })
        const { access, refresh } = resp.data;
  
        await loginWithToken(access, refresh);
  
        enqueueSnackbar('Verify success!');
  
        navigate(PATH_AUTH.newPassword, { replace: true });
      }
    }
    catch (error) {
      enqueueSnackbar('Failed to verify, please check your reset code!', {variant: "error"});
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} justifyContent="center">
          {Object.keys(values).map((name, index) => (
            <Controller
              key={name}
              name={`code${index + 1}`}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <OutlinedInput
                  {...field}
                  error={!!error}
                  autoFocus={index === 0}
                  placeholder="-"
                  onChange={(event) => handleChangeWithNextField(event, field.onChange)}
                  inputProps={{
                    className: 'field-code',
                    maxLength: 1,
                    sx: {
                      p: 0,
                      textAlign: 'center',
                      width: { xs: 36, sm: 56 },
                      height: { xs: 36, sm: 56 },
                    },
                  }}
                />
              )}
            />
          ))}
        </Stack>

        {(!!errors.code1 || !!errors.code2 || !!errors.code3 || !!errors.code4 || !!errors.code5 || !!errors.code6) && (
          <FormHelperText error sx={{ px: 2 }}>
            Code is required
          </FormHelperText>
        )}

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ mt: 3 }}>
          Verify
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
