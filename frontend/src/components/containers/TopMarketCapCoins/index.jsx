import React from 'react';
import { coinsApi } from '../../../api';
import { CoinTopList } from '../../views';

function TopMarketCapCoins() {
  return (
    <CoinTopList
      api={coinsApi.getTopCoinsByMarketCap}
      type="Top cryptocurrencies by market cap"
      tableName="Market Cap"
      options={{ marketCap: true }}
    />
  );
}

export default TopMarketCapCoins;
