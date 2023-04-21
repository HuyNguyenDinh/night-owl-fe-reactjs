import { Link as RouterLink } from 'react-router-dom';
// @mui
import PropTypes from 'prop-types';
import { Box, Link, Card, CardHeader, Typography, Stack } from '@mui/material';
// paths
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
//
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';
// import { ColorPreview } from '../../../../components/color-utils';

// ----------------------------------------------------------------------

EcommerceLatestProducts.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function EcommerceLatestProducts({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

ProductItem.propTypes = {
  product: PropTypes.shape({
    // colors: PropTypes.arrayOf(PropTypes.string),
    picture: PropTypes.string,
    name: PropTypes.string,
    sold_amount: PropTypes.number,
    id: PropTypes.any,
    min_price: PropTypes.any,
  }),
};

function ProductItem({ product }) {

  const { name, picture, id } = product;

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Image alt={name} src={picture} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />

      <Box sx={{ flexGrow: 1, minWidth: 200 }}>
        <Link to={PATH_DASHBOARD.eCommerce.view(id)} component={RouterLink} sx={{ color: 'text.primary', typography: 'subtitle2' }}>{name}</Link>

        <Stack direction="column">
          <Typography variant="body2" sx={{ color: 'success.main' }}>
            Sold amount: {product.sold_amount}
          </Typography>
          <Typography variant='body2' sx={{ color: 'error.main' }}>
            Min price: {fCurrency(Number(product.min_price))}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
