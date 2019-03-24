import React, { useCallback, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { normalize, schema } from 'normalizr';
import { PortfolioContext } from '../../../contexts';
import { useApiCallback, useApiOnMount, useIsLoading } from '../../../hooks';
import { portfolioApi, transactionApi } from '../../../api';

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
  const getPositionsList = useCallback(() => Object.values(positions), [positions]);
  const getTransactionsForPosition = useCallback(
    positionId => positions[positionId].transactions.map(txId => transactions[txId]),
    [positions, transactions],
  );

  // Expose transaction API methods through this provider to always refresh on successful operation
  const [createResponse, createTx] = useApiCallback(transactionApi.createTransaction);
  const [updateResponse, updateTx] = useApiCallback(transactionApi.updateTransaction);
  const [deleteResponse, deleteTx] = useApiCallback(transactionApi.deleteTransaction);
  useEffect(() => {
    if (createResponse.hasSuccess || updateResponse.hasSuccess || deleteResponse.hasSuccess) {
      refreshPortfolio();
    }
  }, [createResponse.hasSuccess, updateResponse.hasSuccess, deleteResponse.hasSuccess]);
  const txApi = {
    create: [createResponse, createTx],
    update: [updateResponse, updateTx],
    delete: [deleteResponse, deleteTx],
  };

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
        transactionApi: txApi,
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
