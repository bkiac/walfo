import React from 'react';
import * as PropTypes from 'prop-types';
import style from './style.module.scss';
import { formatCurrency } from '../../../formats';

function PositionValue({ value, hasProfit }) {
  let className = style.base;

  if (hasProfit !== undefined) {
    className = `${className} ${hasProfit ? style.profit : style.loss}`;
  } else {
    className = `${className} ${style.default}`;
  }

  const formattedValue = formatCurrency(value);
  return <div className={className}>{formattedValue}</div>;
}

PositionValue.propTypes = {
  value: PropTypes.number.isRequired,
  hasProfit: PropTypes.bool,
};

PositionValue.defaultProps = {
  hasProfit: undefined,
};

export default PositionValue;
