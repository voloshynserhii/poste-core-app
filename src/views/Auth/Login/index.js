import { Route, Switch } from 'react-router-dom';
// import LoginView from './Login';
import LoginEmailView from './Email';

/**
 * Routes for "Login" flow
 * url: /auth/login/*
 */
const LoginRoutes = () => {
  return (
    <Switch>
      <Route path="/auth/login/email" component={LoginEmailView} />
      <Route component={LoginEmailView} />
      {/* <Route component={LoginView} /> */}
    </Switch>
  );
};

export default LoginRoutes;
