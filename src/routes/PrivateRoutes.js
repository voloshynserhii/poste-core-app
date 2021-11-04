import React, {useState, useEffect, useContext} from 'react';
import { LinearProgress } from "@material-ui/core";
import { Route, Switch } from 'react-router-dom';

import { AppContext } from '../store';
import api from "../api";
import SharedRoutes from './SharedRoutes';
import { PrivateLayout } from './Layout';
// import UserRoutes from '../views/User';
import Tracking from '../views/Tracking';
import Customers from '../views/Customers';
import Routes from '../views/Routes';
import Data from '../views/DataManaging';
import Users from '../views/Users';
import { Welcome, MyProfile } from '../views';

/**
 * List of routes available only for authenticated users
 * Also renders the "Layout" composition for logged users
 */
const PrivateRoutes = () => {
  const [, dispatch] = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      const orders = await api.orders.read(); // List of All orders
      const customers = await api.customers.read(); // List of All customers
      const users = await api.users.read(); // List of All users
      //const routes = await api.routes.read(); // List of All routes
      if (orders) {
        dispatch({ type: 'SET_ORDERS', orders: orders });
      }
      if (customers) {
        dispatch({ type: 'SET_CUSTOMERS', customers: customers });
      }
      if (users) {
        dispatch({ type: 'SET_USERS', users: users });
      }
      // if (routes) {
      //   dispatch({ type: 'SET_ROUTES', routes: routes });
      // } 
      setLoading(false);
    }
    fetchData();
  }, [dispatch]);
  
  if (loading) return <LinearProgress />;
  
  return (
    <PrivateLayout>
      <Switch>
        <Route path="/" exact component={Welcome} />
        {/* <Route path="/user" component={UserRoutes} /> */}
        <Route path="/tracking" component={Tracking} />
        <Route path="/customer" component={Customers} />
        <Route path="/user" component={Users} />
        <Route path="/route" component={Routes} />
        <Route path="/data" component={Data} />
        <Route path="/me" component={MyProfile} />,
        <SharedRoutes />
      </Switch>
    </PrivateLayout>
  );
};

export default PrivateRoutes;
