import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { paramCase } from 'change-case';
import {useSnackbar} from 'notistack';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { styled } from '@mui/material/styles';
import { 
    Grid, 
    Container, 
    Card, 
    Stack, 
    TextField, 
    Typography, 
    CardHeader, 
    CardContent, 
    Checkbox,
    Skeleton
} from '@mui/material';
import { MobileDateTimePicker, LoadingButton } from '@mui/lab';
// utils
import axiosInstance from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { RHFTextField, FormProvider, RHFSwitch } from '../../components/hook-form';
import Image from '../../components/Image';

// ----------------------------------------------------------------------

export default function EcommerceVoucherCreate() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');

  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();
  
  const [currentVoucher, setCurrentVoucher] = useState();

  const [listProduct, setListProduct] = useState([]);

  const [loading, setLoading] = useState(true);

  const NewVoucherSchema = Yup.object().shape({
    code: Yup.string().required('Code is required'),
    discount: Yup.number().required().moreThan(0, 'Discount value should not be 0'),
    is_percentage: Yup.boolean().required(),
    products: Yup.array().required().min(1),
    start_date: Yup.date().required(),
    end_date: Yup.date().required().min(Yup.ref("start_date"), "End date must be more than start date"),
});

  const defaultValues = {
    code: currentVoucher?.code || "",
    is_percentage: currentVoucher?.is_percentage || false,
    discount: 0,
    start_date: new Date(),
    end_date: new Date(),
    products: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewVoucherSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    errors,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onChangeProducts = (productId) => {
    let temp = [];
    if (values.products.find((item) => item === productId)) {
        temp = values.products.filter((item) => item !== productId);
    }
    else {
        temp = [...values.products, productId];
    }
    setValue("products", temp);
  }

  const onSubmit = async (data) => {
    try {
        if (isEdit) {
            await axiosInstance.patch(`/market/voucher/${id}/`, {
                ...data,
                start_date: data.start_date.toISOString(),
                end_date: data.end_date.toISOString()
            });
        }
        else {
            await axiosInstance.post("/market/voucher/", {
                ...data,
                start_date: data.start_date.toISOString(),
                end_date: data.end_date.toISOString()
            });
        }
        enqueueSnackbar("Success");
        navigate(PATH_DASHBOARD.eCommerce.voucherList);
    }
    catch (error) {
        console.log(error);
        enqueueSnackbar("Failed", {variant: "error"});
    }
  };

  useEffect(() => {
    const getProducts = async () => {
        const listProductResp = await axiosInstance.get("/market/products/full-products/", {
            params: {
                has_option: 1
            }
        });
        setListProduct(listProductResp.data);
    };
    getProducts();
    setLoading(false);
    if (id) {
      const getVoucher = async () => {
        const response = await axiosInstance.get(`/market/voucher/${id}/`);
        setCurrentVoucher(response.data);
        setValue("code", response.data.code);
        setValue("is_percentage", response.data.is_percentage);
        setValue("discount", Number(response.data.discount));
        setValue("start_date", new Date(response.data.start_date));
        setValue("end_date", new Date(response.data.end_date));
        setValue("products", response.data.products);
      };
      getVoucher();
    };
    return () => reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  useEffect(() => {
    console.log(errors);
  }, [errors])

  return (
    <Page title="Ecommerce: Create a new voucher">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new voucher' : 'Edit voucher'}
          links={[
            { name: 'Home', href: PATH_DASHBOARD.home },
            {
              name: 'Voucher List',
              href: PATH_DASHBOARD.eCommerce.voucherList,
            },
            { 
              name: !isEdit ? 'New voucher' : currentVoucher?.code, 
              href: !isEdit ? PATH_DASHBOARD.eCommerce.voucherNew : PATH_DASHBOARD.eCommerce.voucherDetail(currentVoucher?.id)
            },
          ]}
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader 
                            title={
                                <Typography>
                                    Your Products
                                </Typography>
                            }
                        />
                        <CardContent>
                            <Stack spacing={2}>
                            {!loading ? listProduct.map((item) => 
                                <ProductItem onChange={() => onChangeProducts(item.id)} selected={values.products.includes(item.id)} key={item.id} product={item} />
                            ):
                                <ProductItemSkeleton />
                            }
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{p: 2}}>
                        <Stack spacing={2}>
                            <RHFTextField name="code" label="Voucher Code" />
                            <div>
                                <RHFSwitch sx={{textAlign: "right", display: "flex", flexDirection: "row-reverse", justifyContent: "space-between"}} labelPlacement="start" name="is_percentage" label="Is Percentage" />
                            </div>
                            <Controller
                                name="start_date"
                                control={control}
                                render={({ field }) => (
                                    <MobileDateTimePicker
                                    {...field}
                                    label="Start date"
                                    inputFormat="dd/MM/yyyy hh:mm:ss"
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                )}
                            />
                            <Controller
                                name="end_date"
                                control={control}
                                render={({ field }) => (
                                    <MobileDateTimePicker
                                    {...field}
                                    label="End date"
                                    inputFormat="dd/MM/yyyy hh:mm:ss"
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                )}
                            />
                            <RHFTextField 
                                name="discount"
                                label="Discount"
                                placeholder="1"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    type: 'number'
                                }}
                            />
                            <div>
                                <LoadingButton loading={isSubmitting} fullWidth variant='contained' color="primary" type="submit">
                                    Submit
                                </LoadingButton>
                            </div>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        
        </FormProvider>
      </Container>
    </Page>
  );
}

// ---------------------------------

ProductItem.propTypes = {
    product: PropTypes.object,
    selected: PropTypes.bool,
    onChange: PropTypes.func,
}

function ProductItem({product, selected, onChange}) {
    return (
        <Card sx={{p: 2}}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={2}>
                    <Checkbox onChange={onChange} checked={selected} />
                </Grid>
                <Grid item xs={12} md={2}>
                    <Image src={product.picture} ratio="1/1" />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Stack spacing={1}>
                        <Typography variant='subtitle1'>
                            {product.name}
                        </Typography>
                        <Typography variant='subtitle2' color="primary">
                            Price: {product.min_price}
                        </Typography>
                    </Stack>
                </Grid>
                
            </Grid>
        </Card>
    )
}

// -----------------------------------

function ProductItemSkeleton() {
    return (
        <Card sx={{p: 2}}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={2}>
                    <Skeleton />
                </Grid>
                <Grid item xs={12} md={2}>
                    <Skeleton />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Stack spacing={1}>
                        <Skeleton />
                        <Skeleton />
                    </Stack>
                </Grid>
                
            </Grid>
        </Card>
    )
}