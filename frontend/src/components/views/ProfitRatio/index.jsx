import React from 'react';
import * as PropTypes from 'prop-types';
import numeral from 'numeral';
import style from './style.module.scss';

function ProfitRatio({ profitRatio }) {
  const formattedRatio = numeral(profitRatio).format('0%');
  const className = `${style.base} ${profitRatio > 0 ? style.profit : style.loss}`;
  return <div className={className}>{formattedRatio}</div>;
}

ProfitRatio.propTypes = {
  profitRatio: PropTypes.number.isRequired,
};

export default ProfitRatio;
