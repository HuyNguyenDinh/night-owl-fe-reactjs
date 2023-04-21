import { useState, useEffect } from 'react';
// mui
import { alpha, styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import {Grid, Container, Box, Typography, Card, CardHeader, CardContent, Stack, Link} from '@mui/material';
// paths
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import axiosInstance from '../../utils/axios';
import cssStyles from '../../utils/cssStyles';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
// sections
import { ShopProductList } from '../../sections/@dashboard/e-commerce/shop';
import {EcommerceNewProducts} from '../../sections/@dashboard/general/e-commerce';
// import { AppWelcome } from '../../sections/@dashboard/general/app';

//------------------------------------------

const PRODUCT_DESCRIPTION = [
    {
      title: 'High quality',
      description: 'All product and seller must to be pass our quality check.',
      icon: 'ic:round-verified',
    },
    {
      title: 'Reduce time pending',
      description: 'We provide the convenient tool for selling base on your decision.',
      icon: 'eva:clock-fill',
    },
    {
      title: 'Alway being protected',
      description: 'You always being protected by us.',
      icon: 'ic:round-verified-user',
    },
];

const HeaderStyle = styled(CardHeader)(({ theme }) => ({
    ...cssStyles().bgBlur({ blur: 90, color: theme.palette.primary.darker })
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    justifyContent: 'center',
    height: theme.spacing(8),
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
  }));

//---------------------------------------------

export default function HomePage() {
    const {themeStretch} = useSettings();

    const [bestSellers, setBestSellers] = useState([]);

    const [availableVouchers, setAvailableVouchers] = useState([]);

    useEffect(() => {
        const getBestSellers = async () => {
            const response = await axiosInstance.get("/market/products/?has_option=1&ordering=-sold_amount");
            if (response.data.results) {
                setBestSellers(response.data.results);
            }
        };
        const getAvailableVouchers = async () => {
            const response = await axiosInstance.get("/market/voucher/");
            if (response.data.results) {
                setAvailableVouchers(response.data.results);
            }
        }
        getBestSellers();
        getAvailableVouchers();
    }, []);

    return (
        <Page title="General: E-commerce">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Image 
                            alt="banner-1" 
                            src="https://res.cloudinary.com/dectbvmyx/image/upload/v1682038241/Ecommerce_Banner1_vrmokp.webp" 
                            sx={{ height: { xs: 280, xl: 320 }, objectFit: "contain" }} 
                        /> 
                    </Grid>

                    {bestSellers && 
                        <Grid item xs={12} md={4}>
                            <EcommerceNewProducts list={bestSellers} />
                        </Grid>
                    }
                </Grid>
                
                <Typography sx={{mt: 10}} variant='h5' color="primary">
                    Vouchers Available
                </Typography>
                {availableVouchers && availableVouchers.map((item) => (
                    <Card key={item.id} sx={{my: 5}}>
                        <HeaderStyle
                            sx={{p: 1}}
                            title={
                                <Stack sx={{marginRight: 5}} color="common.white" direction="row" justifyContent="space-between">
                                    <Typography marginLeft={4} variant='h6'>
                                        {item.code}
                                    </Typography>
                                    {item.creator ? 
                                        <Link to={PATH_DASHBOARD.user.profile.concat(`?id=${item.creator.id}`)} component={RouterLink}>
                                            <Stack direction="row" spacing={4} alignItems="center">
                                                <Typography variant='subtitle1' color="common.white">
                                                    {[item.creator.first_name, item.creator.last_name].join(" ")}
                                                </Typography>
                                                <Image 
                                                    src={item.creator.avatar ? item.creator.avatar : "https://res.cloudinary.com/dectbvmyx/image/upload/v1682042320/shop-default_obzfdd.avif"} 
                                                    sx={{ height: { xs: 35, xl: 40 } }}    
                                                />
                                            </Stack>
                                        </Link>
                                        :
                                        <Stack direction="row" spacing={4} alignItems="center">
                                            <Typography variant='subtitle1'>
                                                Night Owl Market
                                            </Typography>
                                            <Image 
                                                src="https://res.cloudinary.com/dectbvmyx/image/upload/v1680423408/NOM-Logo_512_512_px_l0djyn.png"
                                                sx={{ height: { xs: 35, xl: 40 } }}    
                                            />
                                        </Stack>
                                    }
                                </Stack>
                            }
                        />
                        <CardContent sx={{mx: 4, marginBottom: 4}}>
                            {/* <Grid container sx={{p: 3}}>
                                <Grid item>
                                    a
                                </Grid>
                            </Grid> */}
                            <ShopProductList products={item.apply_products} />
                        </CardContent>
                    </Card>
                ))}
                <Grid container sx={{ my: 8 }}>
                    {PRODUCT_DESCRIPTION.map((item) => (
                        <Grid item xs={12} md={4} key={item.title}>
                            <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                                <IconWrapperStyle>
                                    <Iconify icon={item.icon} width={36} height={36} />
                                </IconWrapperStyle>
                                <Typography variant="subtitle1" gutterBottom>
                                    {item.title}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Page>
    )
}
