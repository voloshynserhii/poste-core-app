import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import { AppContext } from "../../store";
import RoutesTable from "./components/RoutesTable";
import api from "../../api";

const useStyles = makeStyles((theme) => ({
  fixedButton: {
    position: "fixed",
    bottom: "3%",
    left: "25%",
  },
}));

const AllRoutesView = () => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(AppContext);

  useEffect(() => {
    if (state.routes.length) {
      setLoading(false);
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
  }, [dispatch, state.routes.length]);

  const handleAddRoute = () => {
    history.push("/route/form");
  };

  const routeType = ["last mile", "collection", "peer-to-peer", "transit"];

  if (loading) return <LinearProgress />;

  return (
    <>
      <Autocomplete
        id="userRoles"
        options={routeType}
        getOptionLabel={(option) => option.toUpperCase()}
        style={{ width: "100%" }}
        renderInput={(params) => (
          <TextField {...params} label="Choose route type" variant="outlined" />
        )}
      />
      <RoutesTable data={state.routes} />
      <Fab
        className={classes.fixedButton}
        color="secondary"
        aria-label="add"
        onClick={handleAddRoute}
      >
        <AddIcon />
      </Fab>
    </>
  );
};
export default AllRoutesView;
