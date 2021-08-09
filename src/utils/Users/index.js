import { Route, Switch } from 'react-router-dom';
import AllUsersView from './AllUsers';
import SingleUserView from './SingleUser';

/**
 * Routes for "Users" view
 * url: /user/*
 */
const UsersRoutes = () => {
  return (
    <Switch>
      <Route path="/tracking/:id" component={SingleUserView} />
      <Route path="/tracking" component={AllUsersView} />
      <Route component={AllUsersView} />
    </Switch>
  );
};

export default UsersRoutes;
