import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { formatAmount, formatCurrency } from '../../../formats';

function PriceAndAmount({ price, amount, isAverage }) {
  const formattedPrice = formatCurrency(price);
  const formattedAmount = formatAmount(amount);
  return (
    <Grid container direction="column" justify="flex-start" alignItems="center">
      <Typography variant="subtitle2">{`${isAverage ? '~' : ''}${formattedPrice}`}</Typography>
      <Typography variant="caption">x{formattedAmount}</Typography>
    </Grid>
  );
}

PriceAndAmount.propTypes = {
  price: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  isAverage: PropTypes.bool,
};

PriceAndAmount.defaultProps = {
  isAverage: false,
};

export default PriceAndAmount;
