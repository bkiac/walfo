import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import * as PropTypes from 'prop-types';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import CoinList from '../CoinList';
import Spinner from '../Spinner';
import style from './style.module.scss';

function CoinTopList({ api, type, tableName, options }) {
  const [res] = useApiOnMount(api);
  const isLoading = useIsLoading([res]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Grid item style={{ height: 56, marginBottom: 8 }}>
        <Typography variant="h6" style={{ lineHeight: '56px' }}>
          {type}
        </Typography>
      </Grid>

      <Grid container className={`bold ${style.header}`}>
        <Grid item xs={1} className="text-align-center">
          <Typography variant="subtitle2">#</Typography>
        </Grid>

        <Grid item xs={3}>
          <Typography variant="subtitle2">Name</Typography>
        </Grid>

        <Grid item xs className="text-align-right">
          <Typography variant="subtitle2"> {tableName}</Typography>
        </Grid>
      </Grid>

      <CoinList coins={res.data} marketCap={options.marketCap} volume={options.volume} />
    </Grid>
  );
}

CoinTopList.propTypes = {
  api: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  options: PropTypes.shape({
    marketCap: PropTypes.bool,
    volume: PropTypes.bool,
  }).isRequired,
};

export default CoinTopList;
