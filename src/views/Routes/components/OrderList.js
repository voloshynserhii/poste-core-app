import { useState, useEffect, useCallback, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Collapse,
  Checkbox,
  Grid,
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
import Alert from "@material-ui/lab/Alert";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import CloseIcon from "@material-ui/icons/Close";

import AppButton from "../../../components/AppButton";
import { AppContext } from "../../../store";
import Menu from "../../../components/Menu";
import api from "../../../api";
import ChangeMultipleForm from "../../Tracking/components/ChangeMultipleForm";
import RoutesTable from "./RoutesTable";
import RegisterRouteForm from "./RegisterRouteForm";

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
  const [menuValue, setMenuValue] = useState("");

  const menuOptions = ["Remove", "Change Route"];

  const handleGetOption = async (value, id) => {
    setMenuValue(value);
    if (value === "Remove") {
      try {
        const res = await api.orders.unassignRoute(id, props.routeId);
        if (res.status === 200) props.onConfirmModalOpen(id);
      } catch (err) {
        console.error(err.error);
      }
    }
    if (value === "Change Route") {
      props.reassignRoute(id);
    }
  };

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell style={{ display: "flex", justifyContent: "center" }}>
          <Checkbox
            color="primary"
            style={{ marginRight: 20 }}
            checked={props.selected.includes(row.id)}
            onClick={() => props.onSelectId(row.id)}
          />
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
            selected={!!menuValue}
            onMenuClick={(opt) => handleGetOption(opt, row.id)}
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
  const [currentRoute, setCurrentRoute] = useState();
  const [ordersList, setOrdersList] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [rows, setRows] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [changeMultiply, setChangeMultiply] = useState(false);
  const [changeSelected, setChangeSelected] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [reassignRoute, setReassignRoute] = useState([]);
  const [createRoute, setCreateRoute] = useState(false);

  const onRemoveOrder = useCallback(
    (id) => {
      setConfirmModalOpen(true);
      const newOrdersList = ordersList.filter((order) => order !== id);
      const newAssignedOrders = assignedOrders.filter(
        (order) => order._id !== id
      );
      dispatch({
        type: "UPDATE_ROUTE",
        updatedRoute: { ...currentRoute, orders: newOrdersList },
      });
      setOrdersList(() => newOrdersList);
      setAssignedOrders(() => newAssignedOrders);
    },
    [assignedOrders, ordersList, currentRoute, dispatch]
  );

  const handleAddSelected = (id) => {
    if (selectedOrders.includes(id)) {
      const newArr = selectedOrders.filter((item) => item !== id);
      setSelectedOrders(newArr);
    } else {
      setSelectedOrders((prev) => [...prev, id]);
    }
  };

  useEffect(() => {
    if (!!props.routeId) {
      const routeData = state.routes.find(
        (route) => route._id === props.routeId
      );
      const ordersList = routeData?.orders || [];
      setCurrentRoute(routeData);
      setOrdersList(ordersList);
    }
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
  }, [assignedOrders, ordersList, state.routes]);

  if (createRoute) {
    return <RegisterRouteForm orders={selectedOrders} onCancel={() => setCreateRoute(false)} />;
  }

  if (reassignRoute.length)
    return (
      <RoutesTable
        oldRoute={props.routeId}
        orders={reassignRoute}
        onCancel={() => setReassignRoute([])}
      />
    );

  return (
    <>
      {changeSelected && (
        <ChangeMultipleForm
          orders={selectedOrders}
          onUpdate={(val) => setChangeSelected(!val)}
          onCancel={() => setChangeSelected(false)}
        />
      )}
      {changeMultiply && (
        <ChangeMultipleForm
          orders={assignedOrders}
          onUpdate={(val) => setChangeMultiply(!val)}
          onCancel={() => setChangeMultiply(false)}
        />
      )}
      {rows.length > 0 ? (
        <TableContainer component={Paper}>
          {confirmModalOpen && (
            <Alert
              severity="success"
              variant="filled"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setConfirmModalOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              Order removed
            </Alert>
          )}
          <Table aria-label="Order List">
            <TableHead>
              <TableRow>
                <TableCell style={{ padding: 0, textAlign: "center" }}>
                  <AppButton
                    color="error"
                    onClick={() => setChangeMultiply(true)}
                  >
                    Change all
                  </AppButton>
                </TableCell>
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
              {rows?.map((order, i) => (
                <Row
                  key={order.id}
                  index={i}
                  row={order}
                  routeId={props.routeId}
                  reassignRoute={(val) => setReassignRoute([val])}
                  onSelectId={(val) => handleAddSelected(val)}
                  selected={selectedOrders}
                  onConfirmModalOpen={(id) => onRemoveOrder(id)}
                />
              ))}
            </TableBody>
          </Table>
          {selectedOrders.length > 0 && (
            <>
              <AppButton color="default" onClick={() => setSelectedOrders([])}>
                Clear selected
              </AppButton>
              <AppButton
                color="secondary"
                onClick={() => setChangeSelected(true)}
              >
                Change selected
              </AppButton>
              <AppButton
                color="primary"
                onClick={() => setReassignRoute(selectedOrders)}
              >
                Change route for selected
              </AppButton>
              <AppButton color="error" onClick={() => setCreateRoute(true)}>
                Create new route for selected
              </AppButton>
            </>
          )}
        </TableContainer>
      ) : (
        <Grid>No orders in this route!</Grid>
      )}
    </>
  );
}
