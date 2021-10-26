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
import Menu from "../../../components/Menu";
import api from "../../../api";


const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function createData(
  id,
  trackingNumber,
  weight,
  quantity,
  collectionData,
  deliveryData
) {
  return {
    id,
    trackingNumber,
    weight,
    quantity,
    collectionData,
    deliveryData,
  };
}

function Row(props) {
  const { row, index } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  const menuOptions = ["Remove"];

  const handleGetOption = async (value, id) => {
    if (value === "Remove") {
      try {
        await api.orders.unassignRoute(id, props.routeId);
      } catch (err) {
        console.error(err.error);
      }
      
      console.log(id, props.routeId);
    }
  };

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
        <TableCell>
          <Menu
            options={menuOptions}
            onMenuClick={(opt) => handleGetOption(opt, row._id)}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          {row.trackingNumber}
        </TableCell>
        <TableCell align="right">{row.weight}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell align="right">Address1</TableCell>
                    <TableCell align="right">Address2</TableCell>
                    <TableCell align="right">Phone</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">Contact Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>FROM</TableCell>
                    <TableCell>{row.collectionData.region}</TableCell>
                    <TableCell>{row.collectionData.city}</TableCell>
                    <TableCell align="right">
                      {row.collectionData.address1}
                    </TableCell>
                    <TableCell align="right">
                      {row.collectionData.address2}
                    </TableCell>
                    <TableCell align="right">
                      {row.collectionData.contactPhone}
                    </TableCell>
                    <TableCell align="right">
                      {row.collectionData.constactEmail}
                    </TableCell>
                    <TableCell align="right">
                      {row.collectionData.contactName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TO</TableCell>
                    <TableCell>{row.deliveryData.region}</TableCell>
                    <TableCell>{row.deliveryData.city}</TableCell>
                    <TableCell align="right">
                      {row.deliveryData.address1}
                    </TableCell>
                    <TableCell align="right">
                      {row.deliveryData.address2}
                    </TableCell>
                    <TableCell align="right">
                      {row.deliveryData.contactPhone}
                    </TableCell>
                    <TableCell align="right">
                      {row.deliveryData.constactEmail}
                    </TableCell>
                    <TableCell align="right">
                      {row.deliveryData.contactName}
                    </TableCell>
                  </TableRow>
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
  const [assignedOrders, setAssignedOrders] = useState([]);
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
  }, [ordersList, state.orders]);

  useEffect(() => {
    const rows = assignedOrders.map((order) => {
      return createData(
        order._id,
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
            <TableCell />
            <TableCell>Tracking #</TableCell>
            <TableCell align="right">Weight</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Collection address</TableCell>
            <TableCell align="right">Delivery address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignedOrders.map((order, i) => (
            <Row key={order._id} index={i} row={order} routeId={props.routeId} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
