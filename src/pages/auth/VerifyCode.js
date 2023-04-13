import { useLocation } from 'react-router';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Container, Typography } from '@mui/material';
// utils
import axiosInstance from '../../utils/axios';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// components
import Page from '../../components/Page';
// sections
import { VerifyCodeForm } from '../../sections/auth/verify-code';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function VerifyCode() {

  const { pathname } = useLocation();

  const isKYC = pathname.includes("kyc");
  const isPhone = pathname.includes("phone");

  const handleResendCode = async () => {
    if (isKYC) {
      if (isPhone) {
        await axiosInstance.get("/market/users/send-verified-code-to-phone-number/");
      }
      else {
        await axiosInstance.get("/market/users/send-verified-code-to-email/");
      }
    }
    else {
      await axiosInstance.post("/market/users/get-reset-code-by-email/", {
        email: sessionStorage.getItem('email-recovery')
      });
    }
  }

  return (
    <Page title="Verify Code">
      <LogoOnlyLayout />

      <Container>
        <ContentStyle sx={{ textAlign: 'center' }}>
          <Typography variant="h3" paragraph>
            {!isPhone && "Please check your email!"}
            {isPhone && "Please check your phone"}
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            We have send a 4-digit confirmation code to {isPhone ? "phone" : "email"}, please enter the code in below box to {isKYC && isPhone && "verify your phone number"} {isKYC && !isPhone && "verify you email"} {!isKYC && "reset your password"}
          </Typography>

          <Box sx={{ mt: 5, mb: 3 }}>
            <VerifyCodeForm />
          </Box>

          <Typography variant="body2">
            Don’t have a code? &nbsp;
            <Link variant="subtitle2" onClick={handleResendCode}>
              Resend code
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </Page>
  );
}
