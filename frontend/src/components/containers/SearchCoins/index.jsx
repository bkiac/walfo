import { Grid, TextField, Typography } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { CoinsContext } from '../../../contexts';
import { coinsApi } from '../../../api';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import { Spinner, CoinList } from '../../views';
import style from './style.module.scss';

const WAIT_INTERVAL = 1000;

function search(coinList, value) {
  return coinList
    .filter(({ label }) => label.toLowerCase().includes(value.toLowerCase()))
    .slice(0, 10)
    .map(c => c.value);
}

function SearchCoins() {
  const { coinListForInput } = useContext(CoinsContext);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState(search(coinListForInput, ''));
  const [timer, setTimer] = useState(null);

  function handleChange({ target: { value } }) {
    clearTimeout(timer);
    setSearchValue(value);
    setTimer(setTimeout(() => setSearchResults(search(coinListForInput, value)), WAIT_INTERVAL));
  }

  const [res] = useApiOnMount(coinsApi.getFullMarketDataForCoins, searchResults);
  const isLoading = useIsLoading([res]);

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <TextField label="Search cryptocurrencies" value={searchValue} onChange={handleChange} />

      <Grid container className={`bold ${style.header}`}>
        <Grid item xs={5}>
          <Typography variant="subtitle2">Name</Typography>
        </Grid>

        <Grid item xs className="text-align-right">
          <Typography variant="subtitle2">Price</Typography>
        </Grid>

        <Grid item xs className="text-align-right">
          <Typography variant="subtitle2"> Change (24h)</Typography>
        </Grid>
      </Grid>

      <div>{isLoading ? <Spinner /> : <CoinList coins={res.data} price change />}</div>
    </Grid>
  );
}

export default SearchCoins;
