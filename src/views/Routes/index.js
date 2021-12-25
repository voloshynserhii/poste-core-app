import { Route, Switch } from 'react-router-dom';
import AllRoutesView from './AllRoutes';
import SingleRouteView from './SingleRoute';
import RouteForm from './components/RegisterRouteForm';

/**
 * Routes for "Routes" view
 * url: /route/*
 */
const RouteRoutes = () => {
  return (
    <Switch>
      <Route path="/route/form" component={RouteForm} />
      <Route path="/route/:id" exact component={SingleRouteView} />
      <Route path="/route/:id/:type" exact component={SingleRouteView} />
      <Route path="/route" component={AllRoutesView} />
      <Route component={AllRoutesView} />
    </Switch>
  );
};

export default RouteRoutes;