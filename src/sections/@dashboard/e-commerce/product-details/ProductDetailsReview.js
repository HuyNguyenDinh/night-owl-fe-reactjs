import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Divider, Collapse } from '@mui/material';
//
import { useDispatch, useSelector } from 'react-redux';
import ProductDetailsReviewForm from './ProductDetailsReviewForm';
import ProductDetailsReviewList from './ProductDetailsReviewList';
import ProductDetailsReviewOverview from './ProductDetailsReviewOverview';
import { getRatings } from '../../../../redux/slices/product';

// ---------------------------------------------------------------------

ProductDetailsReview.propTypes = {
  product: PropTypes.object,
};

export default function ProductDetailsReview({ product }) {
  const [reviewBox, setReviewBox] = useState(false);
  const dispatch = useDispatch()


  const handleOpenReviewBox = () => {
    setReviewBox((prev) => !prev);
  };

  const handleCloseReviewBox = () => {
    setReviewBox(false);
  };

  useEffect(() => {
    dispatch(getRatings(product.id));
  }, [])

  return (
    <>
      <ProductDetailsReviewOverview product={product} onOpen={handleOpenReviewBox} />

      <Divider />

      <Collapse in={reviewBox}>
        <ProductDetailsReviewForm onClose={handleCloseReviewBox} id="move_add_review" />
        <Divider />
      </Collapse>

      <ProductDetailsReviewList product={product} />
    </>
  );
}
