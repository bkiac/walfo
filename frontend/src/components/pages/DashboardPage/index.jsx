import React from 'react';
import Button from '@material-ui/core/Button';
import { useLogout } from '../../../hooks';

function DashboardPage() {
  const logout = useLogout();
  return (
    <>
      <p>Dashboard</p>

      <Button variant="contained" color="primary" onClick={logout}>
        Logout
      </Button>
    </>
  );
}

export default DashboardPage;
