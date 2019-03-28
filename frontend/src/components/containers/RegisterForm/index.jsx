import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Grid, Button } from '@material-ui/core';
import * as Yup from 'yup';
import { useRegister, useValidateResponse } from '../../../hooks';
import { FormikTextField } from '../../views';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .test('match', "Your passwords don't match.", function equals(confirmPassword) {
      return confirmPassword === this.parent.password;
    })
    .required(),
});

function RegisterForm() {
  const [res, register] = useRegister();
  const responseErrors = useValidateResponse(res);

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        register(values);
      }}
    >
      {({ handleSubmit, isValid }) => (
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
                {formik => (
                  <FormikTextField
                    formik={formik}
                    label="Confirm password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                  />
                )}
              </Field>
            </Grid>

            <Grid item>
              <Button type="submit" variant="contained" color="primary" disabled={!isValid}>
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
