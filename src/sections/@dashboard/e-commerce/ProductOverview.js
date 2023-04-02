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
    TableCell
} from '@mui/material';
// component
import Image from '../../../components/Image';

ProductOverview.propTypes = {
    currentProduct: PropTypes.object({
        available: PropTypes.number,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        option_set: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                picture_set: PropTypes.arrayOf(
                    PropTypes.shape({
                        id: PropTypes.number,
                        image: PropTypes.string,
                    })
                ),
                price: PropTypes.any,
                unit_in_stock: PropTypes.number,
            })
        ),
        is_available: PropTypes.bool,
        sold_amount: PropTypes.number,
        picture: PropTypes.string,
        description: PropTypes.any,
        categories: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.any,
                name: PropTypes.string,
            })
        ),
        avg_rating: PropTypes.number,
        ratings: PropTypes.any,
        totalRatings: PropTypes.any,
        owner: PropTypes.any,
    }),
    currentOptions: PropTypes.array
}

export default function ProductOverview({currentOptions, currentProduct}) {
    const navigate = useNavigate();

    return (
        <Box>
            
            <div>
                <h1>
                    Hello world
                </h1>
            </div>
        </Box>
    )
}

ProductInformation.propTypes = {
    currentProduct: PropTypes.object,
}

function ProductInformation({currentProduct}) {
    return (
        <Card>
            <Grid container>
                <Grid item xs={4}>
                    <Image />
                    <Stack>
                        <Typography variant='h6'>
                            {currentProduct.name}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Card>
    )
}

// OptionInformation.propTypes = {
//     currentOptions: PropTypes.array,
// }

// function OptionInformation({currentOptions}) {
//     return (
//         <TableContainer>
//             <Table>
                
//             </Table>
//         </TableContainer>
//     )
// }