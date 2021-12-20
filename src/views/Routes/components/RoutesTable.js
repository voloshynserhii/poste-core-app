import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { LinearProgress } from "@material-ui/core";

import api from "../../../api";
import { AppContext } from "../../../store";
import { AppButton } from "../../../components";
import Menu from "../../../components/Menu";
import RoutesToolbar from "./RoutesToolbar";
import RoutesTableHead from "./RoutesTableHead";
import OrderList from "./OrderList";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "calc(100vw - 256px)",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
    },
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  table: {
    minWidth: 750,
    width: "max-content",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  full: {
    background: "rgba(255,0,0,.2)",
  },
  onLoading: {
    background: "rgba(123,92,136,.4)",
  },
  empty: {
    background: "transparent",
  },
}));

const menuOptions = ["View route", "Edit route", "Orders", "Delete route"];

export default function RoutesTable({ oldRoute, orders, onCancel }) {
  const [state, dispatch] = useContext(AppContext);
  const history = useHistory();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [selectedRouteType, setSelectedRouteType] = useState();
  const [assignOrder, setAssignOrder] = useState(false);
  const [routeId, setRouteId] = useState();
  const [data, setData] = useState([]);
  const [assignedRoutes, setAssignedRoutes] = useState([]);
console.log(orders, assignedRoutes, oldRoute)
  function createData(
    id,
    title,
    type,
    startPlace,
    finishPlace,
    region,
    status,
    locations,
    orders
  ) {
    return {
      id,
      title,
      type,
      startPlace,
      finishPlace,
      region,
      status,
      locations,
      orders
    };
  }
  
  

  useEffect(() => {
    if (state.routes.length) {
      setLoading(false);
      setData(state.routes);
    } else {
      async function fetchData() {
        const res = await api.routes.read(); // List of All routes
        if (res) {
          dispatch({ type: "SET_ROUTES", routes: res });
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [dispatch, state.routes]);

  useEffect(() => {
    let filteredData;
    if (!!selectedRouteType) {
      filteredData = data.filter((route) => route.type === selectedRouteType);
    } else {
      filteredData = data;
    }
    const rows = filteredData.map((route) => {
      return createData(
        route._id,
        route.title,
        route.type || "no type",
        route.startPlace || "no address",
        route.finishPlace || "no address",
        route.region || "no region",
        route.status || "no status",
        route.locations, 
        route.orders
      );
    });
    setRows(rows.reverse());
  }, [data, selectedRouteType]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked && !orders) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAssignToRoutes = async (route) => {
    if (orders) {
      if (assignedRoutes.includes(route)) {
        for (let i = 0; i < orders.length; i++) {
          const result = await api.orders.unassignRoute(orders[i], route);
          await dispatch({type: 'UNASSIGN_ROUTE', orderId: orders[i], routeId: route});
          console.log(result);
        }
      } else {
        console.log("addMultiplyOrders", orders, route);
        await api.routes.addMultiplyOrders(orders, route);
        await dispatch({type: 'ASSIGN_MULTIPLE_ROUTE', orders, routeId: oldRoute});
        if (!!oldRoute) {
          for (let i = 0; i < orders.length; i++) {
            const result = await api.orders.unassignRoute(orders[i], oldRoute);
            await dispatch({type: 'UNASSIGN_ROUTE', orderId: orders[i], routeId: oldRoute});
            console.log(result);
          }
        }
          setAssignedRoutes((prev) => [...prev, route]);
      }
    }
  };

  const handleClick = async (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleDelete = async (id) => {
    //show modal do you really want to delete route?
    const res = await api.routes.delete(id);
    if (res.status === 200) {
      dispatch({ type: "DELETE_ROUTE", payload: id });
      history.replace("/route");
      //show modal
    }
    alert(res.data.message);
  };

  const handleGetOption = (value, id) => {
    if (value === "Edit route") history.push(`route/${id}`);
    if (value === "Delete route") handleDelete(id);
    if (value === "Orders") {
      setAssignOrder(true);
      setRouteId(id);
    }
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const routeType = ["lastMile", "collection", "peer-to-peer", "transit"];

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  if (loading) return <LinearProgress />;

  return (
    <div className={classes.root} style={onCancel ? {position: "absolute", top: '14%'} : {}}>
      {assignOrder && (
        <>
          <AppButton color="default" onClick={() => setAssignOrder(false)}>back to all routes</AppButton>
          <OrderList routeId={routeId} />
        </>
      )}
      {!!onCancel && <AppButton color="primary" style={{position: 'absolute', right: "2%", top: "-3%"}} onClick={onCancel}>Cancel</AppButton>}
      {!assignOrder && (
        <Paper className={classes.paper}>
          <Autocomplete
            id="routeType"
            options={routeType}
            getOptionLabel={(option) => option.toUpperCase()}
            style={{ width: "100%" }}
            value={selectedRouteType}
            onChange={(event, newValue) => {
              setSelectedRouteType(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose route type"
                variant="outlined"
              />
            )}
          />
          {!orders && (
            <RoutesToolbar
              numSelected={selected.length}
              selectedList={selected}
            />
          )}
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={"small"}
              aria-label="enhanced table"
            >
              <RoutesTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const isItemSelected = isSelected(row.id);
                    return (
                      <TableRow
                        className={
                          row.orders.length > 0
                            ? classes.onLoading
                            : classes.empty
                        }
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        hover
                        style={{ cursor: "pointer" }}
                        key={row.id}
                        selected={!orders ? isItemSelected : false}
                        onClick={(event) => handleClick(event, row.id)}
                      >
                        {orders ? (
                          <>
                            <TableCell>
                              <AppButton
                                color={
                                  assignedRoutes.includes(row.id)|| orders.every(order => row.orders.includes(order))
                                    ? "primary"
                                    : "default"
                                }
                                onClick={() => handleAssignToRoutes(row.id)}
                              >
                                {assignedRoutes.includes(row.id) || orders.every(order => row.orders.includes(order))
                                  ? "Assigned"
                                  : "Assign"}
                              </AppButton>
                            </TableCell>
                            <TableCell />
                          </>
                        ) : (
                          <>
                            <TableCell>
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Menu
                                options={menuOptions}
                                onMenuClick={(opt) =>
                                  handleGetOption(opt, row.id)
                                }
                              />
                            </TableCell>
                          </>
                        )}

                        <TableCell component="th" id={labelId} scope="row">
                          {row.title}
                        </TableCell>
                        <TableCell
                          style={{ minWidth: 100 }}
                          align="left"
                          padding="none"
                        >
                          {row.type}
                        </TableCell>
                        <TableCell
                          style={{ minWidth: 100 }}
                          align="left"
                          padding="none"
                        >
                          {row.startPlace.name || "none"}
                        </TableCell>
                        <TableCell align="left">
                          {row.finishPlace.name || "none"}
                        </TableCell>
                        <TableCell align="left">
                          {row.region.name || "none"}
                        </TableCell>
                        <TableCell align="left">{row.status}</TableCell>
                        <TableCell align="left">View locations</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 35 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </div>
  );
}
