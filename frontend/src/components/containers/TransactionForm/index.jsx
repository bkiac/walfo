import React, { useEffect } from 'react';
import { TextField, Grid, Fab, MenuItem } from '@material-ui/core';
import { Add as AddIcon, Edit as EditIcon } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import dayjs from 'dayjs';
import * as PropTypes from 'prop-types';
import TagsField from '../TagsField';
import CoinField from '../CoinField';
import { useApiCallback } from '../../../hooks';
import * as OwnTypes from '../../../prop-types';

function TransactionForm({
  onSubmit,
  onSuccess,
  initialValues,
  shouldCreateNewPortfolio,
  portfolioName,
  positions,
}) {
  const [response, request] = useApiCallback(onSubmit);
  useEffect(() => {
    if (response.hasSuccess && onSuccess) {
      onSuccess(response.data);
    }
  }, [response.hasSuccess]);

  return (
    <Formik
      initialValues={
        initialValues
          ? {
              ...initialValues,
              date: dayjs(initialValues.date).format('YYYY-MM-DD'),
              portfolio: portfolioName,
            }
          : {
              symbol: '',
              amount: '',
              price: '',
              type: 'BUY',
              date: dayjs().format('YYYY-MM-DD'),
              portfolio: portfolioName,
              tags: [],
            }
      }
      onSubmit={inputTx => request(inputTx)}
    >
      {({ handleSubmit, setFieldValue, isValid, values }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container direction="column" justify="flex-start" alignItems="center">
            {shouldCreateNewPortfolio && (
              <Field name="portfolio">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Portfolio"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                  />
                )}
              </Field>
            )}

            <Grid item className="width-100p">
              <Field name="symbol">
                {({ field }) => (
                  <CoinField
                    {...field}
                    onChange={symbol => setFieldValue('symbol', symbol)}
                    disabled={initialValues !== undefined}
                  />
                )}
              </Field>
            </Grid>

            <Grid item className="width-100p">
              <Grid container direction="row" justify="space-between" alignItems="flex-start">
                <Field name="type">
                  {({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Type"
                      margin="normal"
                      variant="outlined"
                      disabled={initialValues !== undefined}
                    >
                      <MenuItem value="BUY">Buy</MenuItem>
                      {shouldCreateNewPortfolio ? null : <MenuItem value="SELL">Sell</MenuItem>}
                    </TextField>
                  )}
                </Field>

                <Field name="amount">
                  {({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      min="0"
                      label="Amount"
                      margin="normal"
                      variant="outlined"
                    />
                  )}
                </Field>

                <Field name="price">
                  {({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      min="0"
                      label="Price"
                      margin="normal"
                      variant="outlined"
                    />
                  )}
                </Field>
              </Grid>
            </Grid>

            <Field name="date">
              {({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Date"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                />
              )}
            </Field>

            <Grid item className="width-100p">
              <Field name="tags">
                {({ field }) => (
                  <TagsField
                    {...field}
                    initialTags={
                      positions && positions[values.symbol] ? positions[values.symbol].tags : []
                    }
                    onChange={tags => setFieldValue('tags', tags)}
                  />
                )}
              </Field>
            </Grid>
          </Grid>

          <Fab type="submit" variant="extended" color="primary" disabled={!isValid}>
            {initialValues ? <EditIcon /> : <AddIcon />}
            {initialValues ? 'Update transaction' : 'Create transaction'}
          </Fab>
        </Form>
      )}
    </Formik>
  );
}

TransactionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,

  portfolioName: PropTypes.string,

  // @todo: Conditional prop type: !shouldCreateNewPortfolio -> positions.isRequired
  shouldCreateNewPortfolio: PropTypes.bool,
  positions: PropTypes.objectOf(OwnTypes.position),

  initialValues: OwnTypes.transaction,
};

TransactionForm.defaultProps = {
  onSuccess: undefined,
  shouldCreateNewPortfolio: false,
  initialValues: undefined,
  portfolioName: '',
  positions: undefined,
};

export default TransactionForm;
