import React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import * as OwnTypes from '../../../prop-types';
import Debug from '../Debug';
import Tags from '../Tags';

function Position({ position }) {
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography>{position.id}</Typography>

        <Typography>{position.totalHoldings}</Typography>

        <Tags tags={position.tags} />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Debug any={position.transactions} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

Position.propTypes = {
  position: OwnTypes.position.isRequired,
};

export default Position;
