import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Button, CardContent, Typography } from '@mui/material';
// paths
import { PATH_DASHBOARD } from '../../../../routes/paths';

// components
import Image from '../../../../components/Image';
import { CarouselDots } from '../../../../components/carousel';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------

EcommerceNewProducts.propTypes = {
  list: PropTypes.array.isRequired,
};

export default function EcommerceNewProducts({ list, ...other }) {
  const theme = useTheme();

  const settings = {
    speed: 1000,
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselDots({ position: 'absolute', right: 24, bottom: 24 }),
  };

  return (
    <Card {...other}>
      <Slider {...settings}>
        {list.map((item) => (
          <CarouselItem key={item.id} item={item} />
        ))}
      </Slider>
    </Card>
  );
}

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  item: PropTypes.shape({
    picture: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.any,
  }),
};

function CarouselItem({ item }) {
  const { picture, name, id } = item;

  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'relative' }}>
      <CardContent
        sx={{
          left: 0,
          bottom: 0,
          zIndex: 9,
          maxWidth: '80%',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <Typography variant="overline" sx={{ opacity: 0.48 }}>
          Best Seller
        </Typography>

        <Typography noWrap variant="h5" sx={{ mt: 1, mb: 3 }}>
          {name}
        </Typography>

        <Button onClick={() => navigate(PATH_DASHBOARD.eCommerce.view(id))} variant="contained">Buy Now</Button>
      </CardContent>
      <OverlayStyle />
      <Image alt={name} src={picture} sx={{ height: { xs: 280, xl: 320 } }} />
    </Box>
  );
}
