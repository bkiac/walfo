import React, { useContext, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import { DashboardContext, PortfolioContext } from '../../../contexts';
import { useApiCallback } from '../../../hooks';
import { transactionApi } from '../../../api';

function DeleteTransactionConfirmation() {
  const {
    closeDialog,
    selectedTransaction,
    selectPortfolio,
    portfolios,
    NEW_PORTFOLIO,
    refreshPortfolios,
  } = useContext(DashboardContext);
  const { transactions, hasOnlyOneTransaction, refreshPortfolio } = useContext(PortfolioContext);
  const [response, deleteTx] = useApiCallback(transactionApi.removeTransaction);

  useEffect(() => {
    // On successful delete:
    if (response.hasSuccess) {
      // if portfolio has only one transaction
      if (hasOnlyOneTransaction()) {
        // and there is only one portfolio
        if (portfolios.length === 1) {
          // set current portfolio to new portfolio form
          selectPortfolio(NEW_PORTFOLIO);
        } else {
          // otherwise select the first portfolio
          selectPortfolio(portfolios[0]);
        }
        // refresh portfolio names
        refreshPortfolios();
      } else {
        // if portfolio had many transactions, refresh current portfolio
        refreshPortfolio();
      }
      closeDialog();
    }
  }, [hasOnlyOneTransaction, portfolios, refreshPortfolio, refreshPortfolios, response.hasSuccess]);

  const tx = transactions[selectedTransaction];

  return (
    <Grid container direction="column" justify="flex-start" alignItems="center">
      <Grid item>
        <Grid container direction="row" justify="center" alignItems="center">
          <Button variant="contained" color="secondary" onClick={() => deleteTx(tx)}>
            Yes
          </Button>
          <Button onClick={closeDialog}>Cancel</Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DeleteTransactionConfirmation;
