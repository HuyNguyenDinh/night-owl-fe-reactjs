import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// import sum from 'lodash/sum';
// @mui
import { 
  Box, 
  Grid, 
  Card, 
  Button, 
  Typography, 
  Stack, 
  Paper, 
  Avatar, 
  CardHeader, 
  CardContent, 
  Divider, 
  Link,
  Modal,
  IconButton,
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DiscountIcon from '@mui/icons-material/Discount';
import CheckIcon from '@mui/icons-material/Check';
// hook
// import useAuth from '../../../../hooks/useAuth';
import { SkeletionCard } from '../../../../components/skeleton';
// path route
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fNumber } from '../../../../utils/formatNumber';
import { fDate } from '../../../../utils/formatTime';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { 
  onBackStep, 
  applyDiscount
  // onNextStep, 
  // createBilling 
} from '../../../../redux/slices/product';
// _mock_
// import { _addressBooks } from '../../../../_mock';
// components
// import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Image from '../../../../components/Image';
//
import CheckoutSummary from './CheckoutSummary';
import axiosInstance from '../../../../utils/axios';
// import CheckoutNewAddressForm from './CheckoutNewAddressForm';
// ----------------------------------------------------------------------

CheckoutBillingAddress.propTypes = {
  // orders: PropTypes.array,
  listOrders: PropTypes.object,
  setlistOrders: PropTypes.func,
  // onApplyVoucher: PropTypes.func,
  onCheckout: PropTypes.func
}

