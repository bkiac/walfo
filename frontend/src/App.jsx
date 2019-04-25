import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { coinsApi } from './api';
import { LoginForm, RegisterForm } from './components/containers';
import { CoinsProvider, UserProvider } from './components/providers';
import { Spinner } from './components/views';
import { UserContext } from './contexts';
import { DashboardPage, TopListsPage, CoinPage } from './components/pages';
import { useApiOnMount, useIsLoading } from './hooks';

function App() {
  const [coinList] = useApiOnMount(coinsApi.getCoinList);
  const isLoading = useIsLoading([coinList]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <CoinsProvider initialCoins={coinList.data}>
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

              <Route path="/browse/:symbol" component={CoinPage} />
              <Route path="/browse" component={TopListsPage} />

              <Route>
                {() => (isEmpty(user) ? <Redirect to="/login" /> : <Redirect to="/dashboard" />)}
              </Route>
            </Switch>
          )}
        </UserContext.Consumer>
      </UserProvider>
    </CoinsProvider>
  );
}

export default App;
