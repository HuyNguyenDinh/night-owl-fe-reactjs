import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Grid, Step, Stepper, Container, StepLabel, StepConnector } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import ProductNewEditForm from '../../sections/@dashboard/e-commerce/ProductNewEditForm';
import ProductOptionNewEditForm from '../../sections/@dashboard/e-commerce/ProductOptionNewEditForm';
import axiosInstance from '../../utils/axios';

// ----------------------------------------------------------------------

const NEW_STEPS = ['Add Product', 'Add Options', 'Overview'];
const EDIT_STEPS = ['Edit Product', 'Edit Options', 'Overview']
// const STEPS = ['Add Product', 'Add Options', 'Overview'];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled',
      }}
    >
      {completed ? (
        <Iconify icon={'eva:checkmark-fill'} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
    </Box>
  );
}

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentProduct, setCurrentProduct] = useState();
  const [currentOptions, setCurrentOptions] = useState([]);
  const [isCreated, setIsCreated] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const STEP_TYPE = isEdit ? EDIT_STEPS : NEW_STEPS
  const isComplete = activeStep === STEP_TYPE.length;

  useEffect(() => {
    if (id) {
      const getProduct = async () => {
        const response = await axiosInstance.get(`/market/products/${id}/`);
        setCurrentProduct(response.data);
        setCurrentOptions(response.data.option_set);
      }
      getProduct();
    }
  }, [id]);

  return (
    <Page title="Ecommerce: Create a new product">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product' : 'Edit product'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: !isEdit ? 'New product' : currentProduct?.name },
          ]}
        />
        <Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
          <Grid item xs={12} md={12} sx={{ mb: 5 }}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
              {STEP_TYPE.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        typography: 'subtitle2',
                        color: 'text.disabled',
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>
        {!isComplete ? (
          <>
            {activeStep === 0 && 
              <ProductNewEditForm 
                isEdit={isEdit} 
                currentProduct={currentProduct} 
                setCurrentProduct={setCurrentProduct} 
                setActiveStep={setActiveStep}
                isCreated={isCreated}
                setIsCreated={setIsCreated}
                />
              }
            {activeStep === 1 && 
              <ProductOptionNewEditForm 
                setActiveStep={setActiveStep} 
                currentOptions={currentOptions}
                setCurrentOptions={setCurrentOptions}
                currentProduct={currentProduct}
              />
            }
            {activeStep === 2 && <></>}
          </>
        ) : (
          <></>
        )}
      </Container>
    </Page>
  );
}
