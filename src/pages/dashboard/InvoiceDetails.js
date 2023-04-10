import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// utils
import axiosInstance from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
// import { _invoices } from '../../_mock';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import Invoice from '../../sections/@dashboard/invoice/details';

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings();

  const { id } = useParams();
  
  const [order, setOrder] = useState();

  // const invoice = _invoices.find((invoice) => invoice.id === id);
  
  useEffect(() => {
    const getOrder = async () => {
      const response = await axiosInstance.get(`/market/orders/${id}/`);
      setOrder(response.data);
    };
    getOrder();
  }, [id])

  return (
    <Page title="Invoice: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Invoice Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Invoices',
              href: PATH_DASHBOARD.invoice.root,
            },
            { name: `Order-${order?.id}` || '' },
          ]}
        />

        {order && <Invoice invoice={order} />}
      </Container>
    </Page>
  );
}
