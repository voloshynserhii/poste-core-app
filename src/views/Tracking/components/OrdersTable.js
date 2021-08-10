import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Switch from '@material-ui/core/Switch';
import OrdersToolbar from "./OrdersToolbar";
import OrdersTableHead from "./OrdersTableHead";
import AppButton from "../../../components/AppButton";

// import USERS from '../utils';

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
}));

export default function OrdersTable({ data }) {
  const history = useHistory();
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("balance");
  const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  function createData(
    id,
    trackingNumber,
    customer,
    collectionFrom,
    deliveryTo,
    date,
    weight,
    status,
    submissionSource,
    submittedBy,
    assignedCurier,
    declaredValue
  ) {
    return {
      id,
      trackingNumber,
      customer,
      collectionFrom,
      deliveryTo,
      date,
      weight,
      status,
      submissionSource,
      submittedBy,
      assignedCurier,
      declaredValue,
    };
  }

  useEffect(() => {
    const rows = data.map((order) => {
      return createData(
        order._id,
        order.trackingNumber,
        order.customer,
        order.collectionData.city,
        order.deliveryData.city,
        order.createdAt,
        order.status,
        order.submissionSource,
        order.submittedBy,
        order.assignedCurier,
        order.weight,
        order.declaredValue
      );
    });
    setRows(rows);
  }, [data]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDisable = (id) => {
    let selectedItem = rows.find((item) => item.id === id);
    selectedItem = {
      ...selectedItem,
      status: false,
    };
    const item = rows.findIndex((item) => item.id === selectedItem.id);
    setRows((prev) => {
      prev.splice(item, 1);
      return [...prev, selectedItem];
    });
  };
  const handleEnable = (id) => {
    let selectedItem = rows.find((item) => item.id === id);
    selectedItem = {
      ...selectedItem,
      status: true,
    };
    const item = rows.findIndex((item) => item.id === selectedItem.id);
    setRows((prev) => {
      prev.splice(item, 1);
      return [...prev, selectedItem];
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                        padding="none"
                      >
                        {row.trackingNumber}
                      </TableCell>
                      <TableCell align="left">{row.customer}</TableCell>
                      <TableCell align="left">{row.collectionFrom}</TableCell>
                      <TableCell align="left">{row.deliveryTo}</TableCell>
                      <TableCell align="left">{row.date}</TableCell>
                      <TableCell align="left">{row.weight}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
                      <TableCell align="left">{row.submissionSource}</TableCell>
                      <TableCell align="left">{row.submittedBy}</TableCell>
                      <TableCell align="left">{row.assignedCurier}</TableCell>
                      <TableCell align="left">{row.declaredValue}</TableCell>
                      <TableCell align="left">
                        {row.status ? (
                          <AppButton
                            color="error"
                            onClick={() => handleDisable(row.id)}
                          >
                            Decline
                          </AppButton>
                        ) : (
                          <AppButton
                            color="success"
                            onClick={() => handleEnable(row.id)}
                          >
                            Approve
                          </AppButton>
                        )}
                      </TableCell>
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          // onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
