import { isEmpty } from 'lodash';
import React, { useContext } from 'react';
import { AppBar, Button, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import { UserContext } from '../../../contexts';

function GoBackToBrowser() {
  return (
    <Link to="/browse">
      <Button color="inherit">Back to coin browser</Button>
    </Link>
  );
}

function BrowseNav({ symbol }) {
  const { user } = useContext(UserContext);

  return (
    <AppBar position="static">
      <Toolbar>
        {isEmpty(user) ? (
          <>
            <Link to="/login">
              <Button color="inherit">Login</Button>
            </Link>

            <Link to="/register">
              <Button color="inherit">Register</Button>
            </Link>

            {symbol && <GoBackToBrowser />}
          </>
        ) : (
          <>
            <Link to="/dashboard">
              <Button color="inherit">Go to dashboard</Button>
            </Link>

            {symbol && <GoBackToBrowser />}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

BrowseNav.propTypes = {
  symbol: PropTypes.string,
};

BrowseNav.defaultProps = {
  symbol: undefined,
};

export default BrowseNav;