export default function CheckoutBillingAddress({ 
  // orders, 
  listOrders,
  setlistOrders, 
  // onApplyVoucher, 
  onCheckout 
}) {
  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const { discount, subtotal, shipping, total } = checkout;

  const handleBackStep = () => {
    dispatch(onBackStep());
    setlistOrders({});
  };

  const handleApplyDiscount = (amount) => {
    dispatch(applyDiscount(discount + amount));
  }

  useEffect(() => () => dispatch(applyDiscount(0)), []);

  return (
    <div>
      {checkout.orders.length > 0 &&
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {checkout.orders && checkout.orders.map((order) => (
              <OrderItem 
                key={order.id}
                orderID={order.id} 
                store={order.store} 
                cost={order.cost} 
                orderDetails={order.orderdetail_set} 
                shippingFee={order.total_shipping_fee} 
                listOrders={listOrders}
                setlistOrders={setlistOrders}
                handleApplyDiscount={handleApplyDiscount}
              />
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                size="small"
                color="inherit"
                onClick={handleBackStep}
                startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
              >
                Back
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <CheckoutSummary 
                subtotal={subtotal} 
                total={total} 
                discount={discount} 
                shipping={shipping}
              />
              <Button variant="contained" fullWidth onClick={onCheckout}>
                Checkout
              </Button>              
            </Stack>
          </Grid>
        </Grid>
      }
      {checkout.orders.length <= 0 && <SkeletionCard /> }
    </div>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  orderID: PropTypes.any,
  store: PropTypes.object,
  cost: PropTypes.any,
  orderDetails: PropTypes.array,
  shippingFee: PropTypes.any,
  listOrders: PropTypes.object,
  setlistOrders: PropTypes.func,
  handleApplyDiscount: PropTypes.func
}

function OrderItem({ orderID, store, cost, orderDetails, shippingFee, listOrders , setlistOrders, handleApplyDiscount}) {
  
  const [open, setOpen] = useState(false);
  const [orderVouchers, setOrderVouchers] = useState([]);
  const [currentVoucher, setCurrentVoucher] = useState({});
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {  
    const getVoucherAvailable = async () => {
      try {
        const response = await axiosInstance.get(`/market/orders/${orderID}/voucher-available/`);
        setOrderVouchers(response.data);
      }
      catch(error) {
        console.log(error);
      }
    }
    getVoucherAvailable();
  }, [orderID])

  const handleApplyVoucher = async (voucher) => {
    if (voucher) {
      try {
        const response = await axiosInstance.post("/market/orders/apply-voucher/", {
          'list_order': [orderID],
          'list_voucher': [voucher]
        });
        if (response.data[voucher]) {
          if (listOrders) {
            const newState = {...listOrders}
            newState[orderID] = voucher;
            setlistOrders(newState);
          }
          else {
            setlistOrders({orderID: voucher});
          }
          if (currentVoucher && currentVoucher.discount) {
            handleApplyDiscount(Number(response.data[voucher] - currentVoucher.discount));
          }
          else {
            handleApplyDiscount(Number(response.data[voucher]));
          }
          setCurrentVoucher({code: voucher, discount: response.data[voucher]});
          enqueueSnackbar("Apply Voucher success");
        }
        else {
          setCurrentVoucher({});
          if (listOrders) {
            const newState = {...listOrders}
            newState[orderID] = '';
            setlistOrders(newState);
          }
          else {
            setlistOrders({orderID: ''});
          }
          enqueueSnackbar("Voucher not found", {variant: "error"});
        }
      }
      catch(error) {
        console.log(error);
        setCurrentVoucher({});
        if (listOrders) {
          const newState = {...listOrders}
          newState[orderID] = '';
          setlistOrders(newState);
        }
        else {
          setlistOrders({orderID: ''});
        }
        enqueueSnackbar("Apply voucher failed", {variant: "error"});
      }
    }
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Card sx={{marginBottom: "5vh"}}>
      <CardHeader 
        title={
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Link to={PATH_DASHBOARD.user.store(store.id)} color="text.primary" component={RouterLink}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={store.avatar} />
                  <Typography variant="h5">
                    {[store.first_name, store.last_name].join(" ")}
                  </Typography>
                </Stack>
            </Link>
            <Stack direction="row" spacing={1} alignItems="center">
              {currentVoucher && currentVoucher.discount && (
                <Typography variant='subtitle2' color="primary" textAlign="right">
                  - {currentVoucher.discount}
                </Typography>
              )}
              <Button onClick={() => setOpen(true)}>
                <DiscountIcon />
              </Button>
            </Stack>
          </Stack>
        }
      />
      <CardContent>
      <Stack>
        {orderDetails && orderDetails.map((orderDetail) => (
          <Paper key={orderDetail.id} sx={{margin: "2vh 0"}}>
            <Grid container spacing={2} alignItems="center">
              <Grid xs={2} item>
                <Image src={orderDetail.product_option.base_product.picture} sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }}/>
              </Grid>
              <Grid xs={7} item rowGap={2}>
                <Link to={PATH_DASHBOARD.eCommerce.view(orderDetail.product_option.base_product.id)} component={RouterLink}>  
                  <Typography variant="subtitle1">
                    {orderDetail.product_option.base_product.name}
                  </Typography>
                </Link>
                <Typography variant="body2">
                  Option: {orderDetail.product_option.unit}
                </Typography>
                <Typography variant="body2">
                  Quantity: {orderDetail.quantity}
                </Typography>
              </Grid>
              <Grid xs={3} item>
                <Typography variant="subtitle2" textAlign="right">
                  {fNumber(orderDetail.product_option.price)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
      <Divider />
      <Stack marginTop="2vh" direction="row" justifyContent="space-between">
        <Typography variant="subtitle1" color="text.secondary">
         Shipping Fee: {fNumber(shippingFee)}
        </Typography>
        <Typography variant="subtitle1" color="error">
          Subtotal: {fNumber(cost)}
        </Typography>
      </Stack>
      </CardContent>
      <Modal onClose={handleClose} open={open}>
        <Card
          sx={{
            position: "absolute", 
            p: 5,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: "40%",
            height: "80vh",
            padding: 1,
        }}   
        >
          <CardHeader 
            title={
              <Stack direction="row" justifyContent="space-between">
                <Typography>
                  Vouchers
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            } 
          />
          <CardContent>
            {orderVouchers && orderVouchers.map((elm) => (
              <Card key={elm.id}>
                <Grid container>
                  <Grid item xs={3}>
                    <Image sx={{p: 2}} src={elm.creator === store.id ? store.avatar : "https://res.cloudinary.com/dectbvmyx/image/upload/v1680423408/NOM-Logo_512_512_px_l0djyn.png"} />
                  </Grid>
                  <Grid item xs={6} margin="auto">
                    <Stack sx={{p: 3}} spacing={1} justifyItems="center">
                      <Typography>
                        Discount: {fNumber(elm.discount)} {elm.is_percentage && "%"}
                      </Typography>
                      <Typography>
                        Expired date: {elm.end_date ? fDate(elm.end_date) : "Forever"}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={3} margin="auto" textAlign="center">
                    <Button variant={currentVoucher && currentVoucher.code === elm.code ? "contained" : "outlined"} onClick={() => handleApplyVoucher(elm.code)}>
                      Apply
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            ))}
            { (!orderVouchers || orderVouchers.length === 0) && (
              <Typography textAlign="center">
                No vouchers found
              </Typography>
            ) }
          </CardContent>
        </Card>
      </Modal>
    </Card>
    
  )
}

// ----------------------------------------------------------------------

// AddressItem.propTypes = {
//   address: PropTypes.object,
//   onNextStep: PropTypes.func,
//   onCreateBilling: PropTypes.func,
// };

// function AddressItem({ address, onNextStep, onCreateBilling }) {
//   const { receiver, fullAddress, addressType, phone, isDefault } = address;

//   const handleCreateBilling = () => {
//     onCreateBilling(address);
//     onNextStep();
//   };

//   return (
//     <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
//       <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1">{receiver}</Typography>

//         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//           &nbsp;({addressType})
//         </Typography>

//         {isDefault && (
//           <Label color="info" sx={{ ml: 1 }}>
//             Default
//           </Label>
//         )}
//       </Box>

//       <Typography variant="body2" gutterBottom>
//         {fullAddress}
//       </Typography>

//       <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//         {phone}
//       </Typography>

//       <Box
//         sx={{
//           mt: 3,
//           display: 'flex',
//           position: { sm: 'absolute' },
//           right: { sm: 24 },
//           bottom: { sm: 24 },
//         }}
//       >
//         {!isDefault && (
//           <Button variant="outlined" size="small" color="inherit">
//             Delete
//           </Button>
//         )}
//         <Box sx={{ mx: 0.5 }} />
//         <Button variant="outlined" size="small" onClick={handleCreateBilling}>
//           Deliver to this Address
//         </Button>
//       </Box>
//     </Card>
//   );
// }

