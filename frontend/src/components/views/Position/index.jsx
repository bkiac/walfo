import React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import * as PropTypes from 'prop-types';
import * as OwnTypes from '../../../prop-types';
import Tags from '../Tags';
import Transactions from '../Transactions';
import style from './style.module.scss';
import PositionSummary from '../PositionSummary';

function Position({ position, transactions, editTransaction, removeTransaction }) {
  return (
    <ExpansionPanel className={style.width}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={8}>
          <PositionSummary position={position} />

          <Tags tags={position.tags} />
        </Grid>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <Transactions
          transactions={transactions}
          editTransaction={editTransaction}
          removeTransaction={removeTransaction}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

Position.propTypes = {
  position: OwnTypes.position.isRequired,
  transactions: PropTypes.arrayOf(OwnTypes.transaction).isRequired,
  editTransaction: PropTypes.func.isRequired,
  removeTransaction: PropTypes.func.isRequired,
};

export default Position;
