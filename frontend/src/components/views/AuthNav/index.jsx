import React from 'react';
import { AppBar, Button, Toolbar } from '@material-ui/core';
import { Link } from 'react-router-dom';

function AuthNav() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/browse">
          <Button color="inherit">Browse coins</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default AuthNav;
