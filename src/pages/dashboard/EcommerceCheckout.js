import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Grid, Step, Stepper, Container, StepLabel, StepConnector } from '@mui/material';
// redux
import { 
  useDispatch, 
  useSelector 
} from '../../redux/store';
import { 
  getCart, 
  resetCart
} from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
// import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  CheckoutCart,
  CheckoutPayment,
  CheckoutOrderComplete,
  CheckoutBillingAddress,
} from '../../sections/@dashboard/e-commerce/checkout';
// utils
import axiosInstance from '../../utils/axios';

// ----------------------------------------------------------------------

const STEPS = ['Cart', 'Checkout', 'Completed'];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled',
      }}
    >
      {completed ? (
        <Iconify icon={'eva:checkmark-fill'} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
    </Box>
  );
}

export default function EcommerceCheckout() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const isMountedRef = useIsMountedRef();
  const { checkout } = useSelector((state) => state.product);
  const { orders, activeStep } = checkout;
  const [paymentType, setPaymentType] = useState(0);
  const [listOrders, setlistOrders] = useState({});
  const [paymentResult, setPaymentResult] = useState();
  const isComplete = activeStep === STEPS.length;

  useEffect(() => {
    const getCartsDefault = async () => {
      const responseCartsDefault = await axiosInstance.get("/market/cart/");
      dispatch(getCart(responseCartsDefault.data));
    }
    getCartsDefault();
  }, [dispatch])

  useEffect(() => {
    if (orders && orders.length > 0) {
      const prepareOrder = orders.reduce((acc, c) => {
        acc[c.id] = "";
        return acc;
      }, {});
      setlistOrders(prepareOrder);
    }
  }, [orders])

  const onCheckout = async () => {
    try {
      const response = await axiosInstance.post("/market/orders/checkout_order/", {
        "list_order": listOrders,
        "payment_type": Number(paymentType)
      });
      dispatch(resetCart());
      if ((paymentType === 1 || paymentType === "1") && response.data.pay_url) {
        window.location.href = response.data.pay_url;
      }
      setPaymentResult(response.data);
      navigate(PATH_DASHBOARD.invoice.shoppingList.concat("?status=approving"));
    }
    catch(error) {
      console.log(error);
    }
  }

  return (
    <Page title="Ecommerce: Checkout">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Checkout"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'Checkout' },
          ]}
        />

        <Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
          <Grid item xs={12} md={12} sx={{ mb: 5 }}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        typography: 'subtitle2',
                        color: 'text.disabled',
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>

        {!isComplete ? (
          <>
            {activeStep === 0 && <CheckoutCart />}
            {activeStep === 1 && orders && <CheckoutPayment setPaymentType={setPaymentType} paymentType={paymentType}/>}
            {activeStep === 2 && orders && <CheckoutBillingAddress orders={orders} listOrders={listOrders} setlistOrders={setlistOrders} onCheckout={onCheckout}/>}
          </>
        ) : (
          <CheckoutOrderComplete paymentType={paymentType} paymentResult={paymentResult} open={isComplete} />
        )}
      </Container>
    </Page>
  );
}
