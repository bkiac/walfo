import React from 'react';
import { LoginForm } from '../../containers';
import { AuthNav } from '../../views';

function LoginPage() {
  return (
    <>
      <AuthNav />
      <LoginForm />
    </>
  );
}

export default LoginPage;
