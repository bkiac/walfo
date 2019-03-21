import React from 'react';
import * as PropTypes from 'prop-types';
import { List, ListItem } from '@material-ui/core';
import * as OwnTypes from '../../../prop-types';
import Transaction from '../Transaction';
import style from './style.module.scss';

function Transactions({ transactions }) {
  return (
    <List className={style.width}>
      {transactions.map(t => (
        <ListItem key={t._id} divider>
          <Transaction transaction={t} />
        </ListItem>
      ))}
    </List>
  );
}

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(OwnTypes.transaction).isRequired,
};

export default Transactions;
