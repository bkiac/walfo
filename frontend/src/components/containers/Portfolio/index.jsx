import React, { useContext } from 'react';
import { Grid, Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Positions } from '../../views';
import { DashboardContext, PortfolioContext } from '../../../contexts';
import style from './style.module.scss';

function Portfolio() {
  const { openFormDialog } = useContext(DashboardContext);
  const {
    getPositionsList,
    getTransactionsForPosition,
    editTransaction,
    removeTransaction,
  } = useContext(PortfolioContext);

  return (
    <Grid container direction="column" justify="flex-start" alignItems="center">
      <Grid item>TODO: Graph</Grid>

      <Fab variant="extended" onClick={openFormDialog} color="inherit" className={style.addButton}>
        <AddIcon />
        Transaction
      </Fab>

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
