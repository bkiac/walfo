import React, { useCallback, useContext, useMemo, useState } from 'react';
import * as PropTypes from 'prop-types';
import { normalize, schema } from 'normalizr';
import { minBy } from 'lodash';
import dayjs from 'dayjs';
import { DashboardContext, PortfolioContext } from '../../../contexts';
import { useApiOnMount, useIsLoading } from '../../../hooks';
import { portfolioApi } from '../../../api';
import { Spinner } from '../../views';

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

  const [queryDate, setQueryDate] = useState();
  const [queryTags, setQueryTags] = useState();

  // Normalize response data
  const normalizedPortfolio = useMemo(
    () => !isLoading && normalize(portfolioResponse.data, portfolioSchema),
    [portfolioResponse],
  );
  const portfolio = useMemo(
    () => normalizedPortfolio.entities && Object.values(normalizedPortfolio.entities.portfolios)[0],
    [normalizedPortfolio],
  );
  const transactions = useMemo(
    () => normalizedPortfolio.entities && normalizedPortfolio.entities.transactions,
    [normalizedPortfolio],
  );
  const positions = useMemo(
    () => normalizedPortfolio.entities && normalizedPortfolio.entities.positions,
    [normalizedPortfolio],
  );

  // Memoize getters
  const getPositionsList = useCallback(() => Object.values(positions), [positions]);
  const getTransactionsForPosition = useCallback(
    positionId => positions[positionId].transactions.map(txId => transactions[txId]),
    [positions, transactions],
  );
  const getPositionByTransactionId = useCallback(
    txId => getPositionsList().find(p => p.transactions.includes(txId)),
    [getPositionsList],
  );
  const hasOnlyOneTransaction = useCallback(() => Object.values(transactions).length === 1, [
    transactions,
  ]);
  const getDateOfFirstTransaction = useCallback(
    () => dayjs(minBy(Object.values(transactions), 'date').date).format('YYYY-MM-DD'),
    [transactions],
  );

  // API method dashboard action wrappers
  function addTransaction() {
    openFormDialog();
  }
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
        portfolio,
        portfolioName,
        hasOnlyOneTransaction,
        refreshPortfolio,
        transactions,
        getDateOfFirstTransaction,
        addTransaction,
        editTransaction,
        removeTransaction,
        getTransactionsForPosition,
        getPositionByTransactionId,
        positions,
        getPositionsList,
        queryDate: queryDate || getDateOfFirstTransaction(),
        setQueryDate,
        queryTags,
        setQueryTags,
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
