import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
// import axios from 'axios';
// form
import { 
    useForm, 
    // Controller 
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled, alpha } from '@mui/material/styles';
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
    // ImageList,
    // ImageListItem,
    TableContainer,
    TableHead,
    TableBody,
    TableFooter,
    TableRow,
    TableCell,
    Box,
    Table,
    List,
    ListItem,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {m, AnimatePresence } from 'framer-motion';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import axiosInstance from '../../../utils/axios';
// components
import {
  FormProvider,
//   RHFSwitch, 
//   RHFSelect,
//   RHFEditor,
  RHFTextField,
//   RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../components/hook-form';
import Scrollbar from '../../../components/Scrollbar';
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';
import { varFade } from '../../../components/animate';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductOptionNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
  currentOptions: PropTypes.array,
  setCurrentOptions: PropTypes.func,
  setActiveStep: PropTypes.func
};

export default function ProductOptionNewEditForm({ currentProduct, setActiveStep, currentOptions, setCurrentOptions }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editOption, setEditOption] = useState();

  const handleEditOption = (option) => {
    setEditOption(option);
    setOpen(true);
  };

  const handleDeleteOption = async (optionID) => {
    try {
        await axiosInstance.delete(`/market/options/${optionID}/`);
        setCurrentOptions(currentOptions.filter((elm) => elm.id !== optionID));
    }
    catch(error) {
        console.log(error);
    }
  }

  const { enqueueSnackbar } = useSnackbar();

  const onCreateOption = (option) => {
    const newOptions = currentOptions.filter((elm) => elm.id !== option.id)
    setCurrentOptions([...newOptions, option]);
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
                        <Button color="error" onClick={() => handleDeleteOption(elm.id)}>Delete</Button>
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
        <ModalEditForm 
            editOption={editOption} 
            open={open} 
            setOpen={setOpen} 
            enqueueSnackbar={enqueueSnackbar} 
            currentProduct={currentProduct} 
            onCreateOption={onCreateOption}
            setEditOption={setEditOption}
            setCurrentOptions={setCurrentOptions}
            currentOptions={currentOptions}
        />
        
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
    currentProduct: PropTypes.object,
    editOption: PropTypes.object,
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    enqueueSnackbar: PropTypes.func,
    onCreateOption: PropTypes.func,
    setEditOption: PropTypes.func,
    currentOptions: PropTypes.array,
    setCurrentOptions: PropTypes.func,
}

