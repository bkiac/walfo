import React from 'react';
import { loginFromLocalStorage } from '../../services/authService';

const user = loginFromLocalStorage();

const UserContext = React.createContext({
  user: user || {},
  setUser: () => {},
});

export default UserContext;
