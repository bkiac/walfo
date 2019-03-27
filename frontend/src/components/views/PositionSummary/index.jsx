import React from 'react';
import { Grid } from '@material-ui/core';
import PositionValue from '../PositionValue';
import * as OwnTypes from '../../../prop-types';
import PositionTrending from '../PositionTrending';
import PriceAndAmount from '../PriceAndAmount';

/**
 * @todo: Grid item positioning
 */
function PositionSummary({ position }) {
  const hasProfit = position.value > position.cost;
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className="margin-bottom-8"
    >
      <Grid item xs={1}>
        {position.symbol}
      </Grid>

      {/* Base value */}
      <Grid item xs>
        <PriceAndAmount
          price={position.cost / position.holdings}
          amount={position.holdings}
          isAverage
        />
      </Grid>
      <Grid item xs>
        <PositionValue value={position.cost} />
      </Grid>

      <Grid item xs={1}>
        <PositionTrending profitMargin={position.avgProfitMargin} />
      </Grid>

      {/* Current value */}
      <Grid item xs>
        <PositionValue value={position.holdings * position.currentPrice} hasProfit={hasProfit} />
      </Grid>
      <Grid item xs>
        <PriceAndAmount price={position.currentPrice} amount={position.holdings} />
      </Grid>
    </Grid>
  );
}

PositionSummary.propTypes = {
  position: OwnTypes.position.isRequired,
};

export default PositionSummary;
