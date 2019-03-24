import React from 'react';
import { Fab, Grid } from '@material-ui/core';
import { Edit as EditIcon, Remove as RemoveIcon } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import * as OwnTypes from '../../../prop-types';
import style from './style.module.scss';
import { formatDate } from '../../../formats';
import PriceAndAmount from '../PriceAndAmount';

function Transaction({ transaction: tx, edit }) {
  const formattedDate = formatDate(tx.date);
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={tx.type === 'SELL' ? style.sell : ''}
    >
      <Grid item xs={1}>
        {tx.type}
      </Grid>

      <Grid item xs={5}>
        <PriceAndAmount price={tx.price} amount={tx.amount} />
      </Grid>

      <Grid item xs={4}>
        {formattedDate}
      </Grid>

      <Grid item xs={2}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Fab color="primary" size="small" aria-label="Edit" onClick={() => edit(tx.id)}>
            <EditIcon />
          </Fab>

          <Fab color="secondary" size="small" aria-label="Remove">
            <RemoveIcon />
          </Fab>
        </Grid>
      </Grid>
    </Grid>
  );
}

Transaction.propTypes = {
  transaction: OwnTypes.transaction.isRequired,
  edit: PropTypes.func.isRequired,
};

export default Transaction;
