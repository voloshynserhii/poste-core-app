import { Route, Switch } from 'react-router-dom';
import AllUsersView from './AllUsers';
// import SingleCustomerView from './SingleCustomer';

/**
 * Routes for "Users" view
 * url: /users/*
 */
const CustomersRoutes = () => {
  return (
    <Switch>
      {/* <Route path="/user/:id" component={SingleCustomerView} /> */}
      <Route path="/users" component={AllUsersView} />
      <Route component={AllUsersView} />
    </Switch>
  );
};

export default CustomersRoutes;