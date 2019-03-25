import React from 'react';
import * as PropTypes from 'prop-types';
import * as OwnTypes from '../../../prop-types';
import Position from '../Position';

function Positions({ positions, getTransactionsForPosition, editTransaction, removeTransaction }) {
  return positions.map(p => (
    <Position
      key={p.symbol}
      position={p}
      transactions={getTransactionsForPosition(p.symbol)}
      editTransaction={editTransaction}
      removeTransaction={removeTransaction}
    />
  ));
}

Positions.propTypes = {
  positions: PropTypes.arrayOf(OwnTypes.position).isRequired,
  getTransactionsForPosition: PropTypes.func.isRequired,
  editTransaction: PropTypes.func.isRequired,
  removeTransaction: PropTypes.func.isRequired,
};

export default Positions;
