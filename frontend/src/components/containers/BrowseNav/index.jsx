import { isEmpty } from 'lodash';
import React, { useContext } from 'react';
import { AppBar, Button, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../contexts';

function BrowseNav() {
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
          </>
        ) : (
          <Link to="/dashboard">
            <Button color="inherit">Go to dashboard</Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default BrowseNav;
