import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as OwnTypes from '../../../prop-types';
import { formatCurrency, formatPercentage } from '../../../formats';
import style from './style.module.scss';

function Coin({ coin, rank, marketCap, volume, price, change }) {
  const hasProfit = coin.marketData.CHANGEPCT24HOUR >= 0;
  return (
    <Grid container direction="row" justify="flex-start" alignItems="center" className={style.coin}>
      {rank && (
        <Grid item className="text-align-center" xs={1}>
          {rank}
        </Grid>
      )}

      <Grid item xs={5} className="bold">
        <Link to={`/browse/${coin.info.Name}`}>
          <Grid container direction="row" justify="flex-start" alignItems="center">
            <img
              src={`https://cryptocompare.com/${coin.info.ImageUrl}`}
              alt="Coin logo"
              className={style.logo}
            />
            <Typography className={style.coinName}>
              {coin.info.CoinName || coin.info.FullName}
            </Typography>
          </Grid>
        </Link>
      </Grid>

      {marketCap && (
        <Grid item xs className="text-align-right">
          {formatCurrency(coin.marketData.MKTCAP, 0)}
        </Grid>
      )}

      {volume && (
        <Grid item xs className="text-align-right">
          {formatCurrency(coin.marketData.TOTALVOLUME24HTO, 0)}
        </Grid>
      )}

      {price && (
        <Grid item xs className="text-align-right">
          {formatCurrency(coin.marketData.PRICE, 4)}
        </Grid>
      )}

      {change && (
        <Grid item xs className={`text-align-right ${hasProfit ? style.gain : style.loss}`}>
          {formatPercentage(coin.marketData.CHANGEPCT24HOUR / 100, 4)}
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
