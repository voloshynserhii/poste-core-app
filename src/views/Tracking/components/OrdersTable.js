import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import AppButton from "../../../components/AppButton";
import api from "../../../api";
import { AppContext } from "../../../store";
import Menu from "../../../components/Menu";
import OrdersToolbar from "./OrdersToolbar";
import OrdersTableHead from "./OrdersTableHead";
import RouteTabs from "./RouteTabs";
import RoutesTable from "../../Routes/components/RoutesTable";
import ChangeMultipleForm from "./ChangeMultipleForm";

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
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
    },
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
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
  red: {
    background: "rgba(136, 14, 79,.3)",
  },
  green: {
    background: "#1FAEAB",
  },
  fixedButton: {
    position: "fixed",
    bottom: "5%",
    right: "5%",
  },
}));

const menuOptions = ["Order routes", "Edit order", "Delete order"];

export default function OrdersTable({ data, ...props }) {
  const [state, dispatch] = useContext(AppContext);
  const history = useHistory();
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [assignRoute, setAssignRoute] = useState(false);
  const [orderToAssignRoute, setOrderToAssignRoute] = useState();
  const [multiplyAssignRoute, setMultiplyAssignRoute] = useState(false);
  const [changeMultiply, setChangeMultiply] = useState(false);

  function createData(
    id,
    trackingNumber,
    customer,
    curier,
    collectionFrom,
    deliveryTo,
    status,
    submissionSource,
    weight,
    declaredValue,
    date,
    updateDate,
    routeData
  ) {
    return {
      id,
      trackingNumber,
      customer,
      curier,
      collectionFrom,
      deliveryTo,
      status,
      submissionSource,
      weight,
      declaredValue,
      date,
      updateDate,
      routeData,
    };
  }

  useEffect(() => {
    const rows = data.map((order) => {
      const customer = state.customers?.find((c) => c._id === order.customer);
      const curier = state.users?.find((c) => c._id === order.collectionCurier);
      const deliveryCity = state.locations?.find(
        (loc) => loc._id === order.deliveryData?.city
      );
      const collectionCity = state.locations?.find(
        (loc) => loc._id === order.collectionData?.city
      );

      return createData(
        order._id,
        order.trackingNumber,
        customer?.name || "no customer",
        curier?.name || "no curier",
        collectionCity?.name || "no address",
        deliveryCity?.name || "no address",
        order.status || "no status",
        order.submissionSource || "no submission source",
        order.weight || 0,
        order.declaredValue || 0,
        order.createdAt || "today",
        order.updateDate || "today",
        order.routeData || []
      );
    });
    setRows(rows.reverse());
  }, [data, state.customers, state.users, state.locations]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
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

  const handleClick = (event, name) => {
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
    //show modal do you really want to delete order?
    const res = await api.orders.delete(id);
    if (res.status === 200) {
      dispatch({ type: "DELETE_ORDER", payload: id });
      history.replace("/tracking");
      //show modal
    }
    alert(res.data.message);
  };

  const handleGetOption = (value, id) => {
    if (value === "Edit order") history.push(`tracking/${id}`);
    if (value === "Delete order") handleDelete(id);
    if (value === "Order routes") {
      setAssignRoute(true);
      setOrderToAssignRoute(id);
    }
  };

  //open form for multiple orders assigning to routes
  const handleAssignToRoutes = (val) => {
    setMultiplyAssignRoute(val);
  };
  //open form for multiple orders changing
  const handleChangeMultiply = (val) => {
    setChangeMultiply(val);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleAddOrder = () => {
    history.push("/tracking/form");
  };

  if (multiplyAssignRoute)
    return (
      <RoutesTable
        orders={selected}
        onCancel={() => setMultiplyAssignRoute(false)}
      />
    );

  return (
    <div className={classes.root}>
      {changeMultiply && (
        <ChangeMultipleForm
          orders={selected}
          onUpdate={(val) => setChangeMultiply(!val)}
          onCancel={() => setChangeMultiply(false)}
        />
      )}
      {assignRoute && (
        <>
          <AppButton onClick={() => setAssignRoute(false)}>back</AppButton>
          <RouteTabs orderId={orderToAssignRoute} />
        </>
      )}
      {!assignRoute && (
        <Paper className={classes.paper}>
          <OrdersToolbar
            numSelected={selected.length}
            selectedList={selected}
            onAssignToRoutes={(val) => handleAssignToRoutes(val)}
            onChangeMultiply={(val) => handleChangeMultiply(val)}
          />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={"small"}
              aria-label="enhanced table"
            >
              <OrdersTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                rowCount={rows.length}
              />
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableBody key={row.id}>
                      <TableRow
                        className={
                          row.status === "Cancelled"
                            ? classes.red
                            : row.status === "Pending"
                            ? classes.green
                            : null
                        }
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        hover
                        style={{ cursor: "pointer" }}
                        selected={isItemSelected}
                        onClick={(event) => handleClick(event, row.id)}
                      >
                        <TableCell>
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                          >
                            {open ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Menu
                            options={menuOptions}
                            onMenuClick={(opt) => handleGetOption(opt, row.id)}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          {row.trackingNumber}
                        </TableCell>
                        <TableCell
                          style={{ minWidth: 200 }}
                          align="left"
                          padding="none"
                        >
                          {row.customer}
                        </TableCell>
                        <TableCell
                          style={{ minWidth: 200 }}
                          align="left"
                          padding="none"
                        >
                          <p>
                            {"->"}: {row.curier}
                          </p>
                          <p>
                            {"<-"}: {row.curier}
                          </p>
                        </TableCell>
                        <TableCell align="left">{row.collectionFrom}</TableCell>
                        <TableCell align="left">{row.deliveryTo}</TableCell>
                        <TableCell align="left">{row.status}</TableCell>
                        <TableCell align="left">
                          {row.submissionSource}
                        </TableCell>
                        <TableCell align="left">{row.weight}</TableCell>
                        <TableCell align="left">{row.declaredValue}</TableCell>
                        <TableCell align="left">
                          {row.date
                            ?.replace("T", " ")
                            .replace("Z", " ")
                            .slice(0, 16) || "today"}
                        </TableCell>
                        <TableCell align="left">
                          {/* {row.updateDate?.replace("T", " ").replace("Z", " ").slice(0, 16) || 'today'} */}
                          {row.updateDate}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={9}
                        >
                          <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                Details
                              </Typography>
                              <Table size="small" aria-label="details">
                                <TableHead>
                                  <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Region</TableCell>
                                    <TableCell>City</TableCell>
                                    <TableCell align="right">
                                      Address1
                                    </TableCell>
                                    <TableCell align="right">
                                      Address2
                                    </TableCell>
                                    <TableCell align="right">Phone</TableCell>
                                    <TableCell align="right">Email</TableCell>
                                    <TableCell align="right">
                                      Contact Name
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>FROM</TableCell>
                                    {/* <TableCell>{row.collectionData.region}</TableCell>
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
                    </TableCell> */}
                                  </TableRow>
                                  <TableRow>
                                    <TableCell>TO</TableCell>
                                    {/* <TableCell>{row.deliveryData.region}</TableCell>
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
                    </TableCell> */}
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  );
                })}
              {emptyRows > 0 && (
                <TableBody>
                  <TableRow style={{ height: 35 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                </TableBody>
              )}
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
          <Fab
            className={classes.fixedButton}
            color="secondary"
            aria-label="add"
            onClick={handleAddOrder}
          >
            <AddIcon />
          </Fab>
        </Paper>
      )}
    </div>
  );
}
