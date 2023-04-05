import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import PendingIcon from '@mui/icons-material/Pending';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
// utils
import { fDate } from '../../../../utils/formatTime';
import createAvatar from '../../../../utils/createAvatar';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

const PAYMENT_REF = {
  0: "COD",
  1: "E-WALLET",
  2: "NOMC"
}

const STATUS_REF = {
  0: "Uncheckout",
  1: "Approving",
  2: "Shipping",
  3: "Completed",
  4: "Canceled"
}

InvoiceTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
};

export default function InvoiceTableRow({ row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow, onAccept, onReject }) {
  const theme = useTheme();

  // eslint-disable-next-line camelcase
  const { id, cost, customer, completed_date, order_date, payment_type, status, total_shipping_fee} = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {customer.avatar ? (
          <Avatar alt={[customer.first_name, customer.last_name].join(" ")} sx={{ mr: 2 }} src={customer.avatar} />
        ):
          <Avatar alt={[customer.first_name, customer.last_name].join(" ")} color={createAvatar(customer.first_name).color} sx={{ mr: 2 }}>
            {createAvatar(customer.first_name).name}
          </Avatar>
        }


        <Stack>
          <Typography variant="subtitle2" noWrap>
            {[customer.first_name, customer.last_name].join(" ")}
          </Typography>

          <Link noWrap variant="body2" onClick={onViewRow} sx={{ color: 'text.disabled', cursor: 'pointer' }}>
            Order - {id}
          </Link>
        </Stack>
      </TableCell>

      <TableCell align="left">{fDate(order_date)}</TableCell>

      <TableCell align="left">{fDate(completed_date)}</TableCell>

      <TableCell align="center">{fCurrency(cost)}</TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (status === 1 && 'warning') ||
              (status === 2 && 'info') ||
              (status === 3 && 'success') ||
              (status === 4 && 'error') ||
              'default'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {STATUS_REF[status]}
          </Label>
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            // eslint-disable-next-line camelcase
            (payment_type === 0 && 'warning') ||
            // eslint-disable-next-line camelcase
            (payment_type === 1 && 'success') ||
            // eslint-disable-next-line camelcase
            (payment_type === 2 && 'info') ||
            'default'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          
          {
            // eslint-disable-next-line camelcase
            PAYMENT_REF[payment_type]
          }
        </Label>
      </TableCell>

      <TableCell sx={{textAlign: "center"}}>
        {status === 1 &&
          <Stack direction="row" justifyContent="space-between">
            <IconButton onClick={onAccept}>
              <CheckIcon color='success' />
            </IconButton>
            <IconButton onClick={onReject}>
              <ClearIcon color='error' />
            </IconButton>
          </Stack>
        }
        {status === 0 && (
          <ModeEditIcon color="default" />
        )}
        {status === 2 && (
          <PendingIcon color='info' />
        )}
        {status === 3 && (
          <CheckIcon color='success' />
        )}
        {status === 4 && (
          <ClearIcon color='error' />
        )}
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
              <MenuItem
                onClick={() => {
                  onViewRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                View
              </MenuItem>
          }
        />
      </TableCell>
    </TableRow>
  );
}
