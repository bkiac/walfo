import React from 'react';
import { TextField } from '@material-ui/core';
import * as PropTypes from 'prop-types';

function FormikTextField({ formik, responseErrors, ...rest }) {
  const {
    field,
    form: { touched, errors },
  } = formik;
  const hasError =
    touched[field.name] &&
    (errors[field.name] !== undefined || responseErrors[field.name] !== undefined);
  const errorMessage = touched[field.name] && (errors[field.name] || responseErrors[field.name]);

  return <TextField {...field} error={hasError} helperText={errorMessage} {...rest} />;
}

FormikTextField.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  formik: PropTypes.object.isRequired,
  responseErrors: PropTypes.objectOf(PropTypes.string),
};

FormikTextField.defaultProps = {
  responseErrors: {},
};

export default FormikTextField;
