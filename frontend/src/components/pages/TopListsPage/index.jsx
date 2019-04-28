import { Grid } from '@material-ui/core';
import React from 'react';
import { Credit } from '../../views';
import { TopMarketCapCoins, TopVolumeCoins, SearchCoins, BrowseNav } from '../../containers';

function TopListsPage() {
  return (
    <>
      <BrowseNav />

      <div style={{ padding: '16px 40px' }}>
        <Grid container direction="row" justify="center" alignItems="center" spacing={40}>
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

        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
          style={{ marginTop: '40px' }}
        >
          <Credit />
        </Grid>
      </div>
    </>
  );
}

export default TopListsPage;
