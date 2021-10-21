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

  const deleteRoute = useCallback(async (id) => {
    const res = await api.routes.delete(id);
    if (res.status === 200) {
      dispatch({ type: "DELETE_ROUTE", payload: id });
    }
  }, [dispatch]);

  const handleDelete = () => {
    setConfirm(true);
  };

  const onDialogClose = useCallback((event, reason) => {
    setConfirm(false);
  }, []);

  const onDialogConfirm = useCallback(() => {
    selectedList.forEach((route) => deleteRoute(route));
    setConfirm(false);
  }, [deleteRoute, selectedList]);

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
          title={`Delete Route?`}
          body={`Do you really want to delete route from Database?`}
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
          {numSelected} routes selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Routes Table
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon onClick={handleDelete} />
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
