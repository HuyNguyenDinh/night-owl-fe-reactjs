import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  products: [],
  nextProducts: '',
  product: null,
  sortBy: null,
  filters: {
    // gender: [],
    category: 'All',
    // colors: [],
    options: [],
    priceRange: '',
    // rating: '',
  },
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
  },
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },

    setNextProducts(state, action) {
      state.isLoading = false;
      state.nextProducts = action.payload;
    },

    getMoreProducts(state, action) {
      state.isLoading = false;
      state.products = [...state.products,...action.payload];
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    getMoreProductInfo(state, action) {
      state.isLoading = false;
      state.product = {...state.product, ...action.payload};
    },

    setNextRatings(state, action) {
      state.isLoading = false
      state.nextRatings = action.payload;
    },

    getMoreRatings(state, action) {
      state.isLoading = false;
      state.product = {...state.product, ratings: {...state.product.ratings, ...action.payload}};
    },

    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },

    filterProducts(state, action) {
      // state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      // state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = sum(cart.map((cartItem) => cartItem.quantity * cartItem.product_option.price));
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const billing = cart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing; 
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - discount;
    },

    // addCart(state, action) {
    //   const option = action.payload;
    //   const isEmptyCart = state.checkout.cart.length === 0;

    //   if (isEmptyCart) {
    //     state.checkout.cart = [...state.checkout.cart, option];
    //   } else {
    //     state.checkout.cart = state.checkout.cart.map((_option) => {
    //       const isExisted = _option.id === option.id;
    //       if (isExisted) {
    //         return {
    //           ..._option,
    //           quantity: _option.quantity + 1,
    //         };
    //       }
    //       return _option;
    //     });
    //   }
    //   state.checkout.cart = uniqBy([...state.checkout.cart, option], 'id');
    // },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter((item) => item.id !== action.payload);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.billing = null;
    },

    onBackStep(state) {
      state.checkout.activeStep -= 1;
    },

    onNextStep(state) {
      state.checkout.activeStep += 1;
    },

    onGotoStep(state, action) {
      const goToStep = action.payload;
      state.checkout.activeStep = goToStep;
    },

    increaseQuantity(state, action) {
      const optionId = action.payload;
      const updateCart = state.checkout.cart.map((option) => {
        if (option.id === optionId) {
          return {
            ...option,
            quantity: option.quantity + 1,
          };
        }
        return option;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const optionId = action.payload;
      const updateCart = state.checkout.cart.map((option) => {
        if (option.id === optionId) {
          return {
            ...option,
            quantity: option.quantity - 1,
          };
        }
        return option;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  // addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  sortByProducts,
  filterProducts,
  getMoreProducts,
  setNextProducts,
  setNextRatings,
  getMoreRatings,
  getMoreProductInfo,
} = slice.actions;

// ----------------------------------------------------------------------

export function getProducts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/market/products?has_option=1');
      dispatch(slice.actions.getProductsSuccess(response.data.results));
      if (response.data.next) {
        dispatch(slice.actions.setNextProducts(response.data.next))
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProduct(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/market/products/${id}/`);
      dispatch(slice.actions.getProductSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getRatings(productID) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/market/products/${productID}/comments/`);
      dispatch(slice.actions.getMoreProductInfo({ratings: response.data.results, totalRatings: response.data.count}));
      if (response.data.next) {
        dispatch(slice.actions.setNextRatings(response.data.next));
      }
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  }
}

export function getCarts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const getCartsResp = await axios.get("/market/cart/");
      dispatch(slice.actions.getCart(getCartsResp.data));
    }
    catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

export function addToCart(optionId, quantity) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post(`/market/options/${optionId}/add-to-cart/`, {
        quantity
      });
      const getCartResp = await axios.get(`/market/cart/`);
      dispatch(slice.actions.getCart(getCartResp.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  }
}

export function updateCart(action, cartId, quantity) {

  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      if (action === "delete") {
        await axios.delete(`/market/cart/${cartId}/`);
      }
      else {
        await axios.patch(`/market/cart/${cartId}/`, {
          quantity
        })
      }
      const getCartResp = await axios.get(`/market/cart/`);
      dispatch(slice.actions.getCart(getCartResp.data));
    } catch(error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}
