import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import { PATH_AUTH } from '../routes/paths';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  SETADDRESS: (state, action) => {

    const userWithNewAddress = {
      ...state.user,
      address: action.payload
    }

    return {
      ...state,
      isAuthenticated: true,
      user: userWithNewAddress
    }
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  setUser: () => Promise.resolve(),
  setAddress: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  
  useEffect(() => {
    const initialize = async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken && isValidToken(refreshToken)) {
          const firstResponse = await axios.post(PATH_AUTH.refresh, {
            refresh: refreshToken
          })
          if (firstResponse.status === 200) {
            localStorage.removeItem("refreshToken");
            localStorage.setItem("accessToken", firstResponse.data.access);
            localStorage.setItem("refreshToken", firstResponse.data.refresh);
            setSession(firstResponse.data.access, firstResponse.data.refresh);
            const secondResponse = await axios.get(PATH_AUTH.currentUser);
            const user = secondResponse.data;

            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user,
              },
            });
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  

  const login = async (email, password) => {
    const response = await axios.post('/api/token/', {
      email,
      password,
    });
    const { access, refresh } = response.data;

    setSession(access, refresh);

    const currentUserResponse = await axios.get(PATH_AUTH.currentUser);
    const user = currentUserResponse.data;
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const setUser = async (user) => {
    dispatch({
      type: "LOGIN",
      payload: {
        user
      }
    })
  }

  const setAddress = async (address) => {
    dispatch({
      type: "SETADDRESS",
      payload: {
        address
      }
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        setUser,
        setAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
