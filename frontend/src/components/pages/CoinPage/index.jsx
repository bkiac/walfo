import React from 'react';
import Debug from '../../views/Debug';

// eslint-disable-next-line react/prop-types
function CoinPage({ match }) {
  return <Debug any={match} />;
}

export default CoinPage;
