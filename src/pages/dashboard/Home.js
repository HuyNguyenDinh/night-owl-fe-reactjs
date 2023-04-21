import { useState, useEffect } from 'react';
// mui
import { alpha, styled } from '@mui/material/styles';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {Grid, Container, Box, Typography, Card, CardHeader, CardContent, Stack, Link, Button} from '@mui/material';
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

const CardStyled = styled(Card)(({ theme }) => ({
    ...cssStyles().bgBlur({ blur: 5, color: theme.palette.primary.darker }),
    width: "100%",
    height: "100%"
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

    const navigate = useNavigate();

    const [bestSellers, setBestSellers] = useState([]);

    const [availableVouchers, setAvailableVouchers] = useState([]);

    useEffect(() => {
        const getBestSellers = async () => {
            const response = await axiosInstance.get("/market/products/?has_option=1&ordering=-sold_amount");
            if (response.data.results) {
                setBestSellers(response.data.results.slice(0, 10));
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

                <Typography marginTop={8} textAlign="center" variant='h5' color="primary">
                    Vouchers Available
                </Typography>
                <Card sx={{my: 2}}>
                    <CardContent>
                        {availableVouchers && availableVouchers.map((item) => (
                            <Card key={item.id} sx={{marginBottom: 2}}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={2}>
                                            <CardStyled>
                                                <Stack direction="column" spacing={10} justifyContent="space-between">
                                                    <Typography sx={{p: 1, paddingTop: 4}} textAlign="center" color="common.white" variant='subtitle2'>
                                                        "{item.code}"
                                                    </Typography>
                                                    {item.creator ? 
                                                        <Link sx={{margin: "auto"}} to={PATH_DASHBOARD.user.profile.concat(`?id=${item.creator.id}`)} component={RouterLink}>
                                                            <Stack spacing={2} alignItems="center" justifyContent="center">
                                                                <Image 
                                                                    src={item.creator.avatar ? item.creator.avatar : "https://res.cloudinary.com/dectbvmyx/image/upload/v1682042320/shop-default_obzfdd.avif"} 
                                                                    sx={{ height: { xs: 70, xl: 80 } }}    
                                                                />
                                                                <Typography color="common.white" variant='body2' textAlign="center">
                                                                    {[item.creator.first_name, item.creator.last_name].join(" ")}
                                                                </Typography>
                                                            </Stack>
                                                        </Link>
                                                        :
                                                        <Stack spacing={2} alignItems="center" justifyContent="center">
                                                            <Image 
                                                                src="https://res.cloudinary.com/dectbvmyx/image/upload/v1680423408/NOM-Logo_512_512_px_l0djyn.png"
                                                                sx={{ height: { xs: 70, xl: 80 } }}    
                                                            />
                                                            <Typography color="common.white" variant='body2' textAlign="center">
                                                                Night Owl Market
                                                            </Typography>
                                                        </Stack>
                                                    }
                                                </Stack>
                                            </CardStyled>
                                        </Grid>
                                    
                                        <Grid item xs={10}>
                                            <ShopProductList products={item.apply_products} />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>

                
                <Box sx={{my: 5}} display="flex" justifyContent="center">
                    <Button size="large" variant='contained' onClick={() => navigate(PATH_DASHBOARD.eCommerce.shop)}>
                        Shopping now
                    </Button>
                </Box>

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
