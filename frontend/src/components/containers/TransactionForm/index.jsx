import React from 'react';
import { TextField, Grid, Fab, MenuItem } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import dayjs from 'dayjs';
import * as PropTypes from 'prop-types';
import TagsField from '../TagsField';
import CoinField from '../CoinField';
import { useApiCallback } from '../../../hooks';
import { transactionApi } from '../../../api';

function TransactionForm({ portfolio }) {
  const [, createTx] = useApiCallback(transactionApi.createTransaction);

  return (
    <Formik
      initialValues={{
        symbol: '',
        amount: '',
        price: '',
        type: 'BUY',
        date: dayjs().format('YYYY-MM-DD'),
        portfolio,
        tags: ['todo', 'query', 'position', 'tags'],
      }}
      onSubmit={tx => createTx(tx)}
    >
      {({ handleSubmit, initialValues, setFieldValue, isValid }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container direction="column" justify="flex-start" alignItems="center">
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
                    initialTags={initialValues.tags}
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
  portfolio: PropTypes.string.isRequired,
};

export default TransactionForm;
