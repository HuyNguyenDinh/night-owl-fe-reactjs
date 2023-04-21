// @mui
import PropTypes from 'prop-types';
import { Button, Card, Typography, Stack } from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

EcommerceCurrentBalance.propTypes = {
  title: PropTypes.string,
  currentBalance: PropTypes.number,
  // sentAmount: PropTypes.number,
  sx: PropTypes.any,
};

export default function EcommerceCurrentBalance({ title, currentBalance, sx, ...other }) {
  // const totalAmount = currentBalance - sentAmount;

  return (
    <Card sx={{ p: 2.6, ...sx }} {...other}>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>

      <Stack spacing={1}>
        <Typography variant="subtitle1">{fCurrency(currentBalance)}</Typography>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Your Current Balance
          </Typography>
          <Typography variant="body2">{fCurrency(currentBalance)}</Typography>
        </Stack>

        {/* <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Sent Amount
          </Typography>
          <Typography variant="body2">- {fCurrency(sentAmount)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Total Amount
          </Typography>
          <Typography variant="subtitle1">{fCurrency(totalAmount)}</Typography>
        </Stack> */}

        <Stack direction="row" spacing={1.5}>
          <Button fullWidth size='small' variant="contained" color="warning">
            Transfer
          </Button>

          <Button fullWidth size='small' variant="contained">
            Receive
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
