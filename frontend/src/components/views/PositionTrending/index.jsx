import React from 'react';
import { TrendingDown as TrendingDownIcon, TrendingUp as TrendingUpIcon } from '@material-ui/icons';
import { Grid, Typography } from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { formatPercentage } from '../../../formats';
import style from './style.module.scss';

function PositionTrending({ profitMargin }) {
  const hasProfit = profitMargin > 0;
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      className={hasProfit ? style.profit : style.loss}
    >
      {hasProfit ? <TrendingUpIcon /> : <TrendingDownIcon />}
      <Typography variant="caption">{formatPercentage(profitMargin)}</Typography>
    </Grid>
  );
}

PositionTrending.propTypes = {
  profitMargin: PropTypes.number.isRequired,
};

export default PositionTrending;
