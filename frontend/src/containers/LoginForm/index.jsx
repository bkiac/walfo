import React, { useContext } from 'react';
import TextField from '@material-ui/core/TextField';
import { Field, Form, Formik } from 'formik';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { login } from '../../services/authService';
import { UserContext } from '../../contexts';

function LoginForm() {
  const userContext = useContext(UserContext);

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={async values => {
        const { success } = await login(values);
        if (success) userContext.setUser(success);
        // TODO: if (failure) ...
      }}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit}>
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
