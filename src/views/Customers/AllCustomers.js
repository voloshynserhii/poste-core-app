import React, { useState, useEffect } from "react";
import { LinearProgress } from "@material-ui/core";

import AppButton from "../../components/AppButton";
import api from "../../api";
import RegisterCustomerForm from "./components/RegisterCustomerForm";
import CustomersTable from "./components/CustomersTable";

const AllCustomersView = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [addCustomer, setAddCustomer] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await api.customers.read(); // List of All users
      console.log(res);
      if (res) {
        setCustomers(res);
      }
      setLoading(false);
    }
    fetchData();
  }, []);
  
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
      <CustomersTable data={customers} />
      <AppButton color="success" onClick={handleAddCustomer}>
        Add Customer
      </AppButton>
    </div>
  );
};
export default AllCustomersView;
