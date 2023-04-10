// import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Card,
  Stack,
  // Button,
  Divider,
  // TextField,
  CardHeader,
  Typography,
  CardContent,
  // InputAdornment,
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// import axiosInstance from '../../../../utils/axios';
// components
// import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

CheckoutSummary.propTypes = {
  total: PropTypes.number,
  discount: PropTypes.number,
  subtotal: PropTypes.number,
  shipping: PropTypes.number,
  // onEdit: PropTypes.func,
  // enableEdit: PropTypes.bool,
  // onApplyDiscount: PropTypes.func,
  // enableDiscount: PropTypes.bool,
  // orders: PropTypes.array,
  // listVoucher: PropTypes.object,
  // setListVoucher: PropTypes.func,
};

export default function CheckoutSummary({
  total,
  // onEdit,
  discount,
  subtotal,
  shipping,
  // onApplyDiscount,
  // listVoucher,
  // setListVoucher,
  // orders,
  // enableEdit = false,
  // enableDiscount = false,
}) {
  const displayShipping = shipping !== null ? 'Free' : '-';
  // const [currentVoucher, setCurrentVoucher] = useState('');

  // const handleApplyDiscount = (voucher) => {
  //   setListVoucher([...listVoucher, voucher]);
  //   setCurrentVoucher('');
  // }

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Typography color="primary" variant='subtitle1'>Order Summary</Typography>
        }
        // action={
        //   enableEdit && (
        //     <Button size="small" onClick={onEdit} startIcon={<Iconify icon={'eva:edit-fill'} />}>
        //       Edit
        //     </Button>
        //   )
        // }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sub Total
            </Typography>
            <Typography variant="subtitle2">{fCurrency(subtotal)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Discount
            </Typography>
            <Typography variant="subtitle2">{discount ? fCurrency(-discount) : '-'}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Shipping
            </Typography>
            <Typography variant="subtitle2">{shipping ? fCurrency(shipping) : displayShipping}</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Total</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(total)}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (VAT included if applicable)
              </Typography>
            </Box>
          </Stack>

          {/* {enableDiscount && (
            <TextField
              fullWidth
              placeholder="Discount codes / Gifts"
              value={currentVoucher}
              onChange={(event) => setCurrentVoucher(event.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => handleApplyDiscount(currentVoucher)} sx={{ mr: -0.5 }}>
                      Apply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )} */}
          {/* <Typography variant='subtitle2'>
            Applied Vouchers
          </Typography>
          <Stack>
            {listVoucher && listVoucher.map((elm) => (
              <Stack key={elm} direction="row" spacing={2} justifyContent="space-between">
                <Typography variant='body2'>
                  {elm}
                </Typography>
                <Typography variant='body2'>
                  - 50%
                </Typography>
              </Stack>
            ))}
          </Stack> */}
        </Stack>
      </CardContent>
    </Card>
  );
}
