import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { 
  useForm, 
  // Controller 
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { 
  Card, 
  Chip, 
  Grid, 
  Stack, 
  TextField, 
  Typography, 
  Autocomplete, 
  // InputAdornment, 
  // Box 
} from '@mui/material';
// utils
import axiosInstance from '../../../utils/axios';
// routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  // RHFSelect,
  RHFEditor,
  RHFTextField,
  // RHFRadioGroup,
  RHFUploadSingleFile,
  // RHFUploadMultiFile,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------


const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
  setCurrentProduct: PropTypes.func,
  setActiveStep: PropTypes.func,
};

export default function ProductNewEditForm({ isEdit, currentProduct, setCurrentProduct, setActiveStep }) {
  // const navigate = useNavigate();
  const [systemCategories, setSystemCategories] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [isChangePicture, setIsChangePicture] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    picture: Yup.mixed().required('Picture is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    is_available: Yup.bool(),
    categories: Yup.array().required('Product must be at least in 1 category')
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      picture: null,
      is_available: true,
      categories: currentProduct?.categories || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    // control,
    setValue,
    // getValues,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const resp = await axiosInstance.get("/market/category/");
        setSystemCategories(resp.data.results);
        if (currentProduct?.categories) {
          setCurrentCategories(currentProduct?.categories?.map((elm) => resp.data.results.find(item => item.id === elm)));
        }
      }
      catch(error) {
        console.log(error);
      }
    };
    getCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  useEffect(() => {
    if (errors) {
      console.log(errors);
    }
  }, [errors]);

  useEffect(() => {
    if (currentProduct && currentProduct?.picture) {
      setValue(
        'picture',
        Object.assign(
          currentProduct?.picture, {
          preview: currentProduct?.picture || URL.createObjectURL(currentProduct?.picture),
        })
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, currentProduct?.picture])

  const onSubmit = async () => {
    try {
      const data = new FormData();
      data.append("name", values.name);
      data.append("is_available", values.is_available);
      data.append("description", values.description);
      if (isChangePicture) {
        data.append("picture", values.picture);
      }
      values.categories.map((item) => data.append("categories", item));
      if (currentProduct && currentProduct.id) {
        const resp = await axiosInstance.patch(`/market/products/${currentProduct.id}/`, data)
        setCurrentProduct({...resp.data});
      }
      else {
        const resp = await axiosInstance.post("/market/products/", data)
        setCurrentProduct({...resp.data});
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      setActiveStep(1);
    } catch (error) {
      enqueueSnackbar(!isEdit ? 'Create failed!' : 'Update failed!', {variant: "error"});
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'picture',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
        setIsChangePicture(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue]
  );

  const handleChangeCategory = (newValue) => {
    setCurrentCategories(newValue);
    const newCategories = newValue.map((elm) => systemCategories.find(item => item.name === elm.name).id)
    setValue("categories", newCategories)
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" onChange={(event) => setValue("name", event.target.value)} label="Product Name" />
              <Autocomplete
                multiple
                freeSolo
                value={currentCategories}
                onChange={(event, newValue) => handleChangeCategory(newValue)}
                options={systemCategories.map((option) => option)}
                getOptionLabel={(option) => option.name}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.name} />
                  ))
                }
                renderInput={(params) => <TextField label="Categories" {...params} />}
              />
              <div>
                <LabelStyle>Description</LabelStyle>
                <RHFEditor simple name="description" />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Card sx={{p: 2}}>

              <Stack spacing={3} mt={2}>
              <div>
                <RHFSwitch sx={{textAlign: "right", display: "flex", flexDirection: "row-reverse", justifyContent: "space-between"}} labelPlacement="start" name="is_available" label="Available" />
              </div>
              <div>
                <LabelStyle sx={{marginLeft: 2}}>Image Cover</LabelStyle>
                <RHFUploadSingleFile
                  showPreview
                  name="picture"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onUpload={() => console.log('ON UPLOAD')}
                />
              </div>
              </Stack>
            </Card>
            <div>
              <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                {!isEdit && !currentProduct?.id ? 'Create Product' : 'Save Changes'}
              </LoadingButton>
            </div>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
