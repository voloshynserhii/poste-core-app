import React, { useState, useEffect, useContext } from "react";
import { LinearProgress } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { AppContext } from '../../store'
import AppButton from "../../components/AppButton";
import api from "../../api";
import CustomersTable from "./components/CustomersTable";

const AllCustomersView = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(AppContext);
  
  useEffect(() => {
    if (state.customers.length) {
      setLoading(false)
    } else {
      async function fetchData() {
        const res = await api.customers.read(); // List of All customers
        if (res) {
          dispatch({ type: 'SET_CUSTOMERS', customers: res });
          setLoading(false);
        } 
      }
      fetchData();
    };
  }, [dispatch, state.customers.length]);
  
  const handleAddCustomer = () => {
    history.push('/customer/form')
  };

  if (loading) return <LinearProgress />;

  return (
    <>
      <CustomersTable data={state.customers} />
      <AppButton color="success" onClick={handleAddCustomer}>
        Add Customer
      </AppButton>
    </>
  );
};
export default AllCustomersView;
