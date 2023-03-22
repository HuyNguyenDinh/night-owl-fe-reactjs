import { useState, useEffect, useRef } from 'react';
import sum from 'lodash/sum';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Grid, Card, Button, CardHeader, Typography, CircularProgress } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import {
  onNextStep,
  applyDiscount,
  updateCart
} from '../../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import EmptyContent from '../../../../components/EmptyContent';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutProductList from './CheckoutProductList';
// utils
import axiosInstance from '../../../../utils/axios';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  const { cart, total, discount, subtotal } = checkout;

  const totalItems = sum(cart.map((item) => item.quantity));

  const isEmptyCart = cart.length === 0;

  const [cartGroupBy, setCartGroupBy] = useState();

  const [isLoadingCart, setIsLoadingCart] = useState(false);

  const cartUpdateInfo = useRef({});

  const handleGetCartGroupBy = () => {
    const getCartGroupBy = async () => {
      const response = await axiosInstance.get("/market/cart/get-cart-groupby-owner/");
      setCartGroupBy(response.data);
    }
    getCartGroupBy();
  }

  useEffect(() => {
    handleGetCartGroupBy();
  }, [])

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  function handleUpdateCart(action, cartId, quantity){
    dispatch(updateCart(action, cartId, quantity)).then(() => {
      handleGetCartGroupBy();
      setIsLoadingCart(false);
      cartUpdateInfo.current = {}
    });
  }

  useEffect(() => {
    if (isLoadingCart) {
      handleUpdateCart(cartUpdateInfo.current.action, cartUpdateInfo.current.cartId, cartUpdateInfo.current.quantity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingCart])

  const decoratorHandleUpdateCart = (action, cartId, quantity) => {
    cartUpdateInfo.current = { action, cartId, quantity };
    setIsLoadingCart(true);
  }

  const handleApplyDiscount = (value) => {
    dispatch(applyDiscount(value));
  };

  const handleRenderCheckoutProductList = () => {
    if (isLoadingCart) {
      return (<CircularProgress sx={{margin: "5vh auto", display: "flex"}} />)
    }
    if (isEmptyCart) {
      return (
        <EmptyContent
            title="Cart is empty"
            description="Look like you have no items in your shopping cart."
            img="/assets/illustrations/illustration_empty_cart.svg"
          />
      )
    }
    return (
      <Scrollbar>
        <CheckoutProductList
          owners={cartGroupBy || []}
          onDelete={decoratorHandleUpdateCart}
          onIncreaseQuantity={decoratorHandleUpdateCart}
          onDecreaseQuantity={decoratorHandleUpdateCart}
        />
      </Scrollbar>
    )
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Shopping Cart
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({totalItems} item)
                </Typography>
              </Typography>
            }
            sx={{ mb: 3 }}
          />
          {handleRenderCheckoutProductList()}
        </Card>

      </Grid>

      <Grid item xs={12} md={12}>
        <CheckoutSummary
          enableDiscount
          total={total}
          discount={discount}
          subtotal={subtotal}
          onApplyDiscount={handleApplyDiscount}
        />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={cart.length === 0}
          onClick={handleNextStep}
        >
          Check Out
        </Button>
      </Grid>
      <Button
        color="inherit"
        component={RouterLink}
        to={PATH_DASHBOARD.eCommerce.root}
        startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
        sx={{marginTop: "5vh"}}
      >
        Continue Shopping
      </Button>
    </Grid>
  );
}
