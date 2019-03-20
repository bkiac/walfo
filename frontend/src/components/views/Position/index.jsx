import React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import * as OwnTypes from '../../../prop-types';
import Debug from '../Debug';
import Tags from '../Tags';
import PositionValue from '../PositionValue';
import ProfitRatio from '../ProfitRatio';

function Position({ position, currentPrice }) {
  const hasProfit = currentPrice > position.avgCost;
  const profitRatio = -(1 - currentPrice / position.avgCost);
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={8}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            className="margin-bottom-8"
          >
            <div>
              {position.id} x{position.totalHoldings}
            </div>

            <PositionValue value={position.totalHoldings * currentPrice} hasProfit={hasProfit} />

            <ProfitRatio profitRatio={profitRatio} />
          </Grid>

          <Tags tags={position.tags} />
        </Grid>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <Debug any={position.transactions} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

Position.propTypes = {
  position: OwnTypes.position.isRequired,
  currentPrice: PropTypes.number.isRequired,
};

export default Position;
