import React from 'react';
import * as PropTypes from 'prop-types';
import * as OwnTypes from '../../../prop-types';
import Position from '../Position';

function Positions({ positions, getTransactionsForPosition }) {
  return positions.map(p => (
    <Position key={p.symbol} position={p} transactions={getTransactionsForPosition(p.symbol)} />
  ));
}

Positions.propTypes = {
  positions: PropTypes.arrayOf(OwnTypes.position).isRequired,
};

export default Positions;
