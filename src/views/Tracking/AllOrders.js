import React, { useState, useEffect, useCallback } from "react";
import { LinearProgress, Grid } from "@material-ui/core";

import api from "../../api";
import OrdersTable from "./components/OrdersTable";
import AddButton from "./components/AddButton";
import OrderForm from "./components/OrderForm";

const AllOrdersView = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [addOrder, setAddOrder] = useState(false);


  useEffect(() => {
    async function fetchData() {
      const res = await api.orders.read(); // List of All orders
      if (res) {
        setOrders(res);
      }
      setLoading(false);
    }
    fetchData();
  }, []);


  const handleAddOrder = () => {
    setAddOrder(true);
  };

  const handleCloseForm = () => {
    setAddOrder(false);
  };

  if (loading) return <LinearProgress />;

  if (addOrder) return <OrderForm onCancel={handleCloseForm} />;

  return (
    <>
      <OrdersTable data={orders} />
      <AddButton collection="orders" onClick={handleAddOrder}>
        Add Order
      </AddButton>
    </>
  );
};
export default AllOrdersView;
