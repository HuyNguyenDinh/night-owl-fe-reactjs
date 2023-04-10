import PropTypes from 'prop-types';
import {Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
  Avatar, 
  Stack,
  Link
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
import createAvatar from '../../../../utils/createAvatar';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

const STATUS_REF = {
  0: "UnCheckout",
  1: "Approving",
  2: "Shipping",
  3: "Completed",
  4: "Canceled"
}

InvoiceDetails.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default function InvoiceDetails({ invoice }) {
  const theme = useTheme();

  if (!invoice) {
    return null;
  }

  // const {
  //   items,
  //   taxes,
  //   status,
  //   dueDate,
  //   discount,
  //   invoiceTo,
  //   createDate,
  //   totalPrice,
  //   invoiceFrom,
  //   invoiceNumber,
  //   subTotalPrice,
  // } = invoice;

  const {
    id,
    cost,
    status,
    customer,
    store
  } = invoice;

  return (
    <>
      {/* <InvoiceToolbar invoice={invoice} /> */}

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Image disabledEffect visibleByDefault alt="logo" src="/logo/logo_full.svg" sx={{ maxWidth: 120 }} />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (status === 1 && 'warning') ||
                  (status === 2 && 'info') ||
                  (status === 3 && 'success') ||
                  (status === 4 && 'error') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {STATUS_REF[status]}
              </Label>

              <Typography variant="h6">{`Order-${id}`}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Store
            </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {store.avatar ? (
                  <Avatar alt={[store.first_name, store.last_name].join(" ")} sx={{ mr: 2 }} src={store.avatar} />
                ):
                  <Avatar alt={[store.first_name, store.last_name].join(" ")} color={createAvatar(store.first_name).color} sx={{ mr: 2 }}>
                    {createAvatar(store.first_name).name}
                  </Avatar>
                }
                <Link to={PATH_DASHBOARD.user.store(store.id)} color="text.primary" component={RouterLink}>
                  <Typography variant="body2">{[store.first_name, store.last_name].join(" ")}</Typography>
                </Link>
              </Stack>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Customer
            </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {customer.avatar ? (
                  <Avatar alt={[customer.first_name, customer.last_name].join(" ")} sx={{ mr: 2 }} src={customer.avatar} />
                ):
                  <Avatar alt={[customer.first_name, customer.last_name].join(" ")} color={createAvatar(customer.first_name).color} sx={{ mr: 2 }}>
                    {createAvatar(customer.first_name).name}
                  </Avatar>
                }
                <Link to={PATH_DASHBOARD.user.store(customer.id)} color="text.primary" component={RouterLink}>
                  <Typography variant="body2">{[customer.first_name, customer.last_name].join(" ")}</Typography>
                </Link>
              </Stack>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              date create
            </Typography>
              <Typography variant="body2">{fDate(invoice.order_date)}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Due date
            </Typography>
            <Typography variant="body2">{invoice.completed_data ?fDate(invoice.completed_data) : "Not completed"}</Typography>
          </Grid>
        </Grid>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 960 }}>
            <Table>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left">Quantity</TableCell>
                  <TableCell align="right">Unit price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {invoice.orderdetail_set.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    {/* <TableCell>{index + 1}</TableCell> */}
                    <TableCell>
                      <Link to={PATH_DASHBOARD.eCommerce.view(row.product_option.base_product.id)} color="text.primary" component={RouterLink}>
                        <Avatar src={row.product_option.base_product.picture} />
                      </Link>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Link to={PATH_DASHBOARD.eCommerce.view(row.product_option.base_product.id)} color="text.primary" component={RouterLink}>
                          <Typography variant="subtitle2">{row.product_option.base_product.name}</Typography>
                        </Link>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          {row.product_option.unit}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="right">{fCurrency(row.unit_price)}</TableCell>
                    <TableCell align="right">{fCurrency(row.unit_price * row.quantity)}</TableCell>
                  </TableRow>
                ))}

                {/* <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Box sx={{ mt: 2 }} />
                    <Typography>Value</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Box sx={{ mt: 2 }} />
                    <Typography>{fCurrency(subTotalPrice)}</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography>Discount</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Typography sx={{ color: 'error.main' }}>{discount && fCurrency(-discount)}</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography>Taxes</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Typography>{taxes && fCurrency(taxes)}</Typography>
                  </TableCell>
                </RowResultStyle> */}
                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography variant="body2">Shipping</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Typography variant="body2">{fCurrency(Number(invoice.total_shipping_fee))}</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography variant="h6">Total</Typography>
                  </TableCell>
                  <TableCell align="right" width={140}>
                    <Typography variant="h6">{fCurrency(cost)}</Typography>
                  </TableCell>
                </RowResultStyle>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">NOTES</Typography>
            <Typography variant="body2">
              We appreciate your business. Should you need us to add VAT or extra notes let us know!
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Have a Question?</Typography>
            <Typography variant="body2">support@minimals.cc</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
