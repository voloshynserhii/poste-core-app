import { Route, Switch } from 'react-router-dom';
import AuthRoutes from '../views/Auth';
import SharedRoutes from './SharedRoutes';
import { PublicLayout } from './Layout';
// import SignupRoutes from '../views/Auth/Signup';
import LoginRoutes from '../views/Auth/Login';

/**
 * List of routes available only for anonymous users
 * Also renders the "Layout" composition for anonymous users
 */
const PublicRoutes = () => {
  return (
    <PublicLayout>
      <Switch>
        <Route exact path="/" component={LoginRoutes} />
        <Route path="/auth" component={AuthRoutes} />
        <SharedRoutes />
      </Switch>
    </PublicLayout>
  );
};

export default PublicRoutes;
