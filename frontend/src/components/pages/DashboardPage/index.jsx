import React from 'react';
import { Grid } from '@material-ui/core';
import { Dashboard } from '../../containers';

function DashboardPage() {
  return (
    <Grid container direction="column" justify="flex-start" alignItems="center">
      <Dashboard />
    </Grid>
  );
}

export default DashboardPage;
