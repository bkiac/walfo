import React, { useContext } from 'react';
import { Grid, Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Positions } from '../../views';
import { DashboardContext, PortfolioContext } from '../../../contexts';
import style from './style.module.scss';
import PortfolioGraph from '../PortfolioGraph';

function Portfolio() {
  const { openFormDialog } = useContext(DashboardContext);
  const {
    portfolioName,
    getPositionsList,
    getTransactionsForPosition,
    editTransaction,
    removeTransaction,
  } = useContext(PortfolioContext);

  return (
    <Grid container direction="column" justify="flex-start" alignItems="center">
      <PortfolioGraph portfolioName={portfolioName} />

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
