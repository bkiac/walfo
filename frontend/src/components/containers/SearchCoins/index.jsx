import { Grid, TextField } from '@material-ui/core';
import React, { useContext, useMemo, useState } from 'react';
import { CoinsContext } from '../../../contexts';
import { coinsApi } from '../../../api';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import { Spinner } from '../../views';
import CoinList from '../../views/CoinList';

function SearchCoins() {
  const { coinListForInput } = useContext(CoinsContext);
  const [searchValue, setSearchValue] = useState('');

  const searchResults = useMemo(
    () =>
      coinListForInput
        .filter(({ label }) => label.toLowerCase().includes(searchValue.toLowerCase()))
        .slice(0, 10)
        .map(c => c.value),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchValue],
  );
  const [res] = useApiOnMount(coinsApi.getFullMarketDataForCoins, searchResults);
  const isLoading = useIsLoading([res]);

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <TextField
        label="Search coin"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />

      {isLoading ? <Spinner /> : <CoinList coins={res.data} price change />}
    </Grid>
  );
}

export default SearchCoins;
