import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import * as PropTypes from 'prop-types';
import { normalize, schema } from 'normalizr';
import { minBy, uniq } from 'lodash';
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

  const [queryDate, setQueryDate] = useState();
  const [queryTags, setQueryTags] = useState();

  // Query portfolio
  const [basePortfolioResponse, refreshBasePortfolio] = useApiOnMount(
    portfolioApi.getPortfolio,
    portfolioName,
  );
  const cachedBasePortfolio = useRef();

  const [filteredPortfolioResponse, refreshFilteredPortfolio] = useApiOnMount(
    portfolioApi.getPortfolio,
    portfolioName,
    queryTags,
  );
  const cachedFilteredPortfolio = useRef();

  const isLoading = useIsLoading([basePortfolioResponse, filteredPortfolioResponse]);

  function refreshPortfolio() {
    refreshBasePortfolio();
    refreshFilteredPortfolio();
  }

  // Normalize response data
  const normalizedBasePortfolio = useMemo(() => {
    // Use the cached data if it's available and response is still pending
    if (!basePortfolioResponse.isLoading || cachedBasePortfolio.current) {
      return normalize(basePortfolioResponse.data || cachedBasePortfolio.current, portfolioSchema);
    }
    return undefined;
  }, [basePortfolioResponse]);
  const basePositions = useMemo(
    () => normalizedBasePortfolio && normalizedBasePortfolio.entities.positions,
    [normalizedBasePortfolio],
  );
  const baseTransactions = useMemo(
    () => normalizedBasePortfolio && normalizedBasePortfolio.entities.transactions,
    [normalizedBasePortfolio],
  );

  const normalizedFilteredPortfolio = useMemo(() => {
    // Use the cached data if it's available and response is still pending
    if (!filteredPortfolioResponse.isLoading || cachedFilteredPortfolio.current) {
      return normalize(
        filteredPortfolioResponse.data || cachedFilteredPortfolio.current,
        portfolioSchema,
      );
    }
    return undefined;
  }, [filteredPortfolioResponse]);
  const filteredPortfolio = useMemo(
    () =>
      normalizedFilteredPortfolio &&
      Object.values(normalizedFilteredPortfolio.entities.portfolios)[0],
    [normalizedFilteredPortfolio],
  );
  const filteredPositions = useMemo(
    () => normalizedFilteredPortfolio && normalizedFilteredPortfolio.entities.positions,
    [normalizedFilteredPortfolio],
  );
  const filteredTransactions = useMemo(
    () => normalizedFilteredPortfolio && normalizedFilteredPortfolio.entities.transactions,
    [normalizedFilteredPortfolio],
  );

  // Memoize getters
  const getBasePositionsList = useCallback(() => Object.values(basePositions), [basePositions]);
  const getBaseTransactionsList = useCallback(() => Object.values(baseTransactions), [
    baseTransactions,
  ]);

  const getFilteredPositionsList = useCallback(
    () => (filteredPositions ? Object.values(filteredPositions) : []),
    [filteredPositions],
  );

  // Memoize helpers
  const getTransactionsForPosition = useCallback(
    positionId => basePositions[positionId].transactions.map(txId => baseTransactions[txId]),
    [basePositions, baseTransactions],
  );
  const getPositionByTransactionId = useCallback(
    txId => getBasePositionsList().find(p => p.transactions.includes(txId)),
    [getBasePositionsList],
  );
  const hasOnlyOneTransaction = useCallback(() => Object.values(baseTransactions).length === 1, [
    baseTransactions,
  ]);
  const getDateOfFirstTransaction = useCallback(
    () => dayjs(minBy(getBaseTransactionsList(), 'date').date).format('YYYY-MM-DD'),
    [getBaseTransactionsList],
  );
  const getAllTags = useCallback(
    () => uniq(getBasePositionsList().reduce((tags, p) => [...tags, ...p.tags], [])),
    [getBasePositionsList],
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

  if (
    (cachedBasePortfolio.current === undefined || cachedFilteredPortfolio.current === undefined) &&
    isLoading
  ) {
    return <Spinner />;
  }

  cachedBasePortfolio.current = !basePortfolioResponse.isLoading
    ? basePortfolioResponse.data
    : cachedBasePortfolio.current;
  cachedFilteredPortfolio.current = !filteredPortfolioResponse.isLoading
    ? filteredPortfolioResponse.data
    : filteredPortfolioResponse.current;

  return (
    <PortfolioContext.Provider
      value={{
        portfolio: filteredPortfolio,
        portfolioName,
        hasOnlyOneTransaction,
        refreshPortfolio,
        transactions: filteredTransactions,
        getDateOfFirstTransaction,
        addTransaction,
        editTransaction,
        removeTransaction,
        getTransactionsForPosition,
        getPositionByTransactionId,
        positions: filteredPositions,
        getPositionsList: getFilteredPositionsList,
        queryDate: queryDate || getDateOfFirstTransaction(),
        setQueryDate,
        getAllTags,
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
