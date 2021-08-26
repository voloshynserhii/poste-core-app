import React, { useState, useEffect } from "react";
import { LinearProgress } from "@material-ui/core";

import AppButton from "../../components/AppButton";
import api from "../../api";

const AllOrdersView = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [addCustomer, setAddCustomer] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await api.users.read(); // List of All users
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
  
  if (loading) return <LinearProgress />;

  return (
    <div>
      {customers?.map((customer, index) => (
        <div>
          <span> {index + 1}. </span>
          <span>{customer.name}</span>
        </div>
      ))}
      <AppButton color="success" onClick={handleAddCustomer}>
        Add Customer
      </AppButton>
    </div>
  );
};
export default AllOrdersView;
