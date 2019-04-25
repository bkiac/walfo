import { Grid } from '@material-ui/core';
import React from 'react';
import * as PropTypes from 'prop-types';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import CoinList from '../CoinList';
import Spinner from '../Spinner';

function CoinTopList({ api, type, options }) {
  const [res] = useApiOnMount(api);
  const isLoading = useIsLoading([res]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Grid container>
        <Grid item xs={1} className="text-align-center">
          #
        </Grid>

        <Grid item xs={3}>
          Name
        </Grid>

        <Grid item xs className="text-align-right">
          {type}
        </Grid>
      </Grid>

      <CoinList coins={res.data} marketCap={options.marketCap} volume={options.volume} />
    </Grid>
  );
}

CoinTopList.propTypes = {
  api: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  options: PropTypes.shape({
    marketCap: PropTypes.bool,
    volume: PropTypes.bool,
  }).isRequired,
};

export default CoinTopList;