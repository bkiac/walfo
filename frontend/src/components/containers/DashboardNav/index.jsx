import React, { useContext } from 'react';
import { AppBar, Button, Toolbar, IconButton, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { DashboardContext } from '../../../contexts';
import { useLogout } from '../../../hooks';

function DashboardNav() {
  const logout = useLogout();
  const { selectedPortfolio, NEW_PORTFOLIO, openDrawer, openChangePasswordDialog } = useContext(
    DashboardContext,
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton variant="contained" color="inherit" onClick={openDrawer}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
          {selectedPortfolio === NEW_PORTFOLIO ? 'New portfolio' : selectedPortfolio}
        </Typography>

        <Button color="inherit" onClick={openChangePasswordDialog}>
          Change password
        </Button>
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default DashboardNav;
