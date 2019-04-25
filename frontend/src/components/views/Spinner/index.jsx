import React from 'react';
import { CircularProgress, Grid } from '@material-ui/core';

function Spinner() {
  return (
    <Grid container direction="column" justify="center" alignItems="center" className="height-100p">
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  );
}

export default Spinner;
