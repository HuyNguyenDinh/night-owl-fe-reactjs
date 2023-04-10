// import sumBy from 'lodash/sumBy';
import sum from 'lodash/sum';
import { useState, useEffect } from 'react';
import { 
  // Link as RouterLink, 
  useNavigate,
  useLocation
} from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Switch,
  // Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  // TablePagination,
  FormControlLabel,
  TableRow,
  TableCell,
  Typography
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// utils
import axiosInstance from '../../utils/axios';
import { kFormat } from '../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// _mock_
// import { _invoices } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableHeadCustom, TableSelectedActions, TableSkeleton } from '../../components/table';
// sections
import InvoiceAnalytic from '../../sections/@dashboard/invoice/InvoiceAnalytic';
import { InvoiceTableRow, InvoiceTableToolbar } from '../../sections/@dashboard/invoice/list';

// ----------------------------------------------------------------------

const PAYMENT_TYPE = [
  'all',
  'Cash on Delivery',
  'E-Wallet',
  'Point'
];

const PAYMENT_TYPE_REF = {
  'all': -1,
  'Cash on Delivery': 0,
  'E-Wallet': 1,
  'Point': 2
}

const STATUS_REF = {
  "approving": 1,
  "shipping": 2,
  "completed": 3,
  "canceled": 4
}

// ----------------------------------------------------------------------

