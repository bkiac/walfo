import { Grid, Typography, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { coinsApi } from '../../../api';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import { Alert, Spinner, HistoricalCoinPriceGraph, HistoricalCoinVolumeGraph } from '../../views';
import style from './style.module.scss';
import { formatCurrency, formatPercentage, formatAmount, formatDate } from '../../../formats';

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
        <Typography variant="body1" className="bold">
          {field}:
        </Typography>
        <div className={className}>
          <Typography variant="body1" color="inherit">
            {value}
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
}

// eslint-disable-next-line react/prop-types
function Graphs({ symbol, startDate, endDate }) {
  const [historicalData] = useApiOnMount(
    coinsApi.getHistoricalDataForCoin,
    symbol,
    startDate,
    endDate,
  );
  return (
    <Grid container direction="row" justify="center" alignItems="center" spacing={16}>
      <Grid item xs={12} md={4}>
        <Typography variant="h6" style={{ marginBottom: '8px' }}>
          Price
        </Typography>
        <HistoricalCoinPriceGraph historicalPrices={historicalData} />
      </Grid>

      <Grid item xs={12} md={4}>
        <Typography variant="h6" style={{ marginBottom: '8px' }}>
          Volume
        </Typography>
        <HistoricalCoinVolumeGraph historicalVolumes={historicalData} />
      </Grid>
    </Grid>
  );
}

function DetailedCoin({ symbol }) {
  const [startDate, setStartDate] = useState(formatDate(dayjs().subtract('7', 'day')));
  const [endDate, setEndDate] = useState(formatDate(dayjs()));
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
  const { TotalCoinSupply } = coin.info;
  const totalySupply =
    TotalCoinSupply === '0' || TotalCoinSupply === 0 || TotalCoinSupply === 'N/A'
      ? '∞'
      : formatAmount(TotalCoinSupply);

  return (
    <>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="stretch"
        style={{ marginBottom: '32px' }}
      >
        <Grid item xs={3}>
          <img
            src={`https://cryptocompare.com${coin.info.ImageUrl}`}
            alt={`${symbol} Logo`}
            className={style.logo}
          />
        </Grid>

        <Grid item xs={3}>
          <Grid container direction="column" justify="flex-start" alignItems="stretch">
            <Typography variant="h5">General info</Typography>
            <Row field="Full Name" value={coin.info.FullName} />
            <Row field="Algorithm" value={coin.info.Algorithm} />
            <Row field="Proof Type" value={coin.info.ProofType} />
            <Row field="Total Supply" value={totalySupply} />
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
              field="Change percentage (24h)"
              value={formatPercentage(coin.marketData.CHANGEPCT24HOUR / 100, 4)}
              hasProfit={hasProfit}
            />

            <Row field="Supply" value={formatAmount(coin.marketData.SUPPLY)} />
            <Row field="Market Cap" value={formatCurrency(coin.marketData.MKTCAP)} />

            <Row
              field="USD Trading Pair Volume (24h)"
              value={formatCurrency(coin.marketData.VOLUME24HOURTO)}
            />
            <Row
              field="Total Volume (24h)"
              value={formatCurrency(coin.marketData.TOTALVOLUME24HTO)}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ marginBottom: '16px' }}
      >
        <TextField
          type="date"
          value={startDate}
          label="From"
          inputProps={{
            max: formatDate(dayjs().subtract(1, 'day')),
          }}
          onChange={e => setStartDate(e.target.value)}
          margin="none"
          style={{ marginRight: '8px' }}
        />

        <TextField
          type="date"
          label="To"
          value={endDate}
          inputProps={{
            max: formatDate(dayjs()),
          }}
          onChange={e => setEndDate(e.target.value)}
          margin="none"
        />
      </Grid>

      <Graphs symbol={symbol} startDate={startDate} endDate={endDate} />
    </>
  );
}

DetailedCoin.propTypes = {
  symbol: PropTypes.string.isRequired,
};

export default DetailedCoin;
