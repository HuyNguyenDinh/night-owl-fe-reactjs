import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
import { countries } from '../../../../_mock';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const [provinces, setProvinces] = useState([]);

  const [districts, setDistricts] = useState([]);

  const [wards, setWards] = useState([]);

  const { user } = useAuth();

  const GHNAxiosInstance = axios.create({
    baseURL: "https://dev-online-gateway.ghn.vn",
  })
  GHNAxiosInstance.defaults.headers.Token = "8ae8d191-18b9-11ed-b136-06951b6b7f89";
  GHNAxiosInstance.defaults.headers.ShopId = 117552;

  const UpdateUserSchema = Yup.object().shape({
    // displayName: Yup.string().required('Name is required'),
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    email: Yup.string().required('email is required'),
    phone_number: Yup.string().required('Phone number is required'),
    street: Yup.string().required('street is required'),
    province_id: Yup.string().required('province is required'),
    district_id: Yup.string().required('district is required'),
    ward_id: Yup.string().required('ward is required'),
  });

  const defaultValues = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
    avatar: user?.avatar || '',
    phone_number: user?.phone_number || '',
    country: user?.address?.country || '',
    street: user?.address?.street || '',
    province_id: user?.address?.province_id || '',
    district_id: user?.address?.district_id || '',
    ward_id: user?.address?.ward_id || ''
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'photoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleResetAddress = (level, payload) => {
    switch(level){
      case "province": 
        setValue("province_id", payload);
        setValue("district_id", "");
        setDistricts([]);
        setValue("ward_id", "");
        setWards([]);
        setValue("address", "");
        break;
      case "district":
        setValue("district_id", payload);
        setValue("ward_id", "");
        setWards([]);
        setValue("address", "");
        break;
      case "ward":
        setValue("ward_id", payload);
        setValue("address", "");
        break;
      default:
        setValue("address", "");
        break;
    }
  }

  useEffect(() => {
    const getCountries = async () => {
      try {
        const responseProvinces = await GHNAxiosInstance.post("/shiip/public-api/master-data/province");
        setProvinces(responseProvinces.data.data);
      }
      catch (error) {
        console.log(error);
      }
    }
    getCountries();
    setDistricts([]);
    setValue("country", "VN");
    setValue("province_id", defaultValues.province_id || "");
    setValue("district_id", defaultValues.district_id || "");
    setValue("ward_id", defaultValues.ward_id || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (values.province_id) {
      const getDistricts = async () => {
        try {
          const responseDistricts = await GHNAxiosInstance.post(
            "/shiip/public-api/master-data/district",
            {
              province_id: Number(values.province_id)
            }
          );
          setDistricts(responseDistricts.data.data);
        }
        catch (error) {
          console.log(error);
        }
      }
      getDistricts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.province_id]);

  useEffect(() => {
    if (values.district_id) {
      const getWards = async () => {
        try {
          const responseWards = await GHNAxiosInstance.post(
            "/shiip/public-api/master-data/ward?district_id",
            {
              district_id: Number(values.district_id)
            }
          );
          setWards(responseWards.data.data);
        }
        catch (error) {
          console.log(error);
        }
      }
      getWards();
    }  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.district_id])

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            {/* <RHFSwitch name="isPublic" labelPlacement="start" label="Public Profile" sx={{ mt: 5 }} /> */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="first_name" label="First name" />
              <RHFTextField name="last_name" label="Last name" />
              <RHFTextField name="email" label="Email Address" />

              <RHFTextField name="phone_number" label="Phone Number" />

              <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="VN">
                  Việt Nam
                </option>
                {/* {countries.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))} */}
              </RHFSelect>

              {/* <RHFTextField name="province" label="Province/City" /> */}
              <RHFSelect name="province_id" label="Province/City" placeholder="Hà Nội" onChange={(event) => handleResetAddress("province", event.target.value)}>
                <option value=""/>
                {provinces?.map((province) => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name="district_id" label="District/City" placeholder="Quận / Thành phố" onChange={(event) => handleResetAddress("district", event.target.value)}>
                  <option value="" />
                  {districts?.map((district) => (
                    <option key={district.DistrictID} value={district.DistrictID}>
                      {district.DistrictName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect name="ward_id" label="Ward" placeholder="Phường/Xã" onChange={(event) => handleResetAddress("ward", event.target.value)}>
                  <option value="" />
                  {wards?.map((ward) => (
                    <option key={ward.WardCode} value={ward.WardCode}>
                      {ward.WardName}
                    </option>
                  ))}
              </RHFSelect>
              
              <RHFTextField name="street" label="Street" />

              {/* <RHFTextField name="ward" label="Ward/City" /> */}
              {/* <RHFTextField name="zipCode" label="Zip/Code" /> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
