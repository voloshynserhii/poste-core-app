import { Route, Switch } from 'react-router-dom';
import AllCustomersView from './AllCustomers';
import SingleCustomerView from './SingleCustomer';

/**
 * Routes for "Customers" view
 * url: /customer/*
 */
const CustomersRoutes = () => {
  return (
    <Switch>
      <Route path="/customer/:id" component={SingleCustomerView} />
      <Route path="/customer" component={AllCustomersView} />
      <Route component={AllCustomersView} />
    </Switch>
  );
};

export default CustomersRoutes;