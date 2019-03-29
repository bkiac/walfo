import React from 'react';
import * as PropTypes from 'prop-types';
import { Field } from 'formik';

function FieldWithError({ name, responseErrors, children, ...rest }) {
  return (
    <Field name={name}>
      {({ field, form }) => {
        const { touched, errors } = form;

        const hasError =
          touched[field.name] &&
          (errors[field.name] !== undefined || responseErrors[field.name] !== undefined);
        const errorMessage =
          touched[field.name] && (errors[field.name] || responseErrors[field.name]);

        return children({ field, form, hasError, errorMessage, ...rest });
      }}
    </Field>
  );
}

FieldWithError.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  responseErrors: PropTypes.objectOf(PropTypes.string),
};

FieldWithError.defaultProps = {
  responseErrors: {},
};

export default FieldWithError;
