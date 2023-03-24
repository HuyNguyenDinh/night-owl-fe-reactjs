import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import axiosInstance from '../../../../utils/axios';
// hooks
import useAuth from '../../../../hooks/useAuth';
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';

export default function AccountAddress() {
    
  const { enqueueSnackbar } = useSnackbar();

  const [provinces, setProvinces] = useState([]);

  const [districts, setDistricts] = useState([]);

  const [wards, setWards] = useState([]);

  const { user, setUser } = useAuth();
  const updatedUser = user;

  const GHNAxiosInstance = axios.create({
    baseURL: "https://dev-online-gateway.ghn.vn",
  })
  GHNAxiosInstance.defaults.headers.Token = "8ae8d191-18b9-11ed-b136-06951b6b7f89";
  GHNAxiosInstance.defaults.headers.ShopId = 117552;

  const UpdateUserSchema = Yup.object().shape({
    street: Yup.string().required('street is required'),
    province_id: Yup.string().required('province is required'),
    district_id: Yup.string().required('district is required'),
    ward_id: Yup.string().required('ward is required'),
  });

  const defaultValues = {
    street: user?.address?.street || '',
    province_id: user?.address?.province_id || '',
    district_id: user?.address?.district_id || '',
    ward_id: user?.address?.ward_id || ''
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const { setValue, handleSubmit, watch, formState: { isSubmitting }, } = methods;

  const values = watch();

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

  const onSubmit = async () => {
    const currentProvince = provinces.find((elm) => elm.ProvinceID === Number(values.province_id));
    const currentDistrict = districts.find((elm) => elm.DistrictID === Number(values.district_id));
    const currentWard = wards.find((elm) => elm.WardCode === values.ward_id);
    const fullAddress = [values.street, currentWard.WardName, currentDistrict.DistrictName, currentProvince.ProvinceName, "Việt Nam"].join(", ");

    try {
        if (user.address) {
            const responseChangeAddress = await axiosInstance.patch(`/market/address/${user.address.id}/`, {
                ...values,
                full_address: fullAddress
            });
            updatedUser.address = responseChangeAddress.data;
        }
        else {
          console.log(user.address);
            const responseAddAddress = await axiosInstance.post(`/market/address/`, {
                ...values,
                full_address: fullAddress
            });
            updatedUser.address = responseAddAddress.data;
        }
        setUser(updatedUser);
        setValue('province_id', user.address.province_id);
        setValue('district_id', user.address.district_id);
        setValue('ward_id', user.address.ward_id);
        setValue('street', user.address.street);
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  };

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
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
          <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
                <RHFSelect name="country" label="Country" placeholder="Country">
                <option value="VN">
                  Việt Nam
                </option>
              </RHFSelect>

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
        </FormProvider>
  )
}