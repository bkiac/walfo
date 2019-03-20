import React from 'react';
import * as PropTypes from 'prop-types';
import numeral from 'numeral';
import style from './style.module.scss';

function PositionValue({ value, hasProfit }) {
  const className = `${style.base} ${hasProfit ? style.profit : style.loss}`;
  const formattedValue = numeral(value).format('$0,0.00');
  return <div className={className}>{formattedValue}</div>;
}

PositionValue.propTypes = {
  value: PropTypes.number.isRequired,
  hasProfit: PropTypes.bool.isRequired,
};

export default PositionValue;
