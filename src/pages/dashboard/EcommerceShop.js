import React, { useEffect, useState, createContext } from 'react';
// import orderBy from 'lodash/orderBy';
// form
// import { useForm } from 'react-hook-form';
// @mui
import { Container, Typography, Stack, Button } from '@mui/material';
// hook
import useAuth from '../../hooks/useAuth';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { 
  getProducts, 
  // filterProducts, 
  setNextProducts, 
  getMoreProducts, 
  getCart 
} from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// import { FormProvider } from '../../components/hook-form';
// sections
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterSidebar,
  ShopProductSearch,
} from '../../sections/@dashboard/e-commerce/shop';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';
import axiosInstance from '../../utils/axios';

// ----------------------------------------------------------------------

export const FilterContext = createContext({
  categories: [],
  categoryId: "",
  categoryName: "",
  searchQuery: "",
  ordering: "",
  setCategoryId: () => Promise.resolve(),
  setCategoryName: () => Promise.resolve(),
  handleChangeFilter: () => Promise.resolve(),
  handleClearFilter: () => Promise.resolve(),
  setSearchQuery: () => Promise.resolve(),
  setOrdering: () => Promise.resolve(),
})

export default function EcommerceShop() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [ordering, setOrdering] = useState("featured");

  const { user } = useAuth();

  const [openFilter, setOpenFilter] = useState(false);

  const { products, sortBy, filters, nextProducts, isLoading } = useSelector((state) => state.product);

  const filteredProducts = applyFilter(products, sortBy, filters);

  // const defaultValues = {
  //   gender: filters.gender,
  //   category: filters.category,
  //   priceRange: filters.priceRange,
  //   rating: filters.rating,
  // };

  // const methods = useForm({
  //   defaultValues,
  // });

  // const { watch } = methods;

  // const values = watch();

  // const isDefault = categoryName;

  
  const handleChangeFilter = (id) => {
    setCategoryId(id);
    setCategoryName(categories.find((item) => item.id === id).name); 
  }

  const handleClearFilter = () => {
    setCategoryId();
    setCategoryName('');
  }
  
  useEffect(() => {
    const getCategories = async () => {
      const response = await axiosInstance.get("/market/category/");
      setCategories(response.data.results);
    }
    getCategories();
  }, [])

  useEffect(() => {
    let url = "/market/products/?has_option=1";
    if (categoryId) {
      url = url.concat(`&category_id=${categoryId}`);
    }
    if (searchQuery) {
      url = url.concat(`&search=${searchQuery}`);
    }
    if (ordering) {
      url = url.concat(`&ordering=${ordering}`);
    }
    dispatch(getProducts(url));
  }, [dispatch, categoryId, searchQuery, ordering]);

  useEffect(() => {
    const getCartsDefault = async () => {
      const responseCartsDefault = await axiosInstance.get("/market/cart/");
      dispatch(getCart(responseCartsDefault.data));
    }
    if (user) {
      getCartsDefault();
    }
  }, [dispatch, user])

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleGetMoreProduct = () => {
    const getMoreProduct = async () => {
      const response = await axiosInstance.get(nextProducts);
      dispatch(getMoreProducts(response.data.results));
      dispatch(setNextProducts(response.data.next));
    };
    getMoreProduct();
  }

  return (
    <FilterContext.Provider value={{
      searchQuery,
      categories,
      categoryId,
      categoryName,
      setCategoryId,
      setCategoryName,
      setSearchQuery,
      handleChangeFilter,
      handleClearFilter,
      setOrdering,
      ordering
    }}>
      <Page title="Ecommerce: Shop">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Shop"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'E-Commerce',
                href: PATH_DASHBOARD.eCommerce.root,
              },
              { name: 'Shop' },
            ]}
          />

          <Stack
            spacing={2}
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ sm: 'center' }}
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <ShopProductSearch />

            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              {/* <FormProvider methods={methods}> */}
                <ShopFilterSidebar
                  // onResetAll={handleResetFilter}
                  isOpen={openFilter}
                  onOpen={handleOpenFilter}
                  onClose={handleCloseFilter}
                />
              {/* </FormProvider> */}

              <ShopProductSort />
            </Stack>
          </Stack>

          <Stack sx={{ mb: 3 }}>
            {categoryName && (
              <>
                <Typography variant="body2" gutterBottom>
                  <strong>{filteredProducts.length}</strong>
                  &nbsp;Products found
                </Typography>
                <ShopTagFiltered />
              </>
            )}
          </Stack>
          <ShopProductList products={filteredProducts} loading={!products.length && isLoading} />
          <CartWidget />
          {nextProducts && <Button sx={{margin: "2vh auto", display: "flex"}} onClick={handleGetMoreProduct}>View more</Button>}
          
        </Container>
      </Page>
    </FilterContext.Provider>
  );
}

// ----------------------------------------------------------------------

function applyFilter(products, sortBy, filters) {
  if (filters.category !== 'All') {
    products = products.filter((product) => product.category === filters.category);
  }
  return products;
}
