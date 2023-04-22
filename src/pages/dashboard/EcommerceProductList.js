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
  Stack,
  IconButton
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
import { ProductTableRow, ProductTableToolbar } from '../../sections/@dashboard/e-commerce/product-list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Product', align: 'left', width: 240 },
  { id: 'soldAmount', label: 'Sold', align: 'center', width: 40 },
  { id: 'isAvailable', label: 'Available', align: 'center', width: 40 },
  { id: 'price', label: 'Price', align: 'right', width: 40 },
  { id: '', width: 10 },
];

// ----------------------------------------------------------------------

export default function EcommerceProductList() {
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
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [ownProducts, setOwnProducts] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [prev, setPrev] = useState('');

  const [next, setNext] = useState('');

  // const [filterName, setFilterName] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const setData = (payload) => {
    setOwnProducts(payload.results);
    if (payload.next) {
      setNext(payload.next);
    }
    else {
      setNext('');
    }
    if (payload.previous) {
      setPrev(payload.previous);
    }
    else {
      setPrev('');
    }
  };

  const onPreviousPage = async () => {
    const response = await axiosInstance.get(prev);
    setData(response.data);
  };

  const onNextPage = async () => {
    const response = await axiosInstance.get(next);
    setData(response.data);
  }

  useEffect(() => {
    const getOwnProducts = async () => {
      const response = await axiosInstance.get(`/market/products/?owner=${user?.id}`);
      setData(response.data);
    }
    getOwnProducts();
  }, [user?.id])

  useEffect(() => {
    if (ownProducts && ownProducts.length) {
      setTableData(ownProducts);
    }
    setIsLoading(false);
  }, [ownProducts]);

  // const handleFilterName = (filterName) => {
  //   setFilterName(filterName);
  //   setPage(0);
  // };

  const handleDeleteRow = (id) => {
    const deleteProduct = async () => {
      try {
        await axiosInstance.delete(`/market/products/${id}/`);
        const deleteRow = tableData.filter((row) => row.id !== id);
        // setSelected([]);
        setTableData(deleteRow);
      }
      catch(error) {
        console.log(error);
      }
    }
    deleteProduct();
  };

  // const handleDeleteRows = (selected) => {
  //   const deleteRows = tableData.filter((row) => !selected.includes(row.id));
  //   setSelected([]);
  //   setTableData(deleteRows);
  // };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.eCommerce.edit(id));
  };

  // const dataFiltered = applySortFilter({
  //   tableData,
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  // });

  const denseHeight = dense ? 60 : 80;

  // const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);
  const isNotFound = !isLoading && !ownProducts;

  return (
    <Page title="Ecommerce: Product List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product List"
          links={[
            { name: 'Home', href: PATH_DASHBOARD.home },
            {
              name: 'Manage Products',
              href: PATH_DASHBOARD.eCommerce.list,
            },
            // { name: 'Product List' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.eCommerce.new}
            >
              New Product
            </Button>
          }
        />

        <Card>
          {/* <ProductTableToolbar filterName={filterName} onFilterName={handleFilterName} /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 960, position: 'relative' }}>
              {/* {selected.length > 0 && (
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
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )} */}

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
                  {/* {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
                  {tableData && tableData.map((row, index) =>
                    row ? (
                      <ProductTableRow
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
                    ))
                  }
                  { isNotFound && (
                    // <div>
                    //   <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />
                    //   <TableNoData isNotFound={isNotFound} />
                    // </div>
                    <TableNoData isNotFound={isNotFound} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative', p: 2 }}>
            {/* <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            /> */}
            <Stack direction="row" justifyContent="space-between">
              <div>
                <FormControlLabel
                  control={<Switch checked={dense} onChange={onChangeDense} />}
                  label="Dense"
                  sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
                />
              </div>
              <Stack direction="row">
                <IconButton onClick={onPreviousPage} disabled={prev === ""}><ArrowBackIosNewIcon /></IconButton>
                <IconButton onClick={onNextPage} disabled={next === ""}><ArrowForwardIosIcon /></IconButton>
              </Stack>
            </Stack>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

// function applySortFilter({ tableData, comparator, filterName }) {
//   const stabilizedThis = tableData.map((el, index) => [el, index]);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   tableData = stabilizedThis.map((el) => el[0]);

//   if (filterName) {
//     tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
//   }

//   return tableData;
// }
