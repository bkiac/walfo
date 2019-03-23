import React from 'react';
import { Fab, Grid } from '@material-ui/core';
import { Edit as EditIcon, Remove as RemoveIcon } from '@material-ui/icons';
import * as OwnTypes from '../../../prop-types';
import style from './style.module.scss';
import { formatDate } from '../../../formats';
import PriceAndAmount from '../PriceAndAmount';

function Transaction({ transaction: tx }) {
  const formattedDate = formatDate(tx.date);
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={tx.type === 'SELL' ? style.sell : ''}
    >
      <Grid item>{tx.type}</Grid>

      <Grid item>
        <PriceAndAmount price={tx.price} amount={tx.amount} />
      </Grid>

      <Grid item>{formattedDate}</Grid>

      <Fab color="primary" size="small" aria-label="Edit">
        <EditIcon />
      </Fab>

      <Fab color="secondary" size="small" aria-label="Remove">
        <RemoveIcon />
      </Fab>
    </Grid>
  );
}

Transaction.propTypes = {
  transaction: OwnTypes.transaction.isRequired,
};

export default Transaction;