function ModalEditForm({currentProduct, editOption, open, setOpen, enqueueSnackbar, onCreateOption, setEditOption, currentOptions,setCurrentOptions}) {
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
        unit: editOption?.unit || '',
        uploaded_images: editOption?.uploaded_images || [],
        price: editOption?.price || 1,
        unit_in_stock: editOption?.unit_in_stock || 0,
        width: editOption?.width || 1,
        height: editOption?.height || 1,
        length: editOption?.length || 1,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editOption]
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
        reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editOption]);
    
    const onSubmit = async () => {
        try {
            const data = new FormData();
            Object.keys(values).forEach((key) => {
                if (key === "uploaded_images") {
                    values[key].map((image) => data.append(key, image))
                }
                else {
                    data.append(key, values[key]);
                }
            });
            if (editOption) {
                const resp = await axiosInstance.patch(`/market/options/${editOption.id}/`, data);
                onCreateOption(resp.data);

            }
            else {
                const resp = await axiosInstance.post(`/market/products/${currentProduct.id}/add-option/`, data);
                onCreateOption(resp.data);
            }
            setOpen(false);
            setEditOption(null);
            enqueueSnackbar(!editOption ? 'Create success!' : 'Update success!');
        } 
        catch (error) {
            console.error(error);
        }
    };

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const images = values.uploaded_images || [];
            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            )
            setValue('uploaded_images', [
                ...images,
                ...newFiles,
            ]);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setValue, values.uploaded_images]
    );

    const onRemove = async (pictureID) => {
        try {
            await axiosInstance.delete(`/market/option-image/${pictureID}/`);
            const newOption = {...editOption, picture_set: editOption.picture_set.filter((picture) => picture.id !== pictureID)};
            setEditOption(newOption);
            setCurrentOptions([...currentOptions.filter((option) => option.id !== editOption.id), newOption]);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (errors) {
            console.log(errors);
        }
    }, [errors])

    const handleCloseModal = () => {
        setOpen(false);
        setEditOption(null);
        reset();
    }

    return(
        <Modal onClose={handleCloseModal} open={open}>
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
                        <Typography color="primary" variant="h4" sx={{p: 2}}>
                            {editOption ? "Edit Option" : "Create Option"}
                        </Typography>
                        <Button onClick={handleCloseModal}>
                            <CloseIcon />
                        </Button>
                    </Stack>
                
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                            <Card sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                <RHFTextField name="unit" label="Option unit" />
                                <div>
                                    <LabelStyle>Images</LabelStyle>
                                    <RHFUploadMultiFile
                                        // showPreview
                                        name="uploaded_images"
                                        accept="image/*"
                                        maxSize={3145728}
                                        onDrop={handleDrop}
                                        // onRemove={handleRemove}
                                        // onRemoveAll={handleRemoveAll}
                                        // onUpload={() => console.log("upload")}
                                    />
                                </div>
                                <List disablePadding sx={{ my: 3 }}>
                                <AnimatePresence>
                                { editOption?.picture_set && 
                                    editOption.picture_set.map((picture) => (
                                        <ListItem
                                            key={picture.id}
                                            component={m.div}
                                            {...varFade().inRight}
                                            sx={{
                                                p: 0,
                                                m: 0.5,
                                                width: 80,
                                                height: 80,
                                                borderRadius: 1.25,
                                                overflow: 'hidden',
                                                position: 'relative',
                                                display: 'inline-flex',
                                                border: (theme) => `solid 1px ${theme.palette.divider}`,
                                            }}
                                        >
                                            <Image alt="preview" src={picture.image} ratio="1/1" />
                                            <IconButton
                                                size="small"
                                                onClick={() => onRemove(picture.id)}
                                                sx={{
                                                top: 6,
                                                p: '2px',
                                                right: 6,
                                                position: 'absolute',
                                                color: 'common.white',
                                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                                '&:hover': {
                                                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                                },
                                                }}
                                            >
                                                <Iconify icon={'eva:close-fill'} />
                                            </IconButton>
                                        </ListItem>
                                ))}
                                {values.uploaded_images && values.uploaded_images.map((image) => (
                                    <ListItem
                                        key={image.preview}
                                        component={m.div}
                                        {...varFade().inRight}
                                        sx={{
                                            p: 0,
                                            m: 0.5,
                                            width: 80,
                                            height: 80,
                                            borderRadius: 1.25,
                                            overflow: 'hidden',
                                            position: 'relative',
                                            display: 'inline-flex',
                                            border: (theme) => `solid 1px ${theme.palette.divider}`,
                                        }}
                                    >
                                              <Typography
                                                variant="subtitle1"
                                                component="span"
                                                color="secondary"
                                                sx={{
                                                    position: 'absolute',
                                                    top: '0',
                                                    left: '0',
                                                    padding: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    zIndex: 1,
                                                }}
                                            >
                                                New
                                            </Typography>

                                        <Image alt="preview" src={image.preview} ratio="1/1" />
                                        <IconButton
                                            size="small"
                                            onClick={() => setValue("uploaded_images", values.uploaded_images.filter((elm) => elm.preview !== image.preview))}
                                            sx={{
                                            top: 6,
                                            p: '2px',
                                            right: 6,
                                            position: 'absolute',
                                            color: 'common.white',
                                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                            '&:hover': {
                                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                            },
                                            }}
                                        >
                                            <Iconify icon={'eva:close-fill'} />
                                        </IconButton>
                                    </ListItem>
                                ))}
                                </AnimatePresence>
                                </List>
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
                                {!editOption ? 'Create Option' : 'Save Changes'}
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
