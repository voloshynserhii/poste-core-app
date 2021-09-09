import { Route, Switch } from 'react-router-dom';

import AllOrdersView from './AllOrders';
import SingleOrderView from './SingleOrder';
import OrderForm from "./components/OrderForm";

/**
 * Routes for "Orders" view
 * url: /tracking/*
 */
const TrackingRoutes = () => {
  return (
    <Switch>
      <Route path="/tracking/form" exact component={OrderForm} />
      <Route path="/tracking/:id" component={SingleOrderView} />
      <Route path="/tracking" component={AllOrdersView} />
      <Route component={AllOrdersView} />
    </Switch>
  );
};

export default TrackingRoutes;
