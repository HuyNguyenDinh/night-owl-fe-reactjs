import { useState, useEffect, useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Container, Grid, Select, CardHeader, Typography, Card, CardContent, Stack, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
// utils
// import { kFormat } from '../../utils/formatNumber';
import axiosInstance from '../../utils/axios';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// _mock_
import {
  // _ecommerceNewProducts,
  // _ecommerceSalesOverview,
  // _ecommerceBestSalesman,
  // _ecommerceLatestProducts,
} from '../../_mock';
// components
import Page from '../../components/Page';
// sections
import {
  // EcommerceNewProducts,
  EcommerceYearlySales,
  // EcommerceBestSalesman,
  // EcommerceSaleByGender,
  EcommerceWidgetSummary,
  // EcommerceSalesOverview,
  EcommerceLatestProducts,
  // EcommerceCurrentBalance,
} from '../../sections/@dashboard/general/e-commerce';
import { AppWelcome } from '../../sections/@dashboard/general/app';
// assets
import { MotivationIllustration } from '../../assets';

// ----------------------------------------------------------------------

export default function GeneralEcommerce() {

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const { user } = useAuth();

  const [month, setMonth] = useState("s");

  const [year, setYear] = useState("");

  const [listYear, setListYear] = useState([]);

  const [listMonth, setListMonth] = useState([]);

  const [topBestSellers, setTopBestSellers] = useState([]);

  const monthRef = useRef();

  const yearRef = useRef();

  const [monthly, setMonthly] = useState();

  const [yearly, setYearly] = useState();

  const [monthlyProduct, setMonthlyProduct] = useState();

  const theme = useTheme();

  const { themeStretch } = useSettings();

  // const yearRange = () => {
  //   let years = [];
  //   let i = now.getFullYear();
  //   while(i >= 1970) {
  //     years = [...years, i];
  //     i-=1;
  //   }
  //   return years;
  // }

  const calculatePercent = (listValue) => {
    let ref = 1;
    let percent = 0;
    if (listValue) {
      ref = listValue[0];
      for (let i = 0; i < listValue.length; i+=1) {
        percent = (listValue[i] - ref) / ref * 100;
        ref = listValue[i];
      }
    }
    return percent
  }

  // useEffect(() => {
  //   const initData = async () => {
  //     try {
  //       // orders
  //       const monthlyResponse = await axiosInstance.get("/market/bills/monthly-value-statistic/", {
  //         params: {month, year}
  //       });
  //       setMonthly(monthlyResponse.data);
  //       const yearlyResponse = await axiosInstance.get("/market/bills/yearly-value-statistic/", {
  //         params: {year}
  //       });
  //       setYearly(yearlyResponse.data);
        
  //       // products
  //       const monthlyProductResponse = await axiosInstance.get("/market/products/products-statistic-count-in-month/", {
  //         params: {month, year}
  //       });
  //       setMonthlyProduct(monthlyProductResponse.data);

  //       const bestSellersResponse = await axiosInstance.get("/market/products/", {
  //         params: {
  //           ordering: "-sold_amount",
  //           owner: user.id,
  //           has_option: 1,
  //         }
  //       });
  //       setTopBestSellers(bestSellersResponse.data.results.slice(0, 10));
  //       monthRef.current = month;
  //       yearRef.current = year;
  //     }
  //     catch(error) {
  //       setMonth(monthRef.current);
  //       setYear(yearRef.current);
  //       console.error(error);
  //     }
  //   }
  //   initData();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user, month, year]);

  useEffect(() => {
    const getAvailableYears = async () => {
      const response = await axiosInstance.get("/market/bills/get-years/");
      setListYear(response.data.years);
      if (response.data.years) {
        setYear(response.data.years[response.data.years.length - 1]);
      };
      const bestSellersResponse = await axiosInstance.get("/market/products/", {
        params: {
          ordering: "-sold_amount",
          owner: user.id,
          has_option: 1,
        }
      });
      setTopBestSellers(bestSellersResponse.data.results.slice(0, 10));
    }
    if (user) {
      getAvailableYears();
    }
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      try {
        const yearlyResponse = await axiosInstance.get("/market/bills/yearly-value-statistic/", {
          params: {year}
        });
        setYearly(yearlyResponse.data);
        if (yearlyResponse.data.month) {
          const temp = yearlyResponse.data.month.map((item) => item.order_date__month);
          setListMonth(temp);
          setMonth(temp[temp.length - 1]);
        }
      }
      catch (error) {
        console.log(error);
      }
    };
    if (year) {
      getData();
    }
  }, [year]);

  const onSubmit = async () => {
    // orders
    const monthlyResponse = await axiosInstance.get("/market/bills/monthly-value-statistic/", {
      params: {month, year}
    });
    setMonthly(monthlyResponse.data);
    const yearlyResponse = await axiosInstance.get("/market/bills/yearly-value-statistic/", {
      params: {year}
    });
    setYearly(yearlyResponse.data);
    
    // products
    const monthlyProductResponse = await axiosInstance.get("/market/products/products-statistic-count-in-month/", {
      params: {month, year}
    });
    setMonthlyProduct(monthlyProductResponse.data);
  }

  return (
    <Page title="General: E-commerce">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome
              title={`Welcome back ${user?.first_name}`}
              description="Try to make more effective for selling with our analystic."
              img={
                <MotivationIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack direction="row" justifyContent="center" spacing={3} alignItems="center">
              <FormControl>
              <InputLabel id="month-select">Month</InputLabel>
                <Select autoWidth id="month-select" label="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {listMonth && listMonth.map((item) => 
                    <MenuItem key={item} value={Number(item)}>
                      {monthNames[item-1]}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl>
              <InputLabel id="year-select">Year</InputLabel>
                <Select autoWidth id="year-select" label="Year" value={year} onChange={(e) => setYear(e.target.value)}>
                  {listYear && listYear.map((item) => 
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <Box height="100%">
                <Button fullWidth size='large' variant='contained' onClick={onSubmit}>
                  Statistic
                </Button>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={12}>
            <Card>
              <CardHeader title={<Typography variant='h3' color="primary">Orders Statistic</Typography>} />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <EcommerceWidgetSummary
                      title="Total amount in Month"
                      percent={calculatePercent(monthly?.week.map((item) => item.total_count))}
                      total={monthly?.orders_total_count}
                      chartColor={theme.palette.primary.main}
                      chartData={monthly?.week.map((item) => item.total_count) || []}
                      unit="week"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <EcommerceWidgetSummary
                      title="Total amount in Year"
                      percent={calculatePercent(yearly?.month.map((item) => item.total_count))}
                      total={yearly?.orders_total_count}
                      chartColor={theme.palette.primary.main}
                      chartData={yearly?.month.map((item) => item.total_count) || []}
                      unit="month"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <EcommerceWidgetSummary
                      title="Total Balance in Month"
                      percent={calculatePercent(monthly?.week.map((item) => item.total_value))}
                      total={monthly?.orders_total_value}
                      chartColor={theme.palette.chart.green[0]}
                      chartData={monthly?.week.map((item) => item.total_value) || []}
                      unit="week"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <EcommerceWidgetSummary
                      title="Total Balance in Year"
                      percent={calculatePercent(yearly?.month.map((item) => item.total_value))}
                      total={yearly?.orders_total_value}
                      chartColor={theme.palette.chart.green[0]}
                      chartData={yearly?.month.map((item) => item.total_value) || []}
                      unit="month"
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={12}>
                    <EcommerceYearlySales
                      title="Yearly Sales"
                      label={year}
                      onChangeLabel={(event) => setYear(event.target.value)}
                      chartLabels={yearly?.month.map((item) => monthNames[item.order_date__month])}
                      // options={yearRange()}
                      chartData={
                        {
                          label: year,
                          data: [
                            { name: 'Total amount', data: yearly?.month.map((item) => item.total_count) || [] },
                            { name: 'Total value', data: yearly?.month.map((item) => item.total_value) || [] },
                          ],
                        }
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={12}>
                    <EcommerceYearlySales
                      title="Monthly Sales"
                      options={yearly?.month.map((item) => monthNames[item.order_date__month-1])}
                      label={monthNames[month-1]}
                      onChangeLabel={(event) => setMonth(monthNames.indexOf(event.target.value) + 1)}
                      chartLabels={monthly?.day.map((item) => String(item.order_date__day))}
                      chartData={
                        {
                          label: monthNames[month-1],
                          data: [
                            { name: 'Total Amount', data: monthly?.day.map((item) => item.total_count) || []},
                            { name: 'Total Value', data: monthly?.day.map((item) => item.total_value) || []},
                          ],
                        }
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <EcommerceSalesOverview title="Sales Overview" data={_ecommerceSalesOverview} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <EcommerceCurrentBalance title="Current Balance" currentBalance={187650} sentAmount={25500} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <EcommerceBestSalesman
              title="Best Salesman"
              tableData={_ecommerceBestSalesman}
              tableLabels={[
                { id: 'seller', label: 'Seller' },
                { id: 'product', label: 'Product' },
                { id: 'country', label: 'Country', align: 'center' },
                { id: 'total', label: 'Total' },
                { id: 'rank', label: 'Rank', align: 'right' },
              ]}
            />
          </Grid> */}

          <Grid item xs={12} md={6} lg={8}>
            <Card sx={{p: 2}}>
              <CardHeader title={<Typography variant='h3' color="primary">Products Statistic</Typography>} />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={12}>
                    <EcommerceWidgetSummary
                      title="Total amount in Month"
                      percent={calculatePercent(monthlyProduct?.product_count_week.map((item) => item.total_product_count))}
                      total={monthlyProduct?.total_product_count}
                      chartColor={theme.palette.primary.main}
                      chartData={monthlyProduct?.product_count_week.map((item) => item.total_product_count) || []}
                      unit="week"
                    />
                  </Grid>
                  <Grid item xs={12} md={12} lg={12}>
                    <EcommerceYearlySales
                      title="Monthly Sales"
                      options={yearly?.month.map((item) => monthNames[item.order_date__month-1])}
                      label={monthNames[month-1]}
                      onChangeLabel={(event) => setMonth(monthNames.indexOf(event.target.value) + 1)}
                      chartLabels={monthly?.day.map((item) => String(item.order_date__day))}
                      chartData={
                        {
                          label: monthNames[month-1],
                          data: [
                            { name: 'Total Amount', data: monthly?.day.map((item) => item.total_count) || []},
                            { name: 'Total Value', data: monthly?.day.map((item) => item.total_value) || []},
                          ],
                        }
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts title="Top 10 Best Sellers" list={topBestSellers} />
          </Grid> 
        </Grid>
      </Container>
    </Page>
  );
}
