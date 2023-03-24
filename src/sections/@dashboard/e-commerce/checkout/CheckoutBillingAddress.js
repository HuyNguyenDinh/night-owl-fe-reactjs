import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import sum from 'lodash/sum';
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
  Link 
} from '@mui/material';
// path route
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fNumber } from '../../../../utils/formatNumber';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onBackStep, onNextStep, createBilling } from '../../../../redux/slices/product';
// _mock_
// import { _addressBooks } from '../../../../_mock';
// components
// import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Image from '../../../../components/Image';
//
import CheckoutSummary from './CheckoutSummary';
// import CheckoutNewAddressForm from './CheckoutNewAddressForm';
// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {
  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const { total, discount, subtotal, shipping } = checkout;

  // const [open, setOpen] = useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  // const handleCreateBilling = (value) => {
  //   dispatch(createBilling(value));
  // };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* {_addressBooks.map((address, index) => (
            <AddressItem
              key={index}
              address={address}
              onNextStep={handleNextStep}
              onCreateBilling={handleCreateBilling}
            />
          ))} */}
          {checkout.orders && checkout.orders.map((order) => (
            <OrderItem key={order.id} store={order.store} cost={order.cost} orderDetails={order.orderdetail_set} shippingFee={order.total_shipping_fee} />
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
            {/* <Button size="small" onClick={handleClickOpen} startIcon={<Iconify icon={'eva:plus-fill'} />}>
              Add new address
            </Button> */}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary 
            onApplyDiscount={() => console.log("apply discount")} 
            enableDiscount 
            subtotal={subtotal} 
            total={subtotal + shipping} 
            discount={discount} 
            shipping={shipping} 
          />
          <Button variant="contained" fullWidth onClick={handleNextStep}>
            Checkout
          </Button>
        </Grid>
      </Grid>

      {/* <CheckoutNewAddressForm
        open={open}
        onClose={handleClose}
        onNextStep={handleNextStep}
        onCreateBilling={handleCreateBilling}
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  store: PropTypes.object,
  cost: PropTypes.any,
  orderDetails: PropTypes.array,
  shippingFee: PropTypes.any,
}

function OrderItem({store, cost, orderDetails, shippingFee}) {
  return (
    <Card sx={{marginBottom: "5vh"}}>
      <CardHeader 
        title={
          <Link to={PATH_DASHBOARD.user.store(store.id)} color="text.primary" component={RouterLink}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={store.avatar} />
              <Typography variant="h5">
                {[store.first_name, store.last_name].join(" ")}
              </Typography>
            </Stack>
          </Link>
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

