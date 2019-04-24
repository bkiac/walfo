import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { LoginForm, RegisterForm } from './components/containers';
import { UserProvider } from './components/providers';
import { UserContext } from './contexts';
import { DashboardPage } from './components/pages';

function App() {
  return (
    <UserProvider>
      <UserContext.Consumer>
        {({ user }) => (
          <Switch>
            <Route path="/login">
              {() => (isEmpty(user) ? <LoginForm /> : <Redirect to="/dashboard" />)}
            </Route>

            <Route path="/register">
              {() => (isEmpty(user) ? <RegisterForm /> : <Redirect to="/dashboard" />)}
            </Route>

            <Route path="/dashboard">
              {() => (isEmpty(user) ? <Redirect to="/login" /> : <DashboardPage />)}
            </Route>

            <Route>
              {() => (isEmpty(user) ? <Redirect to="/login" /> : <Redirect to="/dashboard" />)}
            </Route>
          </Switch>
        )}
      </UserContext.Consumer>
    </UserProvider>
  );
}

export default App;
