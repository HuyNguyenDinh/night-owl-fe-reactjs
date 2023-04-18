// import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container, Button, CardHeader, Typography } from '@mui/material';
// utils
import axiosInstance from '../../utils/axios';
// sections
import { ShopProductList } from '../../sections/@dashboard/e-commerce/shop';
// routes
import { PATH_DASHBOARD, PATH_AUTH } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
// import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
// _mock_
// import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  // Profile,
  ProfileCover,
  // ProfileFriends,
  // ProfileGallery,
  // ProfileFollowers,
} from '../../sections/@dashboard/user/profile';
// import { getProducts } from '../../redux/slices/product';

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  // backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

export default function UserProfile() {
  const { themeStretch } = useSettings();

  const { user } = useAuth();

  const location = useLocation().search;

  const navigate = useNavigate();

  const id = new URLSearchParams(location).get('id');

  const [info, setInfo] = useState();

  // const { currentTab, onChangeTab } = useTabs('profile');

  // const [findFriends, setFindFriends] = useState('');

  // const handleFindFriends = (value) => {
  //   setFindFriends(value);
  // };

  const handleMessage = async() => {
    if (id) {
      const response = await axiosInstance.get(`/market/users/${id}/single-chat/`);
      // setInfo(response.data);
      navigate(PATH_DASHBOARD.chat.view(response.data.id));
    }
  }

  useEffect(() => {
    const getOwnerProducts = async () => {
      if (id) {
        const response = await axiosInstance.get(`/market/users/${id}/products/`);
        setInfo(response.data);
      }
      else if (user) {
        const response = await axiosInstance.get(`/market/users/${user.id}/products/`);
        setInfo(response.data);
      }
      else {
        navigate(PATH_AUTH.login);
      }
    };
    getOwnerProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Page title="User: Profile">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Profile"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: user?.displayName || '' },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          {/* <ProfileCover myProfile={_userAbout} /> */}
          {id ? 
            <ProfileCover avatar={info?.avatar} name={[info?.first_name, info?.last_name].join(" ")} role={info?.is_business ? "Business": "Customer"} />
          :
            <ProfileCover avatar={user?.avatar} name={[user?.first_name, user?.last_name].join(" ")} role={user?.is_business ? "Business" : "Customer"} />
          }
          {id && 
            <TabsWrapperStyle>
              <Box sx={{p: 2}}>
                <Button onClick={handleMessage} startIcon={<Iconify icon="ic:outline-message" />} variant='outlined' color='primary' sx={{backgroundColor: "white"}} fullWidth>
                  Message
                </Button>
              </Box>
              {/* <Tabs
                allowScrollButtonsMobile
                variant="scrollable"
                scrollButtons="auto"
                value={currentTab}
                onChange={onChangeTab}
              >
                {PROFILE_TABS.map((tab) => (
                  <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalCase(tab.value)} />
                ))}
              </Tabs>  */}
            </TabsWrapperStyle>
          }
        </Card>
        
        <Card sx={{p: 2}}>
          <CardHeader sx={{p: 1}} title={<Typography color="primary" variant="h4">Products</Typography>} />
          <ShopProductList products={info?.product_set || []} />
        </Card>

        {/* {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })} */}
      </Container>
    </Page>
  );
}
