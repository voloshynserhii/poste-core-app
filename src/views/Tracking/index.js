import { Route, Switch } from 'react-router-dom';
import AllOrdersView from './AllOrders';
import SingleOrderView from './SingleOrder';

/**
 * Routes for "Users" view
 * url: /tracking/*
 */
const TrackingRoutes = () => {
  return (
    <Switch>
      <Route path="/tracking/:id" component={SingleOrderView} />
      <Route path="/tracking" component={AllOrdersView} />
      <Route component={AllOrdersView} />
    </Switch>
  );
};

export default TrackingRoutes;
