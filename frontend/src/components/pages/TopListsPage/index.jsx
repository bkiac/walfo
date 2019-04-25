import { Grid } from '@material-ui/core';
import React from 'react';
import { TopMarketCapCoins, TopVolumeCoins, SearchCoins, BrowseNav } from '../../containers';

function TopListsPage() {
  return (
    <>
      <BrowseNav />

      <div style={{ padding: '0 16px' }}>
        <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
          <Grid item xs={12} md={4}>
            <SearchCoins />
          </Grid>

          <Grid item xs={12} md={4}>
            <TopMarketCapCoins />
          </Grid>

          <Grid item xs={12} md={4}>
            <TopVolumeCoins />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default TopListsPage;
