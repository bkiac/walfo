import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Grid, Button } from '@material-ui/core';
import { useLogin, useValidateResponse } from '../../../hooks';
import FormikTextField from '../../views/FormikTextField';

function LoginForm() {
  const [response, login] = useLogin();
  const responseErrors = useValidateResponse(response);

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={values => {
        login(values);
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <Field name="email">
                {formik => (
                  <FormikTextField
                    formik={formik}
                    responseErrors={responseErrors}
                    label="Email"
                    type="text"
                    margin="normal"
                    variant="outlined"
                  />
                )}
              </Field>
            </Grid>

            <Grid item>
              <Field name="password">
                {formik => (
                  <FormikTextField
                    formik={formik}
                    responseErrors={responseErrors}
                    label="Password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                  />
                )}
              </Field>
            </Grid>

            <Grid item>
              <Grid container>
                <Grid item xs={6}>
                  <Button type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button href="/register">Register</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default LoginForm;
