import { Grid } from '@material-ui/core';
import React from 'react';
import { DetailedCoin, BrowseNav } from '../../containers';

// eslint-disable-next-line react/prop-types
function DetailedCoinPage({ match }) {
  return (
    <>
      <BrowseNav />
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ padding: '16px 16px' }}
      >
        <DetailedCoin symbol={match.params.symbol.toUpperCase()} />
      </Grid>
    </>
  );
}

export default DetailedCoinPage;
