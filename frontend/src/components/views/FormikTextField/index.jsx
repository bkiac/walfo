import React from 'react';
import * as PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import FieldWithError from '../FieldWithError';

function FormikTextField({ name, responseErrors, ...rest }) {
  return (
    <FieldWithError name={name} responseErrors={responseErrors}>
      {({ field, hasError, errorMessage }) => (
        <TextField {...field} error={hasError} helperText={errorMessage} {...rest} />
      )}
    </FieldWithError>
  );
}

FormikTextField.propTypes = {
  name: PropTypes.string.isRequired,
  responseErrors: PropTypes.objectOf(PropTypes.string),
};

FormikTextField.defaultProps = {
  responseErrors: {},
};

export default FormikTextField;
