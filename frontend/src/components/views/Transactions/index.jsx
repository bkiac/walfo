import React from 'react';
import * as PropTypes from 'prop-types';
import { List, ListItem } from '@material-ui/core';
import * as OwnTypes from '../../../prop-types';
import Transaction from '../Transaction';
import style from './style.module.scss';

function Transactions({ transactions, editTransaction, removeTransaction }) {
  return (
    <List className={style.width}>
      {transactions.map(t => (
        <ListItem key={t.id} divider>
          <Transaction transaction={t} edit={editTransaction} remove={removeTransaction} />
        </ListItem>
      ))}
    </List>
  );
}

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(OwnTypes.transaction).isRequired,
  editTransaction: PropTypes.func.isRequired,
  removeTransaction: PropTypes.func.isRequired,
};

export default Transactions;
