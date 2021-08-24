import { Route, Switch } from 'react-router-dom';
import SharedRoutes from './SharedRoutes';
import { PrivateLayout } from './Layout';
import UserRoutes from '../views/User';
import Tracking from '../views/Tracking';
import Customers from '../views/Customers';
import { Welcome, MyProfile } from '../views';

/**
 * List of routes available only for authenticated users
 * Also renders the "Layout" composition for logged users
 */
const PrivateRoutes = () => {
  return (
    <PrivateLayout>
      <Switch>
        <Route path="/" exact component={Welcome} />
        <Route path="/user" component={UserRoutes} />
        <Route path="/tracking" component={Tracking} />
        <Route path="/customer" component={Customers} />
        <Route path="/me" component={MyProfile} />,
        <SharedRoutes />
      </Switch>
    </PrivateLayout>
  );
};

export default PrivateRoutes;
