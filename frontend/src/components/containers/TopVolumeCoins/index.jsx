import React from 'react';
import { coinsApi } from '../../../api';
import { CoinTopList } from '../../views';

function TopVolumeCoins() {
  return (
    <CoinTopList
      api={coinsApi.getTopCoinsByVolume}
      type="Top cryptocurrencies by 24h volume"
      tableName="Volume (24h)"
      options={{ volume: true }}
    />
  );
}

export default TopVolumeCoins;
