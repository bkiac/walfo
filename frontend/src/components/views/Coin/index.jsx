import { Grid } from '@material-ui/core';
import React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as OwnTypes from '../../../prop-types';
import { formatCurrency, formatPercentage } from '../../../formats';

function Coin({ coin, rank, marketCap, volume, price, change }) {
  return (
    <Grid container direction="row" justify="flex-start" alignItems="flex-start">
      {rank && (
        <Grid item className="text-align-center" xs={1}>
          {rank}
        </Grid>
      )}

      <Grid item xs={5}>
        <Link to={`/browse/${coin.info.Name}`}>{coin.info.CoinName || coin.info.FullName}</Link>
      </Grid>

      {marketCap && (
        <Grid item xs className="text-align-right">
          {formatCurrency(coin.marketData.MKTCAP)}
        </Grid>
      )}

      {volume && (
        <Grid item xs className="text-align-right">
          {formatCurrency(coin.marketData.TOTALVOLUME24HTO)}
        </Grid>
      )}

      {price && (
        <Grid item xs className="text-align-right">
          {formatCurrency(coin.marketData.PRICE)}
        </Grid>
      )}

      {change && (
        <Grid item xs className="text-align-right">
          {formatPercentage(coin.marketData.CHANGEPCT24HOUR / 100)}
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
