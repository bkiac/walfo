import React, { useCallback } from 'react';
import * as PropTypes from 'prop-types';
import { normalize, schema } from 'normalizr';
import { PortfolioContext } from '../../../contexts';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import { portfolioApi } from '../../../api';

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
  const [portfolioResponse, refreshPortfolio] = useApiOnMount(
    portfolioApi.getPortfolio,
    portfolioName,
  );
  const isLoading = useIsLoading([portfolioResponse]);

  console.log(portfolioResponse);

  /**
   * Normalize response data and
   */
  let portfolio;
  let transactions;
  let positions;
  if (!isLoading) {
    const normalizedPortfolio = normalize(portfolioResponse.data, portfolioSchema);
    portfolio = normalizedPortfolio.entities.portfolios[portfolioName];
    ({ transactions, positions } = normalizedPortfolio.entities);
  }

  const getPositionsList = useCallback(() => Object.values(positions), [positions]);
  const getTransactionsForPosition = useCallback(
    positionId => positions[positionId].transactions.map(txId => transactions[txId]),
    [positions, transactions],
  );

  return (
    <PortfolioContext.Provider
      value={{
        isLoading,
        portfolioName,
        portfolio,
        refreshPortfolio,
        transactions,
        getTransactionsForPosition,
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
