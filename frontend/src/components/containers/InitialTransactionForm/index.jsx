import React, { useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';
import * as transactionsApi from '../../../api/transactionApi';
import TransactionForm from '../TransactionForm';
import { DashboardContext } from '../../../contexts';

function InitialTransactionForm() {
  const { refreshPortfolios, selectPortfolio } = useContext(DashboardContext);
  return (
    <Grid container direction="column" justify="flex-start" alignItems="center">
      <Typography variant="h6">Create a transaction for your new portfolio!</Typography>

      <TransactionForm
        shouldCreateNewPortfolio
        onSubmit={transactionsApi.createTransaction}
        onSuccess={tx => {
          refreshPortfolios();
          selectPortfolio(tx.portfolio);
        }}
      />
    </Grid>
  );
}

export default InitialTransactionForm;
