import React from 'react';
import numeral from 'numeral';
import dayjs from 'dayjs';
import { Fab, Grid, Typography } from '@material-ui/core';
import { Edit as EditIcon, Remove as RemoveIcon } from '@material-ui/icons';
import * as OwnTypes from '../../../prop-types';
import style from './style.module.scss';

function Transaction({ transaction: tx }) {
  const formattedPrice = numeral(tx.price).format('$0,0.00');
  const formattedDate = dayjs(tx.date).format('YYYY-MM-DD');
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
        <Grid container direction="column" justify="flex-start" alignItems="flex-start">
          <Typography variant="subtitle2">x{tx.amount}</Typography>
          <Typography variant="caption">{formattedPrice}</Typography>
        </Grid>
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
