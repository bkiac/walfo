import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../../contexts';
import axios from '../../utils/axios';

/**
 * @todo: Fix unnecessary additional rerender due to new object creation in each render
 * @see: https://reactjs.org/docs/context.html#caveats
 */
function UserProvider({ children }) {
  const userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(userFromLocalStorage);

  function storeUser(newUser) {
    axios.setBearerToken(newUser.token);
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  }

  function removeUser() {
    axios.removeBearerToken();
    localStorage.removeItem('user');
    setUser(undefined);
  }

  return (
    <UserContext.Provider value={{ user, storeUser, removeUser }}>{children}</UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default UserProvider;
