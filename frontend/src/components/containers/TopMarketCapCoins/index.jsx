import React from 'react';
import { coinsApi } from '../../../api';
import { CoinTopList } from '../../views';

function TopMarketCapCoins() {
  return (
    <CoinTopList
      api={coinsApi.getTopCoinsByMarketCap}
      type="Market Cap"
      options={{ marketCap: true }}
    />
  );
}

export default TopMarketCapCoins;
