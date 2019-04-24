import React from 'react';
import { Form, Formik } from 'formik';
import { Grid, Button } from '@material-ui/core';
import * as Yup from 'yup';
import { useApiCallback, useValidateResponse } from '../../../hooks';
import { FormikTextField, Alert } from '../../views';
import { authApi } from '../../../api';

const validationSchema = Yup.object().shape({
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .test('match', "Your passwords don't match.", function equals(confirmPassword) {
      return confirmPassword === this.parent.password;
    })
    .required(),
});

function ChangePasswordForm() {
  const [res, changePassword] = useApiCallback(authApi.changePassword);
  const responseErrors = useValidateResponse(res);

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        changePassword(values);
      }}
    >
      {({ handleSubmit, isValid }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container direction="column" alignItems="center" spacing={8}>
            <Grid item>
              <FormikTextField
                name="password"
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                responseErrors={responseErrors}
              />
            </Grid>

            <Grid item>
              <FormikTextField
                name="confirmPassword"
                label="Confirm password"
                type="password"
                margin="normal"
                variant="outlined"
                responseErrors={responseErrors}
              />
            </Grid>

            <Grid item>
              <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
                Change password
              </Button>
            </Grid>

            {res.hasSuccess && (
              <Grid item>
                <Alert success>{res.data}</Alert>
              </Grid>
            )}
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default ChangePasswordForm;
