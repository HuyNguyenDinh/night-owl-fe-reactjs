import PropTypes from 'prop-types';
// import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// @mui
import { 
  Box, 
  List, 
  Button, 
  Rating, 
  Avatar, 
  ListItem, 
  // Pagination, 
  Typography 
} from '@mui/material';
// utils
import axiosInstance from '../../../../utils/axios';
// redux
import { getMoreRatings, setNextRatings } from '../../../../redux/slices/product'
// utils
// import { fDate } from '../../../../utils/formatTime';
// import { fShortenNumber } from '../../../../utils/formatNumber';
// components
// import Iconify from '../../../../components/Iconify';
import Markdown from '../../../../components/Markdown';

// ----------------------------------------------------------------------

ProductDetailsReviewList.propTypes = {
  product: PropTypes.object,
};

export default function ProductDetailsReviewList({ product }) {
  const { ratings } = product;

  const {nextRatings} = useSelector((state) => state.product);

  const dispatch = useDispatch();

  const handleGetMoreRatings = async () => {
    try {
      const response = await axiosInstance.get(nextRatings);
      console.log(response.data);
      dispatch(getMoreRatings(response.data.results));
      if (response.data.next) {
        dispatch(setNextRatings(response.data.next));
      }
      else {
        dispatch(setNextRatings(''));
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <Box sx={{ pt: 3, px: 2, pb: 5 }}>
      <List disablePadding>
        {ratings && ratings.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </List>
      
      {nextRatings &&
        <Box sx={{ textAlign: "center" }}>
          {/* <Pagination count={10} color="primary" /> */}
            <Button variant='outlined' onClick={handleGetMoreRatings}>
              View more
            </Button>
        </Box>
      }
    </Box>
  );
}

// ----------------------------------------------------------------------

ReviewItem.propTypes = {
  review: PropTypes.object,
};

function ReviewItem({ review }) {
  // const [isHelpful, setHelpfuls] = useState(false);

  const { creator, rate, comment} = review;

  // const handleClickHelpful = () => {
  //   setHelpfuls((prev) => !prev);
  // };

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          mb: 5,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, sm: 0 },
            minWidth: { xs: 160, md: 240 },
            textAlign: { sm: 'center' },
            flexDirection: { sm: 'column' },
          }}
        >
          <Avatar
            src={creator.avatar}
            sx={{
              mr: { xs: 2, sm: 0 },
              mb: { sm: 2 },
              width: { md: 64 },
              height: { md: 64 },
            }}
          />
          <div>
            <Typography variant="subtitle2" noWrap>

              {creator.first_name.concat(" ", creator.last_name)}
            </Typography>
            {/* <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {fDate(postedAt)}
            </Typography> */}
          </div>
        </Box>

        <div>
          <Rating sx={{p: 1}} size="small" value={rate} precision={0.1} readOnly />
          <Box sx={{p: 1}}>
            <Markdown>
              {comment}
            </Markdown>
          </Box>

          {/* <Box
            sx={{
              mt: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {!isHelpful && (
              <Typography variant="body2" sx={{ mr: 1 }}>
                Was this review helpful to you?
              </Typography>
            )}

            <Button
              size="small"
              color="inherit"
              startIcon={<Iconify icon={!isHelpful ? 'ic:round-thumb-up' : 'eva:checkmark-fill'} />}
              onClick={handleClickHelpful}
            >
              {isHelpful ? 'Helpful' : 'Thank'}({fShortenNumber(!isHelpful ? helpful : helpful + 1)})
            </Button>
          </Box> */}
        </div>
      </ListItem>
    </>
  );
}
