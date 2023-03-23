import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  IconButton,
  TableContainer,
  Avatar,
  Link,
  Checkbox,
  Card,
  CardHeader
} from '@mui/material';
// utils
// import getColorName from '../../../../utils/getColorName';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { TableHeadCustom } from '../../../../components/table';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { CheckedCartsContext } from './CheckoutCart';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Product' },
  { id: 'price', label: 'Price' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'totalPrice', label: 'Total Price', align: 'right' },
  { id: '' },
];

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
}));

// ----------------------------------------------------------------------

CheckoutProductList.propTypes = {
  owners: PropTypes.array,
  onDecreaseQuantity: PropTypes.func,
  onIncreaseQuantity: PropTypes.func,
};

export default function CheckoutProductList({ owners, onIncreaseQuantity, onDecreaseQuantity }) {
  
  const {checkedCarts, setCheckedCarts} = useContext(CheckedCartsContext);

  const handleCheckCart = (cartID) => {
    let updateCheckedCart = [cartID];
    if (checkedCarts) {
      if (checkedCarts.includes(cartID)) {
        updateCheckedCart = checkedCarts.filter(item => item !== cartID);
      }
      else {
        updateCheckedCart = [...checkedCarts, ...updateCheckedCart];
      }
    }
    setCheckedCarts(updateCheckedCart);
  }

  return (
    <>
    {owners && owners.map((owner) => (
      <Card key={owner.id} sx={{ mb: 3, marginTop: "5vh" }}>
        <CardHeader
          title={
            <Stack display="flex" direction="row" justifyContent="space-between">
              <Link to={PATH_DASHBOARD.eCommerce.shopProduct(owner.id)} component={RouterLink}>
                <Stack spacing={2} direction="row" alignItems="center">
                  <Avatar src={owner.avatar} />
                  <Typography variant="h6">
                    {[owner.last_name, owner.first_name].join(" ")}
                  </Typography>
                </Stack>
              </Link>
            </Stack>
          }
          sx={{ mb: 3 }}
        />
        <TableContainer sx={{ minWidth: 720}}>
          
          <Table>
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>
              {owner.carts.map((row) => (
                  <CheckoutProductListRow
                      key={row.id}
                      row={row}
                      onDecrease={() => onDecreaseQuantity("update", row.id, row.quantity - 1)}
                      onIncrease={() => onIncreaseQuantity("update", row.id, row.quantity + 1)}
                      onCheck={handleCheckCart}
                    />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    ))}
    </>
  )}

// ----------------------------------------------------------------------

CheckoutProductListRow.propTypes = {
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
  row: PropTypes.shape({
    product_option: PropTypes.object,
    id: PropTypes.any,
    quantity: PropTypes.number,
  }),
  onCheck: PropTypes.func,
};

function CheckoutProductListRow({ row, onDecrease, onIncrease, onCheck }) {
  const { quantity } = row;

  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>

        <Image alt="product image" src={row.product_option.base_product.picture} sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }} />

        <Stack spacing={0.5}>
          <Link to={`/dashboard/e-commerce/product/${row.product_option.base_product.id}/`} component={RouterLink}>
            <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
              {row.product_option.base_product.name}
            </Typography>
          </Link>

          {/* <Stack direction="row" alignItems="center"> */}
            <Typography variant="body2">
              <Box component="span" sx={{ color: 'text.secondary' }}>
                option:&nbsp;
              </Box>
              {row.product_option.unit}
            </Typography>
        </Stack>
      </TableCell>
      <TableCell>{fCurrency(Number(row.product_option.price))}</TableCell>

      <TableCell>
        <Incrementer quantity={quantity} available={row.product_option.unit_in_stock} onDecrease={onDecrease} onIncrease={onIncrease} />
      </TableCell>

      <TableCell align="right">{fCurrency(row.product_option.price * quantity)}</TableCell>

      <TableCell align="right">
        {/* <IconButton onClick={onDelete}>
          <Iconify icon={'eva:trash-2-outline'} width={20} height={20} />
        </IconButton> */}
        <Checkbox value={row.id} onChange={() => onCheck(row.id)} />
      </TableCell>
    </TableRow>
  );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrease: PropTypes.func,
  onDecrease: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrease, onDecrease }) {

  return (
    <Box sx={{ width: 96, textAlign: 'right' }}>
      <IncrementerStyle>
        <IconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <Iconify icon={'eva:minus-fill'} width={16} height={16} />
        </IconButton>

        {quantity}

        <IconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
          <Iconify icon={'eva:plus-fill'} width={16} height={16} />
        </IconButton>
        
      </IncrementerStyle>

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        available: {available}
      </Typography>
    </Box>
  );
}
