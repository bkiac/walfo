import { Grid } from '@material-ui/core';
import React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as OwnTypes from '../../../prop-types';
import { formatCurrency } from '../../../formats';

function Coin({ coin, rank, marketCap, volume, price, change }) {
  return (
    <Grid container direction="row" justify="flex-start" alignItems="flex-start">
      {rank && (
        <Grid item className="text-align-center" xs={1}>
          {rank}
        </Grid>
      )}

      <Grid item xs={3}>
        <Link to={`/browse/${coin.CoinInfo.Name}`}> {coin.CoinInfo.FullName}</Link>
      </Grid>

      {marketCap && (
        <Grid item xs className="text-align-right">
          {formatCurrency(coin.RAW.USD.MKTCAP)}
        </Grid>
      )}

      {volume && (
        <Grid item xs className="text-align-right">
          {formatCurrency(coin.RAW.USD.TOTALVOLUME24HTO)}
        </Grid>
      )}

      {price && (
        <Grid item xs className="text-align-right">
          {formatCurrency(coin.RAW.USD.PRICE)}
        </Grid>
      )}

      {change && (
        <Grid item xs className="text-align-right">
          {formatCurrency(coin.RAW.USD.CHANGEPCT24HOUR)}
        </Grid>
      )}
    </Grid>
  );
}

Coin.propTypes = {
  coin: OwnTypes.coin.isRequired,
  rank: PropTypes.number,
  marketCap: PropTypes.bool,
  volume: PropTypes.bool,
  price: PropTypes.bool,
  change: PropTypes.bool,
};

Coin.defaultProps = {
  rank: undefined,
  marketCap: false,
  volume: false,
  price: false,
  change: false,
};

export default Coin;
