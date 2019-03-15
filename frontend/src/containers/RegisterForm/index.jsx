import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Field, Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { register } from '../../api';

function RegisterForm() {
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmPassword: '',
      }}
      onSubmit={async values => {
        const res = await register(values);
        console.log(res);
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit}>
          <pre>{JSON.stringify(formik.values, null, 2)}</pre>

          <Grid container direction="column" alignItems="center">
            <Grid item>
              <Field name="email">
                {({ field }) => (
                  <TextField
                    {...field}
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
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                  />
                )}
              </Field>
            </Grid>

            <Grid item>
              <Field name="confirmPassword">
                {({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                  />
                )}
              </Field>
            </Grid>

            <Grid item>
              <Button type="submit" variant="contained" color="primary">
                Register
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default RegisterForm;
