import { useState, useEffect, useRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Button, CardHeader, Typography, Card, CardContent } from '@mui/material';
// utils
import { kFormat } from '../../utils/formatNumber';
import axiosInstance from '../../utils/axios';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// _mock_
import {
  _ecommerceNewProducts,
  _ecommerceSalesOverview,
  _ecommerceBestSalesman,
  _ecommerceLatestProducts,
} from '../../_mock';
// components
import Page from '../../components/Page';
// sections
import {
  EcommerceNewProducts,
  EcommerceYearlySales,
  EcommerceBestSalesman,
  EcommerceSaleByGender,
  EcommerceWidgetSummary,
  EcommerceSalesOverview,
  EcommerceLatestProducts,
  EcommerceCurrentBalance,
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

  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);

  const [year, setYear] = useState(now.getFullYear());

  const monthRef = useRef();

  const yearRef = useRef();

  const [monthly, setMonthly] = useState();

  const [yearly, setYearly] = useState();

  const theme = useTheme();

  const { themeStretch } = useSettings();

  const yearRange = () => {
    let years = [];
    let i = now.getFullYear();
    while(i >= 1970) {
      years = [...years, i];
      i-=1;
    }
    return years;
  }

  const calculatePercent = (listValue) => {
    let ref = 1;
    let percent = 0;
    if (listValue) {
      ref = listValue[0];
      for (let i = 0; i < listValue.length; i+=1) {
        percent = listValue[i] / ref * 100;
        ref = listValue[i];
      }
    }
    return percent
  }

  useEffect(() => {
    const initData = async () => {
      try {
        const monthlyResponse = await axiosInstance.get("/market/bills/monthly-value-statistic/", {
          params: {month, year}
        });
        setMonthly(monthlyResponse.data);
        const yearlyResponse = await axiosInstance.get("/market/bills/yearly-value-statistic/", {
          params: {year}
        });
        setYearly(yearlyResponse.data);
        monthRef.current = month;
        yearRef.current = year;
      }
      catch(error) {
        setMonth(monthRef.current);
        setYear(yearRef.current);
        console.error(error);
      }
    }
    initData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, month, year])

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
              // action={<Button variant="contained">Go Now</Button>}
            />
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <EcommerceNewProducts list={_ecommerceNewProducts} />
          </Grid> */}

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
                      options={yearRange()}
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
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts title="Latest Products" list={_ecommerceLatestProducts} />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