export default function InvoiceList() {
  const theme = useTheme();

  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const isShopping = pathname.includes('shopping');

  const state = isShopping ? 0 : 1;

  const location = useLocation().search;

  const status = new URLSearchParams(location).get("status") || "all";

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const {
    dense,
    // page,
    order,
    orderBy,
    // rowsPerPage,
    // setPage,
    //
    selected,
    // setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'orderDate' });

  const [orders, setOrders] = useState([]);

  const { user } = useAuth();

  const [previousPage, setPreviousPage] = useState('');
  const [nextPage, setNextPage] = useState('');

  const [analyticOrders, setAnalyticOrders] = useState([
    {status: 1, total_child_price_sum: 0, order_amount: 0},
    {status: 2, total_child_price_sum: 0, order_amount: 0},
    {status: 3, total_child_price_sum: 0, order_amount: 0},
    {status: 4, total_child_price_sum: 0, order_amount: 0},
  ]);

  const [filterPayment, setfilterPayment] = useState('all');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(status);


  const TABLE_HEAD = [
    { id: isShopping ? 'store' : 'customer', label: isShopping ? 'Store' : 'Customer', align: 'center' },
    { id: 'orderDate', label: 'Created', align: 'left' },
    { id: 'completedDate', label: 'Completed', align: 'left' },
    { id: 'shippingFee', label: 'Shipping', align: 'center'},
    { id: 'cost', label: 'cost', align: 'center', width: 140 },
    { id: 'status', label: 'Status', align: 'center', width: 100 },
    { id: 'payment', label: 'Payment', align: 'center' },
    { id: 'action', label: 'Action', align: 'center'},
    { id: '' },
  ];

  const handlefilterPayment = (event) => {
    setfilterPayment(event.target.value);
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.invoice.view(id));
  };

  const getLengthByStatus = (status) => analyticOrders.find((item) => item.status === status).order_amount;
  const getTotalLength = () => sum(analyticOrders.map((item) => item.order_amount));

  const getTotalPriceByStatus = (status) => analyticOrders.find((item) => item.status === status).total_child_price_sum;
  const getTotalPrice = () => sum(analyticOrders.map((item) => item.total_child_price_sum));

  const getPercentByStatus = (status) => (getLengthByStatus(status) / getTotalLength()) * 100;

  const TABS = [
    { value: 'approving', label: 'Approving', color: 'warning', status: 1 },
    { value: 'shipping', label: 'Shipping', color: 'info', status: 2 },
    { value: 'completed', label: 'Completed', color: 'success', status: 3 },
    { value: 'canceled', label: 'Canceled', color: 'error', status: 4 },
  ];

  const getOrders = async (url) => {
    try {
      const response = await axiosInstance.get(url);
      setOrders(response.data.results);
      if (response.data.next) {
        setNextPage(response.data.next);
      }
      else {
        setNextPage('');
      }
      if (response.data.previous) {
        setPreviousPage(response.data.previous);
      }
      else {
        setPreviousPage('');
      }
      setIsLoading(false);
    }
    catch(error) {
      console.log(error);
    }
  };

  const handleFilterStatus = (event, newValue) => {
    onFilterStatus(event, newValue);

    let url = `/market/orders/?state=${state}`;
    if (newValue !== "all") {
      url = url.concat(`&status=${STATUS_REF[newValue]}`);
    }
    setIsLoading(true);
    getOrders(url);
  }

  const onApplyFilter = async () => {
    let url = `/market/orders/?state=${state}`;
    if (PAYMENT_TYPE_REF[filterPayment] >= 0) {
      url = url.concat(`&payment_type=${PAYMENT_TYPE_REF[filterPayment]}`);
    }
    if (filterStartDate) {
      url = url.concat(`&order_date__gte=${filterStartDate.toISOString().slice(0, 10)}`);
    }
    if (filterEndDate) {
      url = url.concat(`&completed_date__lte=${filterEndDate.toISOString().slice(0, 10)}`);
    }
    if (filterStatus !== "all") {
      url = url.concat(`&status=${STATUS_REF[filterStatus]}`);
    }
    setIsLoading(true);
    getOrders(url);
  }

  const onAccept = async (orderID) => {
    try {
      const response = await axiosInstance.get(`/market/orders/${orderID}/accept_order/`);
      let newOrders = orders.filter((item) => item.id !== orderID);
      newOrders = [...newOrders, response.data];
      setOrders(newOrders);
    }
    catch (error) {
      console.log(error);
    }
  }

  const onReject = async (orderID) => {
    try {
      const response = await axiosInstance.get(`/market/orders/${orderID}/cancel_order/`);
      let newOrders = orders.filter((item) => item.id !== orderID);
      newOrders = [...newOrders, response.data];
      setOrders(newOrders);
    }
    catch (error) {
      console.log(error);
    }
  }

  const onNextPage = () => {
    setIsLoading(true);
    getOrders(nextPage);
  }

  const onPreviousPage = () => {
    setIsLoading(true);
    getOrders(previousPage);
  }

  useEffect(() => {
    let url = `/market/orders/?state=${state}`;
    if (filterStatus !== "all") {
      url = url.concat(`&status=${STATUS_REF[filterStatus]}`);
    }
    setIsLoading(true);
    getOrders(url);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    const initData = async () => {
      try {
        const resp = await axiosInstance.get(`/market/orders/count-order/?state=${state}`);
        if (resp.data.analytics) {
          const statusAnalytic = resp?.data.analytics.map((elm) => elm.status);
          const newAnalytic = [...analyticOrders.filter((elm) => !statusAnalytic.includes(elm.status)), ...resp.data.analytics]
          setAnalyticOrders(newAnalytic);
        };
      }
      catch(error) {
        console.log(error);
      }
    };
    initData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, orders])

  return (
    <Page title="Invoice: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Invoice List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Invoices', href: PATH_DASHBOARD.invoice.root },
            { name: 'List' },
          ]}
        />

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="Total"
                total={getTotalLength()}
                percent={100}
                price={kFormat(getTotalPrice())}
                icon="ic:round-receipt"
                color={theme.palette.text.secondary}
              />
              <InvoiceAnalytic
                title="Approving"
                total={getLengthByStatus(1)}
                percent={getPercentByStatus(1)}
                price={kFormat(getTotalPriceByStatus(1))}
                icon="eva:bell-fill"
                color={theme.palette.warning.main}
              />
              <InvoiceAnalytic
                title="Shipping"
                total={getLengthByStatus(2)}
                percent={getPercentByStatus(2)}
                price={kFormat(getTotalPriceByStatus(2))}
                icon="eva:clock-fill"
                color={theme.palette.info.main}
              />
              <InvoiceAnalytic
                title="Completed"
                total={getLengthByStatus(3)}
                percent={getPercentByStatus(3)}
                price={kFormat(getTotalPriceByStatus(3))}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.success.main}
              />
              <InvoiceAnalytic
                title="Canceled"
                total={getLengthByStatus(4)}
                percent={getPercentByStatus(4)}
                price={kFormat(getTotalPriceByStatus(4))}
                icon="material-symbols:cancel"
                color={theme.palette.error.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            <Tab
                disableRipple
                key="all"
                value="all"
                icon={<Label color="default"> {getTotalLength()} </Label>}
                label="Total"
              />
            {TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                icon={<Label color={tab.color}> {getLengthByStatus(tab.status)} </Label>}
                label={tab.label}
              />
            ))}
          </Tabs>

          <Divider />

          <InvoiceTableToolbar
            filterPayment={filterPayment}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onfilterPayment={handlefilterPayment}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
            paymentTypes={PAYMENT_TYPE}
            onApplyFilter={onApplyFilter}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={orders.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      orders.map((row) => row.id)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
                      <Tooltip title="Download">
                        <IconButton color="primary">
                          <Iconify icon={'eva:download-outline'} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Print">
                        <IconButton color="primary">
                          <Iconify icon={'eva:printer-fill'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orders.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      orders.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {isLoading && (
                    <>
                      <TableSkeleton />
                      <TableSkeleton />
                      <TableSkeleton />
                      <TableSkeleton />
                      <TableSkeleton />
                    </>
                  )}
                  {(orders && orders.length > 0 && !isLoading) && orders.map((row) => (
                    <InvoiceTableRow
                      isShopping={isShopping}
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onAccept={() => onAccept(row.id)}
                      onReject={() => onReject(row.id)}
                    />
                  ))}

                  {(!orders || orders.length === 0) && !isLoading &&
                  (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <Typography variant="subtitle2" textAlign="center">No Orders</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative', p: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <div>
                <FormControlLabel
                  control={<Switch checked={dense} onChange={onChangeDense} />}
                  label="Dense"
                  sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
                />
              </div>
              
              <Stack direction="row">
                <IconButton onClick={onPreviousPage} disabled={previousPage === ""}><ArrowBackIosNewIcon /></IconButton>
                <IconButton onClick={onNextPage} disabled={nextPage === ""}><ArrowForwardIosIcon /></IconButton>
              </Stack>
            </Stack>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
