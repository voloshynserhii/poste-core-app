import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import { AppContext } from '../../store'
import api from "../../api";
import CustomersTable from "./components/CustomersTable";

const useStyles = makeStyles((theme) => ({
  fixedButton: {
    position: "fixed",
    bottom: "3%",
    left: "25%",
  },
}));

const AllCustomersView = () => {
  const classes = useStyles();
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
      <Fab
        className={classes.fixedButton}
        color="secondary"
        aria-label="add"
        onClick={handleAddCustomer}
      >
        <AddIcon />
      </Fab>
    </>
  );
};
export default AllCustomersView;
