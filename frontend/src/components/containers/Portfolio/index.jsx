import React, { useContext } from 'react';
import { Spinner, Positions } from '../../views';
import { PortfolioContext } from '../../../contexts';

function Portfolio() {
  const { getPositionsList, isLoading, getTransactionsForPosition } = useContext(PortfolioContext);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <Positions
      positions={getPositionsList()}
      getTransactionsForPosition={getTransactionsForPosition}
    />
  );
}

export default Portfolio;
