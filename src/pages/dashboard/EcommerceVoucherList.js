// import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  Button,
  Switch,
  // Tooltip,
  TableBody,
  Container,
  // IconButton,
  TableContainer,
  // TablePagination,
  FormControlLabel,
  Typography
} from '@mui/material';
// utils
import axiosInstance from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableNoData,
  TableSkeleton,
  // TableEmptyRows,
  TableHeadCustom,
  // TableSelectedActions,
} from '../../components/table';
// sections
// import { ProductTableRow, ProductTableToolbar } from '../../sections/@dashboard/e-commerce/product-list';
import VoucherTableRow from '../../sections/@dashboard/e-commerce/voucher/VoucherTableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: "Code", align: 'left', width: 160},
  { id: 'startDate', label: "Start Date", align: 'center', width: 120},
  { id: 'endDate', label: "End Date", align: 'center', width: 120},
  { id: 'discount', label: "Value", align: 'center', width: 100},
  { id: 'isPercentage', label: "Unit", align: 'center', width: 80},
  { id: '', width: 40 },
];

// ----------------------------------------------------------------------

export default function EcommerceVoucherList() {
  const {
    dense,
    // page,
    // order,
    // orderBy,
    // rowsPerPage,
    // setPage,
    //
    // selected,
    // setSelected,
    // onSelectRow,
    // onSelectAllRows,
    //
    // onSort,
    onChangeDense,
    // onChangePage,
    // onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [ownVouchers, setOwnVouchers] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getownVouchers = async () => {
      const response = await axiosInstance.get("/market/voucher/management-list/");
      setOwnVouchers(response.data);
    }
    getownVouchers();
  }, [user?.id])

  useEffect(() => {
    if (ownVouchers.length) {
      setTableData(ownVouchers);
    }
    setIsLoading(false);
  }, [ownVouchers]);

  // const handlefilterCode = (filterCode) => {
  //   setfilterCode(filterCode);
  // };

  const handleDeleteRow = (id) => {
    const deleteProduct = async () => {
      try {
        await axiosInstance.delete(`/market/voucher/${id}/`);
        const deleteRow = tableData.filter((row) => row.id !== id);
        setTableData(deleteRow);
      }
      catch(error) {
        console.log(error);
      }
    }
    deleteProduct();
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.eCommerce.voucherDetail(id));
  };

  // const dataFiltered = applySortFilter({
  //   tableData,
  //   comparator: getComparator(order, orderBy),
  //   filterCode,
  // });

  const denseHeight = dense ? 60 : 80;

  // const isNotFound = (!dataFiltered.length && !!filterCode) || (!isLoading && !dataFiltered.length);
  const isNotFound = !isLoading && !ownVouchers;

  return (
    <Page title="Ecommerce: Voucher List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Voucher List"
          links={[
            { name: 'Home', href: PATH_DASHBOARD.home },
            {
              name: 'Manage Vouchers',
              href: PATH_DASHBOARD.eCommerce.list,
            },
            // { name: 'Product List' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.eCommerce.voucherNew}
            >
              New Voucher
            </Button>
          }
        />

        <Card>
          {/* <ProductTableToolbar filterCode={filterCode} onfilterCode={handlefilterCode} /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 960, position: 'relative' }}>

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  // order={order}
                  // orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  // numSelected={selected.length}
                  // onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {(isLoading ? [...Array(12)] : tableData)
                    // .slice(page * 12, page * 12 + 12)
                    .map((row, index) =>
                      row ? (
                        <VoucherTableRow
                          key={row.id}
                          row={row}
                          // selected={selected.includes(row.id)}
                          // onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                        />
                      ) : (
                        // !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                        <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}
                  { isNotFound && (
                    <TableNoData isNotFound={isNotFound} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
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

// function applySortFilter({ tableData, comparator, filterCode }) {
//   const stabilizedThis = tableData.map((el, index) => [el, index]);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   tableData = stabilizedThis.map((el) => el[0]);

//   if (filterCode) {
//     tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterCode.toLowerCase()) !== -1);
//   }

//   return tableData;
// }
