import { Route, Switch } from 'react-router-dom';
import AllRoutesView from './AllRoutes';
import SingleRouteView from './SingleRoute';
// import CustomerForm from './components/RegisterCustomerForm';

/**
 * Routes for "Routes" view
 * url: /route/*
 */
const RouteRoutes = () => {
  return (
    <Switch>
      {/* <Route path="/customer/form" component={CustomerForm} /> */}
      <Route path="/route/:id" component={SingleRouteView} />
      <Route path="/route" component={AllRoutesView} />
      <Route component={AllRoutesView} />
    </Switch>
  );
};

export default RouteRoutes;