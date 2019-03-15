import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { LoginForm, RegisterForm } from './containers';

function App() {
  return (
    <Switch>
      <Route path="/login" component={LoginForm} />
      <Route path="/register" component={RegisterForm} />

      <Route path="/app" component={() => <div>app</div>} />

      <Route component={LoginForm} />
    </Switch>
  );
}

export default App;
