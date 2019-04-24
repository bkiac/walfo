import React from 'react';
import { coinsApi } from '../../../api';
import { CoinTopList } from '../../views';

function TopVolumeCoins() {
  return (
    <CoinTopList
      api={coinsApi.getTopCoinsByVolume}
      type="Volume (24h)"
      options={{ volume: true }}
    />
  );
}

export default TopVolumeCoins;
