import React from 'react';
import Button from '@material-ui/core/Button';
import Logout from '../../containers/Logout';

function DashboardPage() {
  return (
    <>
      <p>Dashboard</p>

      <Logout>
        {logout => (
          <Button variant="contained" color="primary" onClick={logout}>
            Logout
          </Button>
        )}
      </Logout>
    </>
  );
}

export default DashboardPage;
