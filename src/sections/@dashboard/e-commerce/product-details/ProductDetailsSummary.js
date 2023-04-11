import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// form
import { 
  // Controller, 
  useForm 
} from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Stack, Button, Rating, Divider, IconButton, Typography, Avatar } from '@mui/material';
// redux
import { useDispatch } from 'react-redux';
import { buyOptionNow, startLoading, hasError } from '../../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import SocialsButton from '../../../../components/SocialsButton';
import { FormProvider, RHFSelect } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

ProductDetailsSummary.propTypes = {
  cart: PropTypes.array,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    option_set: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        picture_set: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number,
            image: PropTypes.string,
          })
        ),
        price: PropTypes.any,
        unit_in_stock: PropTypes.number,
      })
    ),
    is_available: PropTypes.bool,
    sold_amount: PropTypes.number,
    picture: PropTypes.string,
    description: PropTypes.any,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.any,
        name: PropTypes.string,
      })
    ),
    avg_rating: PropTypes.number,
    ratings: PropTypes.any,
    totalRatings: PropTypes.any,
    owner: PropTypes.any,
  }),
};

export default function ProductDetailsSummary({ cart, product, onAddCart, onGotoStep, ...other }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [currentOption, setCurrentOption] = useState(
    product.option_set.filter((elm) => elm.unit_in_stock > 0)[0] || product.option_set[0]
  );

  const alreadyOption = cart.map((item) => item.product_option.id).includes(currentOption.id);

  const isMaxQuantity = cart.filter((item) => item.id === product.id).map((item) => item.quantity)[0] >= currentOption?.unit_in_stock;

  const methods = useForm({
    defaultValues: {
      id: currentOption.id,
      quantity: 1,
    },
  });

  const { watch, setValue, handleSubmit, reset } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      await dispatch(startLoading());
      if (!alreadyOption) {
        await dispatch(buyOptionNow(currentOption.id, values.quantity));
        onGotoStep(1);
      }
      else {
        onAddCart({
          ...data,
        });
      }
      navigate(PATH_DASHBOARD.eCommerce.checkout);
    } catch (error) {
      console.error(error);
      dispatch(hasError());
    }
  };

  const handleAddCart = () => {
    try {
      onAddCart({
        ...values,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeOption = (optionId) => {
    setCurrentOption(product.option_set.find((elm) => elm.id === Number(optionId)));
  };

  useEffect(() => {
    const defaultOption = product.option_set.find((elm) => elm.unit_in_stock > 0) || product.option_set[0]
    setCurrentOption(defaultOption);
    setValue("id", defaultOption.id);
    return () => reset({ id: '', quantity: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    setValue("id", currentOption.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOption])

  return (
    <RootStyle {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" paragraph>
          {product.name}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Rating value={product.avg_rating} precision={0.1} readOnly />
          {product.totalRatings && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ({fShortenNumber(product.avg_rating)}
              product.totalRatings)
            </Typography>
          )}
        </Stack>

        <Typography color="primary" variant="h4" sx={{ mb: 3 }}>
          &nbsp;{fCurrency(currentOption.price)} ₫
        </Typography>

        <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack display="flex" direction="row" margin="4vh 0" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack display="flex" direction="row" spacing={2} alignItems="center">
              <Link to={PATH_DASHBOARD.user.store(product.owner.id)} component={RouterLink}>
                <Avatar src={product.owner.avatar}/>
              </Link>
              <Typography variant="subtitle1" color="text.secondary">
                {[product.owner.first_name, product.owner.last_name].join(" ")}
              </Typography>
            </Stack>   
            <Link to={PATH_DASHBOARD.user.store(product.owner.id)} component={RouterLink}>
              <Button variant="outlined">
                Visit Store
              </Button>
            </Link>         
          </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Options
          </Typography>

          <RHFSelect
            name="id"
            size="small"
            fullWidth={false}
            FormHelperTextProps={{
              sx: { textAlign: 'right', margin: 0, mt: 1 },
            }}
            value={currentOption.id}
            onChange={(e) => handleChangeOption(e.target.value)}
          >
            {product.option_set.map((option) => (
              <option key={option.id} value={option.id}>
                {option.unit}
              </option>
            ))}
          </RHFSelect>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Quantity
          </Typography>

          <div>
            <Incrementer
              name="quantity"
              quantity={values.quantity}
              available={currentOption?.unit_in_stock}
              onIncrementQuantity={() => setValue('quantity', values.quantity + 1)}
              onDecrementQuantity={() => setValue('quantity', values.quantity - 1)}
            />
            <Typography variant="caption" component="div" sx={{ mt: 1, textAlign: 'right', color: 'text.secondary' }}>
              Available: {currentOption?.unit_in_stock}
            </Typography>
          </div>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
          <Button
            fullWidth
            disabled={isMaxQuantity}
            size="large"
            color="warning"
            variant="contained"
            startIcon={<Iconify icon={'ic:round-add-shopping-cart'} />}
            onClick={handleAddCart}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add to Cart
          </Button>

          <Button fullWidth size="large" type="submit" variant="contained">
            Buy Now
          </Button>
        </Stack>

        <Stack alignItems="center" sx={{ mt: 3 }}>
          <SocialsButton initialColor />
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrementQuantity: PropTypes.func,
  onDecrementQuantity: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrementQuantity, onDecrementQuantity }) {
  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'grey.50032',
      }}
    >
      <IconButton size="small" color="inherit" disabled={quantity <= 1} onClick={onDecrementQuantity}>
        <Iconify icon={'eva:minus-fill'} width={14} height={14} />
      </IconButton>

      <Typography variant="body2" component="span" sx={{ width: 40, textAlign: 'center' }}>
        {quantity}
      </Typography>

      <IconButton size="small" color="inherit" disabled={quantity >= available} onClick={onIncrementQuantity}>
        <Iconify icon={'eva:plus-fill'} width={14} height={14} />
      </IconButton>
    </Box>
  );
}
