import React, { useState, useEffect, useContext } from "react";
import { LinearProgress } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { AppContext } from '../../store'
import api from "../../api";
import OrdersTable from "./components/OrdersTable";
import AppButton from "../../components/AppButton";

const AllOrdersView = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(AppContext);

  useEffect(() => {
    if (state.orders.length) {
      setLoading(false)
    } else {
      async function fetchData() {
        const res = await api.orders.read(); // List of All orders
        if (res) {
          dispatch({ type: 'SET_ORDERS', orders: res });
          setLoading(false);
        } 
      }
      fetchData();
    };
  }, [dispatch, state.orders.length]);

  const handleAddOrder = () => {
    history.push('/tracking/form')
  };

  if (loading) return <LinearProgress />;

  return (
    <>
      <OrdersTable data={state.orders} />
      <AppButton color="success" onClick={handleAddOrder}>
        Add Order
      </AppButton>
    </>
  );
};
export default AllOrdersView;
