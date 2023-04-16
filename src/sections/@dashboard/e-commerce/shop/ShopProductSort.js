import { useState, useContext } from 'react';
// @mui
import { Button, MenuItem, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { sortByProducts } from '../../../../redux/slices/product';
// components
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';
import { FilterContext } from '../../../../pages/dashboard/EcommerceShop';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  // { value: 'newest', label: 'Newest' },
  // { value: 'priceDesc', label: 'Price: High-Low' },
  // { value: 'priceAsc', label: 'Price: Low-High' },
  { value: '-sold_amount', label: 'Sold Amount: High-Low'},
  { value: 'sold_amount', label: 'Sold Amount: Low-High'},
];

function renderLabel(label) {
  // if (label === 'featured') {
  //   return 'Featured';
  // }
  // if (label === 'newest') {
  //   return 'Newest';
  // }
  // if (label === 'priceDesc') {
  //   return 'Price: High-Low';
  // }
  // return 'Price: Low-High';
  return SORT_BY_OPTIONS.find((item) => item.value === label).label;
}

// ----------------------------------------------------------------------

export default function ShopProductSort() {
  // const dispatch = useDispatch();

  // const { sortBy } = useSelector((state) => state.product);

  const { ordering, setOrdering } = useContext(FilterContext);

  const [open, setOpen] = useState(null);

  const handleOpen = (currentTarget) => {
    setOpen(currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSortBy = (value) => {
    handleClose();
    // dispatch(sortByProducts(value));
    console.log(value);
    setOrdering(value);
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={(event) => handleOpen(event.currentTarget)}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {renderLabel(ordering)}
        </Typography>
      </Button>

      <MenuPopover
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        sx={{
          width: 'auto',
          '& .MuiMenuItem-root': { typography: 'body2', borderRadius: 0.75 },
        }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem key={option.value} selected={option.value === ordering} onClick={() => handleSortBy(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}
