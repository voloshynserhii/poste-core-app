import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
// import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";

import { AppContext } from "../../store";
import api from "../../api";
import OrdersTable from "./components/OrdersTable";

// const useStyles = makeStyles((theme) => ({
//   fixedButton: {
//     position: "fixed",
//     bottom: "5%",
//     right: "5%",
//   },
// }));

const AllOrdersView = () => {
  // const classes = useStyles();
  // const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(AppContext);

  useEffect(() => {
    if (state.orders.length) {
      setLoading(false);
    } else {
      async function fetchData() {
        const res = await api.orders.read(); // List of All orders
        if (res) {
          dispatch({ type: "SET_ORDERS", orders: res });
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [dispatch, state.orders.length]);


  if (loading) return <LinearProgress />;

  return (
    <>
      <OrdersTable data={state.orders} />
    </>
  );
};
export default AllOrdersView;
