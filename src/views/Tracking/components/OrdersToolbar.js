import { useState, useCallback, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Typography, Toolbar, Tooltip } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import DeleteIcon from "@material-ui/icons/Delete";

import api from "../../../api";
import { AppContext } from "../../../store";
import { ConfirmationDialog } from "../../../components/Dialogs";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: "1 1 100%",
  },
}));

const UsersToolbar = (props) => {
  const classes = useToolbarStyles();
  const [, dispatch] = useContext(AppContext);
  const [confirm, setConfirm] = useState(false);
  const { numSelected, selectedList } = props;

  const deleteOrder = useCallback(async (id) => {
    const res = await api.orders.delete(id);
    if (res.status === 200) {
      dispatch({ type: "DELETE_ORDER", payload: id });
    }
  }, [dispatch]);

  const handleDelete = () => {
    setConfirm(true);
  };

  const onDialogClose = useCallback((event, reason) => {
    setConfirm(false);
  }, []);

  const onDialogConfirm = useCallback(() => {
    selectedList.forEach((order) => deleteOrder(order));
    setConfirm(false);
  }, [deleteOrder, selectedList]);

  return (
    <Toolbar
      className={classes.root}
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => theme.palette.primary.main,
        }),
      }}
    >
      {confirm && (
        <ConfirmationDialog
          open
          title={`Delete Order?`}
          body={`Do you really want to delete orders from Database?`}
          confirmButtonText="Confirm and Delete"
          confirmButtonColor="success"
          onClose={onDialogClose}
          onConfirm={onDialogConfirm}
        />
      )}
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} orders selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Orders Table
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={handleDelete} >
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list" onClick={props.onFilter}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default UsersToolbar;
