import sumBy from 'lodash/sumBy';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  TableRow,
  TableCell,
  Typography
} from '@mui/material';
// utils
import axiosInstance from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _invoices } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableNoData, TableEmptyRows, TableHeadCustom, TableSelectedActions } from '../../components/table';
// sections
import InvoiceAnalytic from '../../sections/@dashboard/invoice/InvoiceAnalytic';
import { InvoiceTableRow, InvoiceTableToolbar } from '../../sections/@dashboard/invoice/list';

// ----------------------------------------------------------------------

const PAYMENT_TYPE = [
  'all',
  'Cash on Delivery',
  'E-Wallet'
];

const TABLE_HEAD = [
  { id: 'customer', label: 'Customer', align: 'left' },
  { id: 'orderDate', label: 'Order Date', align: 'left' },
  { id: 'completedDate', label: 'Completed', align: 'left' },
  { id: 'cost', label: 'cost', align: 'center', width: 140 },
  { id: 'payment', label: 'Payment', align: 'center', width: 140 },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function InvoiceList() {
  const theme = useTheme();

  const { themeStretch } = useSettings();

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
  } = useTable({ defaultOrderBy: 'createDate' });

  const [orders, setOrders] = useState([]);

  const [tableData, setTableData] = useState(_invoices);

  const [nextPage, setNextPage] = useState('');

  const [analyticOrders, setAnalyticOrders] = useState([
    {status: 1, total_child_price_sum: 0, order_amount: 0},
    {status: 2, total_child_price_sum: 0, order_amount: 0},
    {status: 3, total_child_price_sum: 0, order_amount: 0},
    {status: 4, total_child_price_sum: 0, order_amount: 0},
    {status: 5, total_child_price_sum: 0, order_amount: 0}
  ]);

  // const [filterName, setFilterName] = useState('');

  const [filterPayment, setfilterPayment] = useState('all');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  // const handleFilterName = (filterName) => {
  //   setFilterName(filterName);
  //   setPage(0);
  // };

  const handlefilterPayment = (event) => {
    setfilterPayment(event.target.value);
  };

  // const handleDeleteRow = (id) => {
  //   const deleteRow = tableData.filter((row) => row.id !== id);
  //   setSelected([]);
  //   setTableData(deleteRow);
  // };

  // const handleDeleteRows = (selected) => {
  //   const deleteRows = tableData.filter((row) => !selected.includes(row.id));
  //   setSelected([]);
  //   setTableData(deleteRows);
  // };

  // const handleEditRow = (id) => {
  //   navigate(PATH_DASHBOARD.invoice.edit(id));
  // };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.invoice.view(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    // filterName,
    filterPayment,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const isNotFound =
    // (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterPayment) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const denseHeight = dense ? 56 : 76;

  // const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const getLengthByStatus = (status) => analyticOrders.filter((item) => item.status === status).order_amount;


  const getTotalPriceByStatus = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalPrice'
    );

  const getPercentByStatus = (status) => (getLengthByStatus(status) / tableData.length) * 100;

  // const TABS = [
  //   { value: 'all', label: 'All', color: 'info', count: tableData.length },
  //   { value: 'paid', label: 'Paid', color: 'success', count: getLengthByStatus('paid') },
  //   { value: 'unpaid', label: 'Unpaid', color: 'warning', count: getLengthByStatus('unpaid') },
  //   { value: 'overdue', label: 'Overdue', color: 'error', count: getLengthByStatus('overdue') },
  //   { value: 'draft', label: 'Draft', color: 'default', count: getLengthByStatus('draft') },
  // ];

  const TABS = [
    { value: 'all', label: 'All', color: 'default', count: getLengthByStatus(5) },
    { value: 'pending', label: 'Pending', color: 'warning', count: getLengthByStatus(1) },
    { value: 'shipping', label: 'Shipping', color: 'info', count: getLengthByStatus(2) },
    { value: 'Completed', label: 'Completed', color: 'success', count: getLengthByStatus(3) },
    { value: 'Canceled', label: 'Canceled', color: 'error', count: getLengthByStatus(4) },
  ];

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axiosInstance.get("/market/orders/?state=1");
        setOrders(response.data.results);
        if (response.data.next) {
          setNextPage(response.data.next);
        };
        const resp = await axiosInstance.get("/market/orders/count-order/?state=1");
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
    getOrders();
  }, [orders, analyticOrders])

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
          // action={
          //   <Button
          //     variant="contained"
          //     component={RouterLink}
          //     to={PATH_DASHBOARD.invoice.new}
          //     startIcon={<Iconify icon={'eva:plus-fill'} />}
          //   >
          //     New Invoice
          //   </Button>
          // }
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
                total={getLengthByStatus(5)}
                percent={100}
                price={sumBy(tableData, 'totalPrice')}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />
              <InvoiceAnalytic
                title="Completed"
                total={getLengthByStatus(3)}
                percent={getPercentByStatus('paid')}
                price={getTotalPriceByStatus('paid')}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.success.main}
              />
              <InvoiceAnalytic
                title="Pending"
                total={getLengthByStatus(1)}
                percent={getPercentByStatus('unpaid')}
                price={getTotalPriceByStatus('unpaid')}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />
              <InvoiceAnalytic
                title="Overdue"
                total={getLengthByStatus(4)}
                percent={getPercentByStatus('overdue')}
                price={getTotalPriceByStatus('overdue')}
                icon="eva:bell-fill"
                color={theme.palette.error.main}
              />
              {/* <InvoiceAnalytic
                title="Draft"
                total={getLengthByStatus('draft')}
                percent={getPercentByStatus('draft')}
                price={getTotalPriceByStatus('draft')}
                icon="eva:file-fill"
                color={theme.palette.text.secondary}
              /> */}
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                icon={<Label color={tab.color}> {tab.count} </Label>}
                label={tab.label}
              />
            ))}
          </Tabs>

          <Divider />

          <InvoiceTableToolbar
            // filterName={filterName}
            filterPayment={filterPayment}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            // onFilterName={handleFilterName}
            onfilterPayment={handlefilterPayment}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
            paymentTypes={PAYMENT_TYPE}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Stack spacing={1} direction="row">
                      {/* <Tooltip title="Sent">
                        <IconButton color="primary">
                          <Iconify icon={'ic:round-send'} />
                        </IconButton>
                      </Tooltip> */}

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

                      {/* <Tooltip title="Delete">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip> */}
                    </Stack>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {/* {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <InvoiceTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))} */}

                  {(orders && orders.length > 0) && orders.map((row) => (
                    <InvoiceTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      // onEditRow={() => handleEditRow(row.id)}
                      // onDeleteRow={() => handleDeleteRow(row.id)}
                    />
                  ))}
                  {(!orders || orders.length === 0) &&
                  (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography variant="subtitle2" textAlign="center">No Orders</Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} /> */}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            {/* <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            /> */}

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  // filterName,
  filterStatus,
  // filterPayment,
  filterStartDate,
  filterEndDate,
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  // if (filterName) {
  //   tableData = tableData.filter(
  //     (item) =>
  //       item.invoiceNumber.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
  //       item.invoiceTo.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
  //   );
  // }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  // if (filterPayment !== 'all') {
  //   tableData = tableData.filter((item) => item.items.some((c) => c.service === filterPayment));
  // }

  if (filterStartDate && filterEndDate) {
    tableData = tableData.filter(
      (item) =>
        item.createDate.getTime() >= filterStartDate.getTime() && item.createDate.getTime() <= filterEndDate.getTime()
    );
  }

  return tableData;
}
