import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { 
    useForm, 
    // Controller 
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { 
    Card, 
    // Chip, 
    Grid, 
    Stack, 
    // TextField, 
    Typography, 
    // Autocomplete, 
    InputAdornment ,
    Button,
    Modal,
    ImageList,
    ImageListItem,
    TableContainer,
    TableHead,
    TableBody,
    TableFooter,
    TableRow,
    TableCell,
    Box,
    Table
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import axiosInstance from '../../../utils/axios';
// components
import {
  FormProvider,
  RHFSwitch,
//   RHFSelect,
//   RHFEditor,
  RHFTextField,
//   RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../components/hook-form';
import Scrollbar from '../../../components/Scrollbar';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductOptionNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
  currentOptions: PropTypes.array,
  setCurrentOptions: PropTypes.func,
  setActiveStep: PropTypes.func
};

export default function ProductOptionNewEditForm({ isEdit, currentProduct, setActiveStep, currentOptions, setCurrentOptions }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editOption, setEditOption] = useState();

  const handleEditOption = (option) => {
    setEditOption(option);
    setOpen(true);
  }

  const { enqueueSnackbar } = useSnackbar();

  const onCreateOption = (option) => {
    setCurrentOptions([...currentOptions, option]);
  }

  return (
    <div style={{width: "100%"}}>
        <TableContainer>
            <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="center">Unit</TableCell>
                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Unit in stock</TableCell>
                    <TableCell align="center">Width</TableCell>
                    <TableCell align="center">Height</TableCell>
                    <TableCell align="center">Length</TableCell>
                    <TableCell align="center"> </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {currentOptions && currentOptions.map((elm) => (
                <TableRow key={elm.id}>
                    <TableCell>{elm.unit}</TableCell>
                    <TableCell>{elm.price}</TableCell>
                    <TableCell>{elm.unit_in_stock}</TableCell>
                    <TableCell>{elm.width}</TableCell>
                    <TableCell>{elm.height}</TableCell>
                    <TableCell>{elm.length}</TableCell>
                    <TableCell>
                        <Button onClick={() => handleEditOption(elm)}>Edit</Button>
                        </TableCell>
                </TableRow>
            ))}
            {(!currentOptions || currentOptions.length === 0) && (
                <TableRow>
                    <TableCell sx={{textAlign: "center"}} colSpan={7}>No options</TableCell>
                </TableRow>
            )}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell sx={{textAlign: "center"}} colSpan={7}>
                        <Button onClick={() => setOpen(true)}>
                            Add New Option
                        </Button>
                    </TableCell>
                </TableRow>
            </TableFooter>
            </Table>
            
        </TableContainer>
        <ModalEditForm currentOption={editOption} open={open} setOpen={setOpen} enqueueSnackbar={enqueueSnackbar} currentProduct={currentProduct} onCreateOption={onCreateOption}/>
        
        <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Button onClick={() => setActiveStep(0)}>
                Back
            </Button>
            <Button variant="contained" onClick={() => navigate(PATH_DASHBOARD.eCommerce.list)}>
                Complete
            </Button>
        </Box>
    </div>
  );
}

ModalEditForm.propTypes = {
    isEdit: PropTypes.bool,
    currentProduct: PropTypes.object,
    currentOption: PropTypes.object,
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    enqueueSnackbar: PropTypes.func,
    onCreateOption: PropTypes.func,
}

function ModalEditForm({isEdit, currentProduct, currentOption, open, setOpen, enqueueSnackbar, onCreateOption}) {
    const NewProductSchema = Yup.object().shape({
        unit: Yup.string().required('Unit is required'),
        uploaded_images: Yup.array(),
        price: Yup.number().required().moreThan(0, 'Price should not be 0'),
        unit_in_stock: Yup.number().required().moreThan(0, "Unit in stock must be greater or equal 0"),
        width: Yup.number().moreThan(0, "Width must be greater than 0"),
        height: Yup.number().moreThan(0, "Height must be greater than 0"),
        length: Yup.number().moreThan(0, "Length must be greater than 0"),
    });
    
    const defaultValues = useMemo(
    () => ({
        unit: currentOption?.unit || '',
        uploaded_images: currentOption?.uploaded_images || [],
        price: currentOption?.price || 1,
        unit_in_stock: currentOption?.unit_in_stock || 0,
        width: currentOption?.width || 1,
        height: currentOption?.height || 1,
        length: currentOption?.length || 1,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentOption]
    );

    const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
    });

    const {
    reset,
    watch,
    // control,
    setValue,
    getValues,
    handleSubmit,
    errors,
    formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (isEdit && currentOption) {
        reset(defaultValues);
        }
        if (!isEdit) {
        reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, currentOption]);
    
    const onSubmit = async () => {
        try {
            const data = new FormData();
            console.log(values);
            Object.keys(values).forEach((key) => {
                if (key === "uploaded_images") {
                    values[key].map((image) => data.append(key, image))
                }
                else {
                    data.append(key, values[key]);
                }
            });
            console.log(...data)
            const resp = await axiosInstance.post(`/market/products/${currentProduct.id}/add-option/`, data);
            console.log(resp.data);
            onCreateOption(resp.data);
            reset();
            setOpen(false);
            enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
        } 
        catch (error) {
            console.error(error);
        }
    };

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const images = values.uploaded_images || [];

            setValue('uploaded_images', [
                ...images,
                ...acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
                ),
            ]);
        },
        [setValue, values.uploaded_images]
    );

    const handleRemoveAll = () => {
        setValue('uploaded_images', []);
    };

    const handleRemove = (file) => {
        const filteredItems = values.uploaded_images?.filter((_file) => _file !== file);
        setValue('uploaded_images', filteredItems);
    };

    useEffect(() => {
        if (errors) {
            console.log(errors);
        }
    }, [errors])

    return(
        <Modal onClose={() => setOpen(false)} open={open}>
            <Card 
                sx={{
                    position: "absolute", 
                    p: 5,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "80%",
                    height: "80vh",
                    padding: 1,
                }} 
            >
                <Scrollbar>
                    <Stack flexDirection="row" justifyContent="space-between">
                        <Typography color="primary" variant="h4" sx={{p: 2}}>Option Information</Typography>
                        <Button onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </Button>
                    </Stack>
                
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                            <Card sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                <RHFTextField name="unit" label="Option unit" />
                                {currentOption?.picture_set && 
                                    (<ImageList>
                                        {currentOption.picture_set.map((item) => (
                                            <ImageListItem key={item.img}>
                                            <img
                                                src={`${item.image}?w=30&h=30&fit=crop&auto=format`}
                                                srcSet={`${item.image}?w=30&h=30&fit=crop&auto=format&dpr=2 2x`}
                                                alt={currentOption.unit}
                                                loading="lazy"
                                            />
                                            </ImageListItem>
                                        ))}
                                    </ImageList>)
                                }
                                <div>
                                    <LabelStyle>New Images</LabelStyle>
                                    <RHFUploadMultiFile
                                        showPreview
                                        name="uploaded_images"
                                        accept="image/*"
                                        maxSize={3145728}
                                        onDrop={handleDrop}
                                        onRemove={handleRemove}
                                        onRemoveAll={handleRemoveAll}
                                        onUpload={() => console.log('ON UPLOAD')}
                                    />
                                </div>
                                </Stack>
                            </Card>
                            </Grid>

                            <Grid item xs={12} md={4}>
                            <Stack spacing={3}>
                                <Card sx={{ p: 3 }}>
                                <Stack spacing={3} mt={2}>
                                    <RHFTextField
                                        name="price"
                                        label="Price"
                                        placeholder="0.00"
                                        value={getValues('price')}
                                        onChange={(event) => setValue('price', Number(event.target.value))}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                                            type: 'number',
                                        }}
                                    />
                                    <RHFTextField 
                                        name="unit_in_stock"
                                        label="Unit in stock"
                                        placeholder="10"
                                        value={getValues("unit_in_stock")}
                                        onChange={(event) => setValue('unit_in_stock', Number(event.target.value))}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            type: 'number'
                                        }}
                                    />
                                    <RHFTextField 
                                        name="width"
                                        label="Width"
                                        placeholder="1"
                                        value={getValues("width")}
                                        onChange={(event) => setValue('width', Number(event.target.value))}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            type: 'number'
                                        }}
                                    />
                                    <RHFTextField 
                                        name="height"
                                        label="Height"
                                        placeholder="1"
                                        value={getValues("height")}
                                        onChange={(event) => setValue('height', Number(event.target.value))}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            type: 'number'
                                        }}
                                    />
                                    <RHFTextField 
                                        name="length"
                                        label="Length"
                                        placeholder="1"
                                        value={getValues("length")}
                                        onChange={(event) => setValue('length', Number(event.target.value))}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            type: 'number'
                                        }}
                                    />
                                </Stack>
                                </Card>

                                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                                {!isEdit ? 'Create Option' : 'Save Changes'}
                                </LoadingButton>
                            </Stack>
                            </Grid>
                        </Grid>
                    </FormProvider>
                </Scrollbar>
            </Card>
        </Modal>
    )
}
