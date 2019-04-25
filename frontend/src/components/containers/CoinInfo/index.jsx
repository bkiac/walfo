import React, { useContext } from 'react';
import * as PropTypes from 'prop-types';
import { CoinsContext } from '../../../contexts';
import Debug from '../../views/Debug';

function CoinInfo({ symbol }) {
  const { coins } = useContext(CoinsContext);
  const coinInfo = coins[symbol];

  if (!coinInfo) {
    return <div>{`Oops! Seems like the '${symbol}' cryptocurrency doesn't exist!`}</div>;
  }
  return <Debug any={coinInfo} />;
}

CoinInfo.propTypes = {
  symbol: PropTypes.string.isRequired,
};

export default CoinInfo;
