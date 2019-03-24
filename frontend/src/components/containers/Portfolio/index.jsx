import React, { useContext } from 'react';
import { Grid, Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Spinner, Positions } from '../../views';
import { DashboardContext, PortfolioContext } from '../../../contexts';
import style from './style.module.scss';

function Portfolio() {
  const { openDialog, editTransaction } = useContext(DashboardContext);
  const { getPositionsList, isLoading, getTransactionsForPosition } = useContext(PortfolioContext);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <Grid container direction="column" justify="flex-start" alignItems="center">
      <Grid item>TODO: Graph</Grid>

      <Fab variant="extended" onClick={openDialog} color="inherit" className={style.addButton}>
        <AddIcon />
        Transaction
      </Fab>

      <Positions
        positions={getPositionsList()}
        getTransactionsForPosition={getTransactionsForPosition}
        editTransaction={editTransaction}
      />
    </Grid>
  );
}

export default Portfolio;
