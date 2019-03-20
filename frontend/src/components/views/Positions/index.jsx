import React from 'react';
import * as PropTypes from 'prop-types';
import * as OwnTypes from '../../../prop-types';
import Position from '../Position';

function Positions({ positions, currentPrices }) {
  return positions.map(p => (
    <Position key={p.id} position={p} currentPrice={currentPrices[p.id].USD} />
  ));
}

Positions.propTypes = {
  positions: PropTypes.arrayOf(OwnTypes.position).isRequired,
};

export default Positions;
