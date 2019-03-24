import React, { useCallback } from 'react';
import * as PropTypes from 'prop-types';
import { normalize, schema } from 'normalizr';
import { PortfolioContext } from '../../../contexts';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import { portfolioApi } from '../../../api';
import Spinner from '../../views/Spinner';

const transactionSchema = new schema.Entity('transactions');
const positionSchema = new schema.Entity(
  'positions',
  {
    transactions: [transactionSchema],
  },
  { idAttribute: 'symbol' },
);
const portfolioSchema = new schema.Entity(
  'portfolios',
  {
    positions: [positionSchema],
  },
  { idAttribute: 'name' },
);

function PortfolioProvider({ portfolioName, children }) {
  // Query portfolio
  const [portfolioResponse, refreshPortfolio] = useApiOnMount(
    portfolioApi.getPortfolio,
    portfolioName,
  );
  const isLoading = useIsLoading([portfolioResponse]);

  // Normalize response data and
  let portfolio;
  let transactions;
  let positions;
  if (!isLoading) {
    const normalizedPortfolio = normalize(portfolioResponse.data, portfolioSchema);
    portfolio = normalizedPortfolio.entities.portfolios[portfolioName];
    ({ transactions, positions } = normalizedPortfolio.entities);
  }

  // Memoize position and transaction lists
  const getPositionsList = useCallback(() => Object.values(positions), [portfolio]);
  const getTransactionsForPosition = useCallback(
    positionId => positions[positionId].transactions.map(txId => transactions[txId]),
    [portfolio],
  );
  const getPositionByTransactionId = useCallback(
    txId => getPositionsList().find(p => p.transactions.includes(txId)),
    [portfolio],
  );

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <PortfolioContext.Provider
      value={{
        isLoading,
        portfolioName,
        portfolio,
        refreshPortfolio,
        transactions,
        getTransactionsForPosition,
        getPositionByTransactionId,
        positions,
        getPositionsList,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

PortfolioProvider.propTypes = {
  children: PropTypes.element.isRequired,
  portfolioName: PropTypes.string.isRequired,
};

export default PortfolioProvider;
