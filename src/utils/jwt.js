import jwtDecode from 'jwt-decode';
// routes
import { PATH_AUTH } from '../routes/paths';
//
import axios from './axios';
import { HOST_API } from '../config';

// ----------------------------------------------------------------------

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const handleTokenExpired = (exp) => {
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;
  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    // eslint-disable-next-line no-alert
    const getAccessToken = async() => {
      const response = await axios.get(HOST_API + PATH_AUTH.refresh);
      if (response.status === 200) {
        const {access, refresh} = response.data;
        setSession(access, refresh);
      }
      else {
        window.location.href = PATH_AUTH.login;
      }
    }
    localStorage.removeItem('accessToken');
    getAccessToken();
  }, timeLeft);
};

const setSession = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken); // ~5 days by minimals server
    handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession };
