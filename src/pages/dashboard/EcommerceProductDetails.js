import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Box, Tab, Card, Grid, Divider, Container, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// hook
import useAuth from '../../hooks/useAuth';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProduct, onGotoStep, addToCart } from '../../redux/slices/product';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// import Iconify from '../../components/Iconify';
import Markdown from '../../components/Markdown';
import { SkeletonProduct } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  ProductDetailsSummary,
  ProductDetailsReview,
  ProductDetailsCarousel,
} from '../../sections/@dashboard/e-commerce/product-details';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';

// ----------------------------------------------------------------------

export default function EcommerceProductDetails() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const [value, setValue] = useState('1');
  const { id = '' } = useParams();
  const { product, error, checkout } = useSelector((state) => state.product);
  const { enqueueSnackbar } = useSnackbar();
  const [isAddCart, setIsAddCart] = useState(false);

  useEffect(() => {
    dispatch(getProduct(id));
    return () => {
      dispatch(getProduct());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddCart = (option) => {
    if (!isAuthenticated) {
      navigate(PATH_AUTH.login);
    }
    setIsAddCart(true);
    dispatch(addToCart(option.id, option.quantity));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  useEffect(() => {
    if (product && checkout.cart && isAddCart) {
      if (error) {
        enqueueSnackbar("Failed to add to cart", {variant: "error"});
      }
      else {
        enqueueSnackbar("Add to cart success");
      }
    }
    setIsAddCart(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout.cart, error])

  return (
    <Page title="Ecommerce: Product Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            {
              name: 'Shop',
              href: PATH_DASHBOARD.eCommerce.shop,
            },
            { name: product ? product.name : "Unknown"},
          ]}
        />

        <CartWidget />

        { (product && product.id === Number(id)) && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <ProductDetailsCarousel product={product} />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <ProductDetailsSummary
                    product={product}
                    cart={checkout.cart}
                    onAddCart={handleAddCart}
                    onGotoStep={handleGotoStep}
                  />
                </Grid>
              </Grid>
            </Card>

            <Card sx={{marginTop: 5, marginBottom: 5}}>
              <TabContext value={value}>
                <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                  <TabList onChange={(e, value) => setValue(value)}>
                    <Tab disableRipple value="1" label="Description" />
                    <Tab
                      disableRipple
                      value="2"
                      label="Ratings"
                      sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
                    />
                  </TabList>
                </Box>

                <Divider />

                <TabPanel value="1">
                  <Box sx={{ p: 3 }}>
                    <Markdown children={product.description} />
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <ProductDetailsReview product={product} />
                </TabPanel>
              </TabContext>
            </Card>
          </>
        )}

        {(!product || product.id !== Number(id)) && <SkeletonProduct />}

        {error && <Typography variant="h6">404 Product not found</Typography>}
      </Container>
    </Page>
  );
}
