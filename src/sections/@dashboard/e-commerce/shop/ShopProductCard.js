import PropTypes from 'prop-types';
// import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack, Rating, Divider } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
// import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
// import { ColorPreview } from '../../../../components/color-utils';

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  // const { name, cover, price, colors, status, priceSale } = product;
  const { id, name, picture, status, priceSale } = product;

  const linkTo = PATH_DASHBOARD.eCommerce.view(id);

  const handleNumberToCurrency = (value) => {
    const temp = [];
    while(value >= 1000) {
        temp.unshift(value % 1000);
        value = Math.floor(value/1000);
    }
    temp.unshift(value);
    const result = temp.map((element) => { 
        if (element !== 0) {
            return element.toString();
        }
        return "000";
    });
    return result.join(".");
  }

  return (
    <Card>
      <Link to={linkTo} color="inherit" component={RouterLink}>
      <Box sx={{ position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <Image alt={name} src={picture} ratio="1/1" />
      </Box>
      </Link>
      
      <Stack spacing={2} sx={{ p: 1.2 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle1" noWrap>
            {name}
          </Typography>
        </Link>

        <Stack direction="row" spacing={0.6} justifyContent="flex-start" alignItems="center">
          <Rating size='small' value={product.avg_rating} precision={0.1} readOnly />
          <Divider flexItem orientation="vertical" />
          <Typography variant='body2' color="default">
            {product.sold_amount} sold
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}

          <Stack direction="row" spacing={0.5}>
            {/* {priceSale && (
              <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                {handleNumberToCurrency(priceSale)} ₫
              </Typography>
            )} */}

            <Typography color="primary" variant="h5">{handleNumberToCurrency(product.min_price)} ₫</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
