import React, { useContext } from 'react';
import TransactionForm from '../TransactionForm';
import { DashboardContext, PortfolioContext } from '../../../contexts';
import * as transactionsApi from '../../../api/transactionApi';

function AddTransactionToPortfolioForm() {
  const { selectedTransaction, closeDialog, portfolios } = useContext(DashboardContext);
  const {
    portfolioName,
    transactions,
    positions,
    refreshPortfolio,
    getPositionByTransactionId,
    getHoldingsForPosition,
    getTagsForPosition,
  } = useContext(PortfolioContext);

  const tx = transactions[selectedTransaction];
  if (tx) {
    const position = getPositionByTransactionId(tx.id);
    tx.symbol = position.symbol;
    tx.tags = position.tags;
  }

  return (
    <TransactionForm
      onSuccess={() => {
        closeDialog();
        refreshPortfolio();
      }}
      portfolios={portfolios}
      getTagsForPosition={getTagsForPosition}
      getHoldingsForPosition={getHoldingsForPosition}
      initialValues={tx}
      portfolioName={portfolioName}
      onSubmit={tx ? transactionsApi.updateTransaction : transactionsApi.createTransaction}
      positions={positions}
    />
  );
}

export default AddTransactionToPortfolioForm;
