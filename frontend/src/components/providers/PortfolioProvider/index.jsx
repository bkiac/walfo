import React, { useCallback, useContext } from 'react';
import * as PropTypes from 'prop-types';
import { normalize, schema } from 'normalizr';
import { DashboardContext, PortfolioContext } from '../../../contexts';
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

function PortfolioProvider({ children }) {
  const {
    selectedPortfolio: portfolioName,
    selectTransaction,
    openFormDialog,
    openConfirmationDialog,
  } = useContext(DashboardContext);

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

  // Memoize getters
  const getPositionsList = useCallback(() => Object.values(positions), [portfolio]);
  const getTransactionsForPosition = useCallback(
    positionId => positions[positionId].transactions.map(txId => transactions[txId]),
    [portfolio],
  );
  const getPositionByTransactionId = useCallback(
    txId => getPositionsList().find(p => p.transactions.includes(txId)),
    [portfolio],
  );
  const hasOnlyOneTransaction = useCallback(() => Object.values(transactions).length === 1, [
    portfolio,
  ]);

  // API method dashboard action wrappers
  function editTransaction(tx) {
    selectTransaction(tx);
    openFormDialog();
  }

  function removeTransaction(tx) {
    selectTransaction(tx);
    openConfirmationDialog();
  }

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <PortfolioContext.Provider
      value={{
        isLoading,
        portfolioName,
        hasOnlyOneTransaction,
        refreshPortfolio,
        transactions,
        editTransaction,
        removeTransaction,
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
};

export default PortfolioProvider;
