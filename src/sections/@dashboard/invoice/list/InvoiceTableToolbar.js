import PropTypes from 'prop-types';
import { 
  Stack, 
  // InputAdornment, 
  TextField, 
  MenuItem,
  Button,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DatePicker from '@mui/lab/DatePicker';
// components
// import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 300;

InvoiceTableToolbar.propTypes = {
  // filterName: PropTypes.string,
  filterPayment: PropTypes.string,
  filterEndDate: PropTypes.instanceOf(Date),
  filterStartDate: PropTypes.instanceOf(Date),
  // onFilterName: PropTypes.func,
  onFilterEndDate: PropTypes.func,
  onfilterPayment: PropTypes.func,
  onFilterStartDate: PropTypes.func,
  onApplyFilter: PropTypes.func,
  paymentTypes: PropTypes.arrayOf(PropTypes.string),
};

export default function InvoiceTableToolbar({
  paymentTypes,
  filterStartDate,
  filterEndDate,
  // filterName,
  filterPayment,
  // onFilterName,
  onfilterPayment,
  onFilterStartDate,
  onFilterEndDate,
  onApplyFilter
}) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
      <TextField
        fullWidth
        select
        label="Payment type"
        value={filterPayment}
        onChange={onfilterPayment}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { md: INPUT_WIDTH },
          textTransform: 'capitalize',
        }}
      >
        {paymentTypes.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      <DatePicker
        label="Start date"
        value={filterStartDate}
        onChange={onFilterStartDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />

      <DatePicker
        label="End date"
        value={filterEndDate}
        onChange={onFilterEndDate}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            sx={{
              maxWidth: { md: INPUT_WIDTH },
            }}
          />
        )}
      />
      <Box display="flex" alignItems="center" justifyContent="center">
        <Button
          size='large'
          fullWidth
          onClick={onApplyFilter}
          variant='outlined'
          sx={{p: 4}}
        >
            Apply
        </Button>
      </Box>
    </Stack>
  );
}
