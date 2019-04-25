import React from 'react';
import { CoinInfo } from '../../containers';

// eslint-disable-next-line react/prop-types
function CoinInfoPage({ match }) {
  return <CoinInfo symbol={match.params.symbol.toUpperCase()} />;
}

export default CoinInfoPage;
