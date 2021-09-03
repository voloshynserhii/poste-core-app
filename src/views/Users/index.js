import { Route, Switch } from 'react-router-dom';
import AllUsersView from './AllUsers';
import SingleUserView from './SingleUser';

/**
 * Routes for "Users" view
 * url: /users/*
 */
const UsersRoutes = () => {
  return (
    <Switch>
      <Route path="/user/:id" component={SingleUserView} />
      <Route path="/user" component={AllUsersView} />
      <Route component={AllUsersView} />
    </Switch>
  );
};

export default UsersRoutes;