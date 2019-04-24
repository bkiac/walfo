import React, { useContext, useEffect } from 'react';
import { Grid, Fab, MenuItem } from '@material-ui/core';
import { Add as AddIcon, Edit as EditIcon } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import dayjs from 'dayjs';
import * as PropTypes from 'prop-types';
import * as Yup from 'yup';
import TagsField from '../TagsField';
import CoinField from '../CoinField';
import { useApiCallback, useValidateResponse } from '../../../hooks';
import * as OwnTypes from '../../../prop-types';
import { FormikTextField, FieldWithError } from '../../views';
import { CoinsContext } from '../../../contexts';

function TransactionForm({
  onSubmit,
  onSuccess,
  initialValues,
  shouldCreateNewPortfolio,
  portfolioName,
  getTagsForPosition,
  getHoldingsForPosition,
  getSoldHoldingsForPosition,
  portfolios,
}) {
  const { coins } = useContext(CoinsContext);

  const [response, request] = useApiCallback(onSubmit);
  const responseErrors = useValidateResponse(response);
  useEffect(() => {
    if (response.hasSuccess && onSuccess) {
      onSuccess(response.data);
    }
  }, [onSuccess, response.data, response.hasSuccess]);

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
      validationSchema={Yup.object().shape({
        portfolio: !shouldCreateNewPortfolio
          ? Yup.string()
              .oneOf([portfolioName])
              .required()
          : Yup.string()
              .notOneOf(portfolios)
              .required(),

        symbol: Yup.string()
          .test('is-valid-symbol', 'Please provide a valid coin!', function checkSymbol(symbol) {
            return coins[symbol] !== undefined;
          })
          .required(),

        type: Yup.string()
          .oneOf(['BUY', 'SELL'])
          .required(),

        amount: Yup.number()
          .when('type', (type, schema) => {
            if (!shouldCreateNewPortfolio && type === 'SELL') {
              return schema
                .min(0)
                .test('max', "You can't sell more than you have!", function max(amount) {
                  return amount <= getHoldingsForPosition(this.parent.symbol);
                });
            }

            if (initialValues && type === 'BUY') {
              return schema
                .max(Number.MAX_SAFE_INTEGER)
                .test(
                  'min',
                  'The value is too low! There are "Sell" transactions depending on this transaction!',
                  function min(amount) {
                    return amount >= getSoldHoldingsForPosition(this.parent.symbol);
                  },
                );
            }

            return schema.min(0).max(Number.MAX_SAFE_INTEGER);
          })
          .required(),

        price: Yup.number()
          .min(0)
          .required(),

        date: Yup.date()
          .max(dayjs().format('YYYY-MM-DD'))
          .required(),
      })}
      onSubmit={inputTx => request(inputTx)}
    >
      {({ handleSubmit, setFieldValue, isValid, values }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container direction="column" justify="flex-start" alignItems="center">
            {shouldCreateNewPortfolio && (
              <FormikTextField
                name="portfolio"
                responseErrors={responseErrors}
                label="Portfolio"
                margin="normal"
                variant="outlined"
                fullWidth
              />
            )}

            <Grid item className="width-100p">
              <FieldWithError name="symbol">
                {({ field, hasError, errorMessage }) => (
                  <CoinField
                    {...field}
                    error={hasError}
                    helperText={errorMessage}
                    disabled={initialValues !== undefined}
                  />
                )}
              </FieldWithError>
            </Grid>

            <Grid item className="width-100p">
              <Grid container direction="row" justify="space-between" alignItems="flex-start">
                <FormikTextField
                  name="type"
                  responseErrors={responseErrors}
                  select
                  label="Type"
                  margin="normal"
                  variant="outlined"
                  disabled={initialValues !== undefined}
                >
                  <MenuItem value="BUY">Buy</MenuItem>
                  {shouldCreateNewPortfolio ? null : <MenuItem value="SELL">Sell</MenuItem>}
                </FormikTextField>

                <FormikTextField
                  name="amount"
                  responseErrors={responseErrors}
                  type="number"
                  inputProps={{
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER,
                    step: 'any',
                  }}
                  label="Amount"
                  margin="normal"
                  variant="outlined"
                />

                <FormikTextField
                  name="price"
                  responseErrors={responseErrors}
                  type="number"
                  inputProps={{
                    min: 0,
                    step: 'any',
                  }}
                  label="Price"
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <FormikTextField
              name="date"
              responseErrors={responseErrors}
              inputProps={{
                max: dayjs().format('YYYY-MM-DD'),
              }}
              type="date"
              label="Date"
              margin="normal"
              variant="outlined"
              fullWidth
            />

            <Grid item className="width-100p">
              <Field name="tags">
                {({ field }) => (
                  <TagsField
                    {...field}
                    initialTags={!shouldCreateNewPortfolio ? getTagsForPosition(values.symbol) : []}
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
  portfolios: PropTypes.arrayOf(PropTypes.string).isRequired,

  onSuccess: PropTypes.func,

  initialValues: OwnTypes.transaction,

  // @todo: Conditional props type: !shouldCreateNewPortfolio -> {...}.isRequired
  shouldCreateNewPortfolio: PropTypes.bool,
  portfolioName: PropTypes.string,
  getTagsForPosition: PropTypes.func,
  getHoldingsForPosition: PropTypes.func,
  getSoldHoldingsForPosition: PropTypes.func,
};

TransactionForm.defaultProps = {
  onSuccess: undefined,

  initialValues: undefined,

  shouldCreateNewPortfolio: false,
  portfolioName: '',
  getTagsForPosition: undefined,
  getHoldingsForPosition: undefined,
  getSoldHoldingsForPosition: undefined,
};

export default TransactionForm;
