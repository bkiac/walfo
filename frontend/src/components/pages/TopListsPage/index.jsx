import { Grid } from '@material-ui/core';
import React from 'react';
import { TopMarketCapCoins, TopVolumeCoins } from '../../containers';

function TopListsPage() {
  return (
    <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
      <Grid item xs={12} md={4}>
        <TopMarketCapCoins />
      </Grid>

      <Grid item xs={12} md={4}>
        <TopVolumeCoins />
      </Grid>

      <Grid item xs={12} md={4}>
        Volume
      </Grid>
    </Grid>
  );
}

export default TopListsPage;
