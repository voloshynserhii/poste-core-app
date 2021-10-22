import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import { AppContext } from "../../../store";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function createData(trackingNumber, calories, fat, carbs, protein, price) {
  return {
    trackingNumber,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      { date: "2020-01-05", customerId: "11091700", amount: 3 },
      { date: "2020-01-02", customerId: "Anonymous", amount: 1 },
    ],
  };
}

function Row(props) {
  const { row, index } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {index + 1}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.trackingNumber}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function OrderList(props) {
  const [state, dispatch] = useContext(AppContext);
  const [ordersList, setOrdersList] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([])
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const routeData = state.routes.find((route) => route._id === props.routeId);
    const ordersList = routeData.orders;
    setOrdersList(ordersList);
  }, [props.routeId, state.routes]);

  useEffect(() => {
    const orders = ordersList.map((order) => {
      return state.orders.find((item) => item._id === order);
    });
    setAssignedOrders(orders);
    console.log(orders);
  }, [ordersList, state.orders]);

  useEffect(() => {
    const rows = assignedOrders.map((order) => {
      return createData(
        order.trackingNumber,
        order.weight || 0,
        order.quantity || 0,
        order.collectionData?.address1 || "no address",
        order.deliveryData?.address1 || "no address"
      );
    });
    setRows(rows.reverse());
  }, [assignedOrders]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Order List">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>#</TableCell>
            <TableCell>Tracking #</TableCell>
            <TableCell align="right">Weight</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Collection address</TableCell>
            <TableCell align="right">Delivery address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <Row key={row.name} index={i} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
