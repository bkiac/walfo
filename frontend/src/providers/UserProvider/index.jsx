import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../../contexts';
import { loginFromLocalStorage } from '../../services/authService';

/**
 * @todo: Fix unnecessary additional rerender due to new object creation in each render
 * @see: https://reactjs.org/docs/context.html#caveats
 */
function UserProvider({ children }) {
  const [user, setUser] = useState(loginFromLocalStorage());
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default UserProvider;
