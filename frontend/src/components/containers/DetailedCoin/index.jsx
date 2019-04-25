import { Grid, Typography, Link } from '@material-ui/core';
import React from 'react';
import * as PropTypes from 'prop-types';
import { coinsApi } from '../../../api';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import { Alert, Spinner } from '../../views';
import Debug from '../../views/Debug';
import style from './style.module.scss';
import { formatCurrency, formatPercentage, formatAmount } from '../../../formats';

// eslint-disable-next-line react/prop-types
function Row({ field, value, hasProfit }) {
  let className = '';
  if (hasProfit !== undefined) {
    className = `${className} ${hasProfit ? style.gain : style.loss}`;
  }

  return (
    <Grid item>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
        style={{ marginBottom: '4px' }}
      >
        <Typography variant="body1" className="bold">{field}:</Typography>
        <div className={className}>
          <Typography variant="body1" color="inherit">
            {value}
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
}

function DetailedCoin({ symbol }) {
  const [res] = useApiOnMount(coinsApi.getFullMarketDataForCoins, symbol);
  const isLoading = useIsLoading([res]);

  if (isLoading) {
    return <Spinner />;
  }

  if (res.hasError) {
    return <Alert error>{`Oops! Seems like the '${symbol}' cryptocurrency doesn't exist!`}</Alert>;
  }

  const coin = res.data[0];
  const hasProfit = coin.marketData.CHANGE24HOUR >= 0;

  return (
    <>
      <Grid container direction="row" justify="center" alignItems="stretch">
        <Grid item xs={3}>
          <img
            src={`https://cryptocompare.com${coin.info.ImageUrl}`}
            alt={`${symbol} Logo`}
            className={style.logo}
          />
        </Grid>

        <Grid item xs={2}>
          <Grid container direction="column" justify="flex-start" alignItems="stretch">
            <Typography variant="h5">General info</Typography>
            <Row field="Full Name" value={coin.info.FullName} />
            <Row field="Algorithm" value={coin.info.Algorithm} />
            <Row field="Proof Type" value={coin.info.ProofType} />
            <Row field="Total Supply" value={formatAmount(coin.info.TotalCoinSupply)} />
            <Row field="Mined" value={formatAmount(coin.info.TotalCoinsMined)} />

            <div style={{ marginBottom: '8px' }} />

            <Typography variant="h5">Market data</Typography>
            <Row field="Price" value={formatCurrency(coin.marketData.PRICE, 4)} />
            <Row field="24h High" value={formatCurrency(coin.marketData.HIGH24HOUR, 4)} />
            <Row field="24h Low" value={formatCurrency(coin.marketData.LOW24HOUR, 4)} />
            <Row
              field="Change (24h)"
              value={formatCurrency(coin.marketData.CHANGE24HOUR, 4)}
              hasProfit={hasProfit}
            />
            <Row
              field="Change (24h)"
              value={formatPercentage(coin.marketData.CHANGEPCT24HOUR / 100, 4)}
              hasProfit={hasProfit}
            />

            <Row field="Supply" value={formatAmount(coin.marketData.SUPPLY)} />
            <Row field="Market Cap" value={formatCurrency(coin.marketData.MKTCAP)} />

            <Row field="Volume (24h)" value={formatCurrency(coin.marketData.TOTALVOLUME24HTO)} />
          </Grid>
        </Grid>
      </Grid>

      <Debug any={coin} />
    </>
  );
}

DetailedCoin.propTypes = {
  symbol: PropTypes.string.isRequired,
};

export default DetailedCoin;
