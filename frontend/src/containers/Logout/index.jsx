import React, { useContext } from 'react';
import * as PropTypes from 'prop-types';
import { UserContext } from '../../contexts';
import * as authService from '../../services/authService';

function Logout({ children }) {
  const userContext = useContext(UserContext);

  const logout = () => {
    userContext.setUser({});
    authService.logout();
  };

  return <>{children(logout)}</>;
}

Logout.propTypes = {
  children: PropTypes.func.isRequired,
};

export default Logout;
