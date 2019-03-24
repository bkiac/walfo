import React, { useContext, useEffect } from 'react';
import { TextField, Grid, Fab, MenuItem } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import dayjs from 'dayjs';
import * as PropTypes from 'prop-types';
import TagsField from '../TagsField';
import CoinField from '../CoinField';
import { PortfolioContext } from '../../../contexts';

function TransactionForm({ onSuccess, transactionId, isInitial }) {
  const {
    isLoading,
    portfolioName,
    positions,
    transactions,
    transactionApi: { create, update },
  } = useContext(PortfolioContext);

  const [createResponse, createRequest] = create;
  const [updateResponse, updateRequest] = update;

  useEffect(() => {
    if ((createResponse.hasSuccess || updateResponse.hasSuccess) && onSuccess) {
      onSuccess();
    }
  }, [createResponse.hasSuccess, updateResponse.hasSuccess]);

  // Don't render the form if portfolio context is still loading
  if (isLoading) {
    return null;
  }

  const tx = transactions[transactionId];
  const initialValues = tx
    ? { ...tx, date: dayjs(tx.date).format('YYYY-MM-DD'), portfolio: portfolioName }
    : {
        symbol: '',
        amount: '',
        price: '',
        type: 'BUY',
        date: dayjs().format('YYYY-MM-DD'),
        portfolio: portfolioName,
        tags: [],
      };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={inputTx => (tx ? updateRequest(inputTx) : createRequest(inputTx))}
    >
      {({ handleSubmit, values, setFieldValue, isValid }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container direction="column" justify="flex-start" alignItems="center">
            {isInitial && (
              <Field name="portfolioName">
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
                  <CoinField {...field} onChange={symbol => setFieldValue('symbol', symbol)} />
                )}
              </Field>
            </Grid>

            <Grid item className="width-100p">
              <Grid container direction="row" justify="space-between" alignItems="flex-start">
                <Field name="type">
                  {({ field }) => (
                    <TextField {...field} select label="Type" margin="normal" variant="outlined">
                      <MenuItem value="BUY">Buy</MenuItem>
                      <MenuItem value="SELL">Sell</MenuItem>
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
                    onChange={tags => setFieldValue('tags', tags)}
                    initialTags={positions[values.symbol] ? positions[values.symbol].tags : []}
                  />
                )}
              </Field>
            </Grid>
          </Grid>

          <Fab type="submit" variant="extended" color="primary" disabled={!isValid}>
            <AddIcon />
            Create new transaction
          </Fab>
        </Form>
      )}
    </Formik>
  );
}

TransactionForm.propTypes = {
  onSuccess: PropTypes.func,
  transactionId: PropTypes.string,
  isInitial: PropTypes.bool,
};

TransactionForm.defaultProps = {
  onSuccess: undefined,
  transactionId: undefined,
  isInitial: false,
};

export default TransactionForm;
