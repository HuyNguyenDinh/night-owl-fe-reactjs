import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Stack,
    Grid,
    Card,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Button,
    CardHeader,
    CardContent
} from '@mui/material';
// route paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// component
import Image from '../../../components/Image';
import Markdown from '../../../components/Markdown';
// utils
import { fNumber } from '../../../utils/formatNumber';


ProductOverview.propTypes = {
    currentProduct: PropTypes.object,
    currentOptions: PropTypes.array,
    setActiveStep: PropTypes.func,
    systemCategories: PropTypes.array,
}

export default function ProductOverview({currentOptions, currentProduct, setActiveStep, systemCategories}) {
    const navigate = useNavigate();

    return (
        <Box>
            <ProductInformation systemCategories={systemCategories} currentProduct={currentProduct} />
            <Card sx={{p: 2, marginTop: 5, marginBottom: 5}}>
                <CardHeader 
                    title={
                        <Typography color="primary" variant='h4'>
                            Product Description
                        </Typography>
                    }
                />
                <CardContent>
                    <Markdown children={currentProduct.description} />
                </CardContent>
            </Card>
            <OptionInformation currentOptions={currentOptions} />
            <Box marginTop={6} display="flex" flexDirection="row" justifyContent="space-between">
                <Button onClick={() => setActiveStep(1)}>
                    Back
                </Button>
                <Button variant="contained" onClick={() => navigate(PATH_DASHBOARD.eCommerce.list)}>
                    Complete
                </Button>
            </Box>
        </Box>
    )
}

ProductInformation.propTypes = {
    currentProduct: PropTypes.object,
    systemCategories: PropTypes.array,
}

function ProductInformation({currentProduct, systemCategories}) {
    const currentCategories = systemCategories.filter((elm) => currentProduct.categories.includes(elm.id))
    return (
        <Card>
            <Grid container>
                <Grid item xs={3}>
                    <Image sx={{p: 2}} src={currentProduct.picture} />
                </Grid>
                <Grid item xs={9} sx={{margin: "auto auto"}}>
                    <Stack sx={{p: 6, rowGap: 2}}>
                        <Typography variant='h4' color="primary">
                            {currentProduct.name}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant='subtitle2'>
                                Status: 
                            </Typography>
                            <Chip color={currentProduct.is_available ? "success" : "error"} label={currentProduct.is_available ? "Available": "Not available"}/>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant='subtitle2'>
                                Categories: 
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {currentCategories.map((elm) => (
                                    <Chip key={elm.id} label={elm.name}/>
                                ))}
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Card>
    )
}

OptionInformation.propTypes = {
    currentOptions: PropTypes.array,
}

function OptionInformation({currentOptions}) {
    return (
        <Card sx={{p: 2}}>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                    <TableCell sx={{textAlign: "center"}}>
                            Unit
                        </TableCell>
                        <TableCell sx={{textAlign: "center"}}>
                            Price
                        </TableCell>
                        <TableCell sx={{textAlign: "center"}}>
                            Unit in stock
                        </TableCell>
                        <TableCell sx={{textAlign: "center"}}>
                            Width
                        </TableCell>
                        <TableCell sx={{textAlign: "center"}}>
                            Height
                        </TableCell>
                        <TableCell sx={{textAlign: "center"}}>
                            Length
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentOptions.map((elm) => (
                        <TableRow key={elm.id}>
                            <TableCell sx={{textAlign: "center"}}>
                                {elm.unit}
                            </TableCell>
                            <TableCell sx={{textAlign: "center"}}>
                                {fNumber(elm.price)} ₫
                            </TableCell>
                            <TableCell sx={{textAlign: "center"}}>
                                {elm.unit_in_stock}
                            </TableCell>
                            <TableCell sx={{textAlign: "center"}}>
                                {elm.width}
                            </TableCell>
                            <TableCell sx={{textAlign: "center"}}>
                                {elm.height}
                            </TableCell>
                            <TableCell sx={{textAlign: "center"}}>
                                {elm.length}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Card>
    )
}