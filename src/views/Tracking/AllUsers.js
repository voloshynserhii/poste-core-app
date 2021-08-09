import React, { useState, useEffect, useCallback } from "react";
import { LinearProgress, Grid } from "@material-ui/core";

import api from "../../api";
import {useAppStore} from '../../store/AppStore';
import UsersTable from "./components/UsersTable";
import AddButton from "./components/AddButton";
import UserForm from "./components/UserForm";

const AllOperatorsView = () => {
  const [state, dispatch] = useAppStore();
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


  const handleAddUser = () => {
    setAddOrder(true);
  };

  const handleCloseForm = () => {
    setAddOrder(false);
  };

  if (loading) return <LinearProgress />;

  // if (addUser) return <UserForm onCancel={handleCloseForm} />;

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <UsersTable data={orders} />
          </Grid>
      </Grid>
      <AddButton collection="users" onClick={handleAddUser}>
        Add Order
      </AddButton>
    </>
  );
};
export default AllOperatorsView;
