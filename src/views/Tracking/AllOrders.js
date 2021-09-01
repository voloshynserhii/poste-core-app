import React, { useState, useEffect, useContext } from "react";
import { LinearProgress } from "@material-ui/core";

import { AppContext } from '../../store'
import api from "../../api";
import OrdersTable from "./components/OrdersTable";
import OrderForm from "./components/OrderForm";
import AppButton from "../../components/AppButton";

const AllOrdersView = () => {
  const [loading, setLoading] = useState(true);
  const [addOrder, setAddOrder] = useState(false);
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
    setAddOrder(true);
  };

  const handleCloseForm = () => {
    setAddOrder(false);
  };

  if (loading) return <LinearProgress />;

  return (
    <>
      {addOrder && <OrderForm onCancel={handleCloseForm} />}
      <OrdersTable data={state.orders} />
      <AppButton color="success" onClick={handleAddOrder}>
        Add Order
      </AppButton>
    </>
  );
};
export default AllOrdersView;
