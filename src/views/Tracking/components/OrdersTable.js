import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { AppContext } from "../../../store";
import OrdersToolbar from "./OrdersToolbar";
import OrdersTableHead from "./OrdersTableHead";

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
    background: "rgba(255,0,0,.2)",
  },
  green: {
    background: "rgba(0,128,0,.2)",
  },
}));

export default function OrdersTable({ data }) {
  const [state] = useContext(AppContext);
  const history = useHistory();
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("balance");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);

  function createData(
    id,
    trackingNumber,
    customer,
    assignedCurier,
    collectionFrom,
    deliveryTo,
    status,
    submissionSource,
    weight,
    declaredValue,
    date,
    updateDate
  ) {
    return {
      id,
      trackingNumber,
      customer,
      assignedCurier,
      collectionFrom,
      deliveryTo,
      status,
      submissionSource,
      weight,
      declaredValue,
      date,
      updateDate
    };
  }

  useEffect(() => {
    const rows = data.map((order) => {
      const customer = state.customers?.find((c) => c._id === order.customer);
      const assignedCurier = state.users?.find((c) => c._id === order.assignedCurier);
      return createData(
        order._id,
        order.trackingNumber,
        customer?.name || "no customer",
        assignedCurier?.name || "no assigned curier",
        order.collectionData?.city || "no address",
        order.deliveryData?.city || "no address",
        order.status || "no status",
        order.submissionSource || "no submission source",
        order.weight || 0,
        order.declaredValue || 0,
        order.createdAt,
        order.updateDate
      );
    });
    setRows(rows.reverse());
  }, [data, state.customers, state.assignedCurier]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSingleOrderView = (id) => {
    history.push(`tracking/${id}`);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <OrdersToolbar />
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
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      className={
                        row.status === "Cancelled"
                          ? classes.red
                          : row.status === "Pending"
                          ? classes.green
                          : null
                      }
                      hover
                      style={{ cursor: "pointer" }}
                      key={row.id}
                      onClick={() => handleSingleOrderView(row.id)}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        // padding="none"
                      >
                        {row.trackingNumber}
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }} align="left" padding="none">{row.customer}</TableCell>
                      <TableCell style={{ minWidth: 200 }} align="left" padding="none">{row.assignedCurier}</TableCell>
                      <TableCell align="left">{row.collectionFrom}</TableCell>
                      <TableCell align="left">{row.deliveryTo}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">{row.submissionSource}</TableCell>
                      <TableCell align="left">{row.weight}</TableCell>
                      <TableCell align="left">{row.declaredValue}</TableCell>
                      <TableCell align="left">
                        {row.date.replace("T", " ").replace("Z", " ").slice(0, 16)}
                      </TableCell>
                      <TableCell align="left">
                        {row.updateDate.replace("T", " ").replace("Z", " ").slice(0, 16)}
                      </TableCell>
                      {/* <TableCell align="left">
                        <AppButton
                          color="error"
                          onClick={() => handleDisable(row.id)}
                        >
                          Delete
                        </AppButton>
                      </TableCell> */}
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
          // rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </div>
  );
}
