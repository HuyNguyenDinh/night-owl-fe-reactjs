import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom'; 
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Grid, Button, Card, CardHeader, CardContent, Typography, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import EditIcon from '@mui/icons-material/Edit';
// route
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hook
import useAuth from '../../../../hooks/useAuth';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { 
  onGotoStep, 
  onBackStep, 
  onNextStep, 
  // applyShipping, 
  updateOrders 
} from '../../../../redux/slices/product';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider } from '../../../../components/hook-form';
//
import CheckoutSummary from './CheckoutSummary';
// import CheckoutDelivery from './CheckoutDelivery';
// import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';

// ----------------------------------------------------------------------

// const DELIVERY_OPTIONS = [
//   {
//     value: 0,
//     title: 'Standard delivery (Free)',
//     description: 'Delivered on Monday, August 12',
//   },
//   {
//     value: 2,
//     title: 'Fast delivery ($2,00)',
//     description: 'Delivered on Monday, August 5',
//   },
// ];

const PAYMENT_OPTIONS = [
  {
    value: '1',
    title: 'Pay with Momo',
    description: 'You will be redirected to Momo website to complete your purchase securely.',
    icons: ['https://minimal-assets-api-dev.vercel.app/assets/icons/ic_paypal.svg'],
  },
  // {
  //   value: 'credit_card',
  //   title: 'Credit / Debit Card',
  //   description: 'We support Mastercard, Visa, Discover and Stripe.',
  //   icons: [
  //     'https://minimal-assets-api-dev.vercel.app/assets/icons/ic_mastercard.svg',
  //     'https://minimal-assets-api-dev.vercel.app/assets/icons/ic_visa.svg',
  //   ],
  // },
  {
    value: '0',
    title: 'Cash on CheckoutDelivery',
    description: 'Pay with cash when your order is delivered.',
    icons: [],
  },
];

// const CARDS_OPTIONS = [
//   { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
//   { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
//   { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
// ];

CheckoutPayment.propTypes = {
  paymentType: PropTypes.any,
  setPaymentType: PropTypes.func
}

export default function CheckoutPayment({ paymentType, setPaymentType }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user} = useAuth();

  const { checkout } = useSelector((state) => state.product);

  const { discount, subtotal, shipping, total } = checkout;

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(updateOrders([]));
    dispatch(onBackStep());
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  // const handleApplyShipping = (value) => {
  //   dispatch(applyShipping(value));
  // };

  const handleNavigate = () => {
    if (!user.email_verified || !user.phone_verified) {
      navigate(PATH_DASHBOARD.user.account.concat("?tab=verify"));
    }
    else {
      navigate(PATH_DASHBOARD.user.account.concat("?tab=address"));
    }
  }

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required!'),
  });

  const defaultValues = {
    delivery: shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue
  } = methods;

  const onSubmit = async () => {
    try {
      handleNextStep();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* <CheckoutDelivery onApplyShipping={handleApplyShipping} deliveryOptions={DELIVERY_OPTIONS} /> */}
          <Card>
            <CardHeader 
              title={
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography color="primary" variant='h4'>Address</Typography>
                  <Button color='primary' onClick={() => navigate(PATH_DASHBOARD.user.account.concat("?tab=address"))}>
                    <EditIcon />
                  </Button>
                </Stack>
              } 
            />
            <CardContent>
              <Typography variant='body2'>
                {user.address?.full_address}
              </Typography>
            </CardContent>
          </Card>
          <CheckoutPaymentMethods paymentOptions={PAYMENT_OPTIONS} setValue={setValue} paymentType={paymentType} setPaymentType={setPaymentType} />
          <Button
            size="small"
            color="inherit"
            onClick={handleBackStep}
            startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* <CheckoutBillingInfo onBackStep={handleBackStep} /> */}

          <CheckoutSummary
            // enableEdit
            total={total}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            onEdit={() => handleGotoStep(0)}
          />
          { user.address && user.address.full_address ? (
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Next
            </LoadingButton>
          ):
          (
            <Button fullWidth size="large" variant="contained" onClick={handleNavigate}>
              Complete KYC
            </Button>
          )
          }
        </Grid>
      </Grid>
    </FormProvider>
  );
}
