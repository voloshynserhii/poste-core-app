import React, { useState, useEffect, useContext } from "react";
import { LinearProgress } from "@material-ui/core";

import { AppContext } from '../../store'
import AppButton from "../../components/AppButton";
import api from "../../api";
import RegisterCustomerForm from "./components/RegisterCustomerForm";
import CustomersTable from "./components/CustomersTable";

const AllCustomersView = () => {
  const [loading, setLoading] = useState(true);
  const [addCustomer, setAddCustomer] = useState(false);
  const [state, dispatch] = useContext(AppContext);

  useEffect(() => {
    async function fetchData() {
      const res = await api.customers.read(); // List of All users
      if (res) {
        dispatch({ type: 'SET_CUSTOMERS', customers: res });
      }
      setLoading(false);
    }
    fetchData();
  }, [dispatch]);
  
  const handleAddCustomer = () => {
    setAddCustomer(true);
  };
  const handleCloseForm = () => {
    setAddCustomer(false);
  };

  if (loading) return <LinearProgress />;

  return (
    <div>
      {addCustomer && <RegisterCustomerForm onCancel={handleCloseForm} />}
      <CustomersTable data={state.customers} />
      <AppButton color="success" onClick={handleAddCustomer}>
        Add Customer
      </AppButton>
    </div>
  );
};
export default AllCustomersView;
