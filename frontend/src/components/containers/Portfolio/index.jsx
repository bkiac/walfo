import React, { useContext } from 'react';
import { Grid } from '@material-ui/core';
import { Positions } from '../../views';
import { PortfolioContext } from '../../../contexts';
import PortfolioGraph from '../PortfolioGraph';
import PortfolioSummary from '../PortfolioSummary';

function Portfolio() {
  const {
    getPositionsList,
    getTransactionsForPosition,
    editTransaction,
    removeTransaction,
  } = useContext(PortfolioContext);

  return (
    <Grid container direction="column" justify="flex-start" alignItems="center">
      <Grid item className="width-100p">
        <Grid container direction="row" justify="space-between" alignItems="flex-start" spacing={8}>
          <Grid item xs={6}>
            <PortfolioSummary />
          </Grid>
          <Grid item xs={6}>
            <PortfolioGraph />
          </Grid>
        </Grid>
      </Grid>

      <Positions
        positions={getPositionsList()}
        getTransactionsForPosition={getTransactionsForPosition}
        editTransaction={editTransaction}
        removeTransaction={removeTransaction}
      />
    </Grid>
  );
}

export default Portfolio;
