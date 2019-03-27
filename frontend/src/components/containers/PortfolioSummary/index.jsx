import React, { useContext } from 'react';
import { Fab, Paper, Grid, Typography, TextField } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import dayjs from 'dayjs';
import { PortfolioContext } from '../../../contexts';
import style from './style.module.scss';
import { PositionValue } from '../../views';

function PortfolioSummary() {
  const {
    portfolio,
    addTransaction,
    queryDate,
    setQueryDate,
    getDateOfFirstTransaction,
  } = useContext(PortfolioContext);

  return (
    <Paper elevation={1} className={style.paper}>
      <Grid container direction="column" justify="flex-start" alignItems="center" spacing={16}>
        <Grid item className="width-100p">
          <Grid container direction="row" justify="space-between" alignItems="flex-start">
            <Typography variant="h6">Total cost:</Typography>
            <PositionValue value={portfolio.cost} />
          </Grid>
        </Grid>

        <Grid item className="width-100p">
          <Grid container direction="row" justify="space-between" alignItems="flex-start">
            <Typography variant="h6">Current value:</Typography>
            <PositionValue value={portfolio.value} hasProfit={portfolio.value > portfolio.cost} />
          </Grid>
        </Grid>

        <Grid item className="width-100p">
          <Grid container direction="row" justify="space-between" alignItems="flex-start">
            <Typography variant="h6">From:</Typography>
            <TextField
              id="portfolio-date-input"
              type="date"
              inputProps={{
                min: getDateOfFirstTransaction(),
                max: dayjs().format('YYYY-MM-DD'),
              }}
              value={queryDate}
              onChange={e => setQueryDate(e.target.value)}
              margin="none"
            />
          </Grid>
        </Grid>

        <Grid item>
          <Fab
            variant="extended"
            onClick={addTransaction}
            color="inherit"
            className={style.addButton}
          >
            <AddIcon />
            Transaction
          </Fab>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default PortfolioSummary;
