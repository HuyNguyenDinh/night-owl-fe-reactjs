import { useState, useContext } from 'react';
// import { paramCase } from 'change-case';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useNavigate } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Link, Typography, Autocomplete, InputAdornment, Popper } from '@mui/material';
// store
// import { useDispatch, useSelector } from '../../../../redux/store';
// hooks
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
// utils
import axios from '../../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';
import SearchNotFound from '../../../../components/SearchNotFound';
import { FilterContext } from '../../../../pages/dashboard/EcommerceShop';

// ----------------------------------------------------------------------

const PopperStyle = styled((props) => <Popper placement="bottom-start" {...props} />)({
  width: '280px !important',
});

// ----------------------------------------------------------------------

export default function ShopProductSearch() {
  const navigate = useNavigate();

  const {setSearchQuery} = useContext(FilterContext);
  const isMountedRef = useIsMountedRef();

  // const {products} = useSelector((state) => state.product)

  const [search, setsearch] = useState('');

  const [searchResults, setSearchResults] = useState([]);

  const handleChangeSearch = async (value) => {
    try {
      setsearch(value);
      if (value) {
        const response = await axios.get('/market/products/', {
          params: { search: value, has_option: 1 },
        });

        if (isMountedRef.current) {
          setSearchResults(response.data.results);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (id) => {
    navigate(PATH_DASHBOARD.eCommerce.view(id));
  };

  const handleKeyUp = (event) => {
    console.log(event.target.value);
    if (event.key === 'Enter') {
      // handleClick(search);
      setSearchQuery(search);
    }
  };

  return (
    <Autocomplete
      size="small"
      autoHighlight
      popupIcon={null}
      PopperComponent={PopperStyle}
      options={searchResults}
      onInputChange={(event, value) => handleChangeSearch(value)}
      onKeyUp={handleKeyUp}
      getOptionLabel={(product) => product.name}
      noOptionsText={<SearchNotFound searchQuery={search} />}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      renderInput={(params) => (
        <InputStyle
          {...params}
          stretchStart={200}
          placeholder="Search product..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, product, { inputValue }) => {
        const { id, picture, name } = product;
        const matches = match(name, inputValue);
        const parts = parse(name, matches);

        return (
          <li {...props}>
            <Image alt={picture} src={picture} sx={{ width: 48, height: 48, borderRadius: 1, flexShrink: 0, mr: 1.5 }} />
            <Link underline="none" onClick={() => handleClick(id)}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  variant="subtitle2"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                >
                  {part.text}
                </Typography>
              ))}
            </Link>
          </li>
        );
      }}
    />
  );
}
