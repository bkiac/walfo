import React from 'react';
import { CoinInfo, BrowseNav } from '../../containers';

// eslint-disable-next-line react/prop-types
function CoinInfoPage({ match }) {
  return (
    <>
      <BrowseNav />
      <CoinInfo symbol={match.params.symbol.toUpperCase()} />
    </>
  );
}

export default CoinInfoPage;
