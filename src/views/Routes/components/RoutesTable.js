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
} from "@material-ui/core";

import api from "../../../api";
import { AppContext } from "../../../store";
import Menu from "../../../components/Menu";
import OrdersToolbar from "./RoutesToolbar";
import OrdersTableHead from "./RoutesTableHead";

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

const menuOptions = ["Assign order", "Edit", "Delete"]

export default function RoutesTable({ data }) {
  const [state, dispatch] = useContext(AppContext);
  const history = useHistory();
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [assignRoute, setAssignRoute] = useState(false);

  function createData(
    id,
    title,
    type,
    startPlace,
    finishPlace,
    region,
    status

  ) {
    return {
      id,
      title,
      type,
      startPlace,
      finishPlace,
      region,
      status
    };
  }

  useEffect(() => {
    console.log(data)
    const rows = data.map((route) => {
      const customer = state.customers?.find((c) => c._id === route.customer);
      const assignedCurier = state.users?.find(
        (c) => c._id === route.assignedCurier
      );
      return createData(
        route._id,
        route.title,
        // customer?.name || "no customer",
        // assignedCurier?.name || "no assigned curier",
        route.type || "no type",
        route.startPlace || "no address",
        route.finishPlace || "no address",
        route.region || "no region",
        route.status || "no status",
      );
    });
    setRows(rows.reverse());
  }, [data, state.customers, state.users]);

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
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };
  
  const handleDelete = async (id) => {
    //show modal do you really want to delete order?
    const res = await api.orders.delete(id);
    if (res.status === 200) {
      dispatch({ type: 'DELETE_ORDER', payload: id });
      history.replace("/tracking");
      //show modal
    }
    alert(res.data.message);
  };
  
  const handleGetOption = (value, id) => {
    if (value === "Edit") history.push(`tracking/${id}`);
    if (value === "Delete") handleDelete(id);
    if (value === "Assign to route") setAssignRoute(true);
  }
  
  const isSelected = (name) => selected.indexOf(name) !== -1;
  
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <OrdersToolbar numSelected={selected.length} selectedList={selected}/>
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
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const isItemSelected = isSelected(row.id);
                  return (
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
                      key={row.id}
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
                      </TableCell>
                      <TableCell>
                        <Menu options={menuOptions} onMenuClick={(opt) => handleGetOption(opt, row.id)}/>
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                      >
                        {row.title}
                      </TableCell>
                      <TableCell
                        style={{ minWidth: 200 }}
                        align="left"
                        padding="none"
                      >
                        {row.type}
                      </TableCell>
                      <TableCell
                        style={{ minWidth: 200 }}
                        align="left"
                        padding="none"
                      >
                        {row.startPlace}
                      </TableCell>
                      <TableCell align="left">{row.finishPlace}</TableCell>
                      <TableCell align="left">{row.region}</TableCell>
                      <TableCell align="left">{row.status}</TableCell>
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
    </div>
  );
}
