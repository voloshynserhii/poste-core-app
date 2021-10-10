import { useState, useEffect, useContext } from "react";
import { LinearProgress, TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";

import { AppContext } from '../../store'
import RoutesTable from "./components/RoutesTable";
import AppButton from "../../components/AppButton";
import api from "../../api";

const AllRoutesView = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useContext(AppContext);

  useEffect(() => {
    if (state.routes.length) {
      setLoading(false)
    } else {
      async function fetchData() {
        const res = await api.routes.read(); // List of All routes
        if (res) {
          dispatch({ type: 'SET_ROUTES', routes: res });
          setLoading(false);
        }
      }
      fetchData();
    };
  }, [dispatch, state.routes.length]);

  const handleAddRoute = () => {
    history.push('/route/form');
  };
  const routeType = ["last mile", "collection", "peer-to-peer", "transit"];

  // if (loading) return <LinearProgress />;

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
      <AppButton color="success" onClick={handleAddRoute}>
        Add Route
      </AppButton>
    </>
  );
};
export default AllRoutesView;
