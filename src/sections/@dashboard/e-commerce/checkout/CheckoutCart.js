import { useState, useEffect, useRef, createContext } from 'react';
import sum from 'lodash/sum';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Grid, Card, Button, CardHeader, Typography } from '@mui/material';
import { TableSkeleton } from '../../../../components/table';
// hook
import useAuth from '../../../../hooks/useAuth';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import {
  onNextStep,
  updateCart,
  updateOrders
} from '../../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import EmptyContent from '../../../../components/EmptyContent';
//
// import CheckoutSummary from './CheckoutSummary';
import CheckoutProductList from './CheckoutProductList';
// utils
import axiosInstance from '../../../../utils/axios';

// ----------------------------------------------------------------------

export const CheckedCartsContext = createContext();

export default function CheckoutCart() {
  const dispatch = useDispatch();

  const { checkout } = useSelector((state) => state.product);

  // const { cart, total, discount, subtotal } = checkout;

  const { cart } = checkout;

  const { user } = useAuth();

  const totalItems = sum(cart.map((item) => item.quantity));

  const isEmptyCart = cart.length === 0;

  const [cartGroupBy, setCartGroupBy] = useState();

  const [isLoadingCart, setIsLoadingCart] = useState(false);

  const [checkedCarts, setCheckedCarts] = useState([]);

  const cartUpdateInfo = useRef({});

  const handleGetCartGroupBy = () => {
    const getCartGroupBy = async () => {
      const response = await axiosInstance.get("/market/cart/get-cart-groupby-owner/");
      setCartGroupBy(response.data);
    }
    getCartGroupBy();
  }

  const handleDeleteCarts = () => {
    const deleteCarts = async () => {
      try {
        await axiosInstance.post("/market/cart/delete-multiple/", {
            list_cart: checkedCarts
        })
      }
      catch (error) {
        console.log(error);
      }
      finally {
        handleGetCartGroupBy();
      }
    }
    deleteCarts();
  }

  useEffect(() => {
    handleGetCartGroupBy();
  }, [user])

  const handleNextStep = () => {
    const makeOrder = async () => {
      try {
        const response = await axiosInstance.post("/market/orders/", {
          list_cart: checkedCarts
        })
        await dispatch(updateOrders(response.data));
      }
      catch (error) {
        console.log(error);
      }
      finally {
        handleGetCartGroupBy();
      }
    }
    makeOrder();
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

  const handleRenderCheckoutProductList = () => {
    if (isLoadingCart) {
      return (
        <div>
        {cart ? cart.map((elm) => <TableSkeleton key={elm.id} />) : <TableSkeleton />}
        </div>
      )
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
          onHandleCheckCart={setCheckedCarts}
          checkedCarts={checkedCarts}
        />
      </Scrollbar>
    )
  }

  return (
    <CheckedCartsContext.Provider value={{checkedCarts, setCheckedCarts}}>
      <Typography variant="h3">
        Shopping Cart
        <Typography component="span" sx={{ color: 'text.secondary' }}>
          &nbsp;({totalItems} item)
        </Typography>
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          {/* <Card sx={{ mb: 3 }}>
            <CardHeader
              title={
                <Typography variant="h3">
                  Shopping Cart
                  <Typography component="span" sx={{ color: 'text.secondary' }}>
                    &nbsp;({totalItems} item)
                  </Typography>
                </Typography>
              }
              sx={{ mb: 3 }}
            /> */}
            {handleRenderCheckoutProductList()}
          {/* </Card> */}

        </Grid>

        <Grid item xs={12}>
          {/* <CheckoutSummary
            enableDiscount
            total={total}
            discount={discount}
            subtotal={subtotal}
            onApplyDiscount={handleApplyDiscount}
          /> */}
          <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
            <div style={{width: "20%"}}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                disabled={checkedCarts.length === 0}
                onClick={() => handleDeleteCarts()}
                color="error"
              >
                  Remove
              </Button>
            </div>
            <div style={{width: "78%"}}>
              <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  disabled={checkedCarts.length === 0}
                  onClick={() => handleNextStep()}
                >
                Check Out
              </Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={12}>
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
      </Grid>
    </CheckedCartsContext.Provider>
  );
}
