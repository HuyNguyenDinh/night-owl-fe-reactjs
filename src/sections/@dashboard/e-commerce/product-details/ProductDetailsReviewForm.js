import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Stack, Rating, Typography, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { getMoreProductInfo } from '../../../../redux/slices/product';
// utils
import axiosInstance from '../../../../utils/axios';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------

ProductDetailsReviewForm.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.string,
  productId: PropTypes.any,
};

export default function ProductDetailsReviewForm({ onClose, id, productId, ...other }) {
  const { enqueueSnackbar } = useSnackbar();

  const {product} = useSelector((state) => state.product);

  const dispatch = useDispatch();

  const ReviewSchema = Yup.object().shape({
    rate: Yup.mixed().required('Rating is required'),
    comment: Yup.string().required('Review is required'),
  });

  const defaultValues = {
    rate: 5,
    comment: '',
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(`/market/products/${productId}/add-comment/`, data);
      let ratings = [response.data];
      if (product.ratings && product.ratings.length > 0) {
        ratings = [...ratings, ...product.ratings]
      }
      dispatch(getMoreProductInfo({ratings}));
      enqueueSnackbar("Successful");
      reset();
      onClose();
    } catch (error) {
      enqueueSnackbar("Failed", {variant: "error"});
      console.error(error);
    }
  };

  const onCancel = () => {
    onClose();
    reset();
  };

  return (
    <RootStyle {...other} id={id}>
      <Typography variant="subtitle1" gutterBottom>
        Add Review
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <div>
            <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
              <Typography variant="body2">Your review about this product:</Typography>

              <Controller
                name="rate"
                control={control}
                render={({ field }) => <Rating {...field} value={Number(field.value)} />}
              />
            </Stack>
            {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}
          </div>

          <RHFTextField name="comment" label="Comment *" multiline rows={3} />

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button color="inherit" variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Post review
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}
