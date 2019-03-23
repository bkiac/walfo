import React, { useContext } from 'react';
import { Spinner, Positions } from '../../views';
import { PortfolioContext } from '../../../contexts';

function Portfolio() {
  const { getPositionsList, prices, isLoading, getTransactionsForPosition } = useContext(
    PortfolioContext,
  );

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <Positions
      positions={getPositionsList()}
      getTransactionsForPosition={getTransactionsForPosition}
      currentPrices={prices}
    />
  );
}

export default Portfolio;
