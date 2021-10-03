// import { useState, useEffect, useContext } from "react";
import { LinearProgress, TextField } from "@material-ui/core";
// import { useHistory } from "react-router-dom";
import { Autocomplete } from "@material-ui/lab";
// import { AppContext } from '../../store'
import AppButton from "../../components/AppButton";
// import api from "../../api";

const AllRoutesView = () => {
  // const history = useHistory();
  // const [loading, setLoading] = useState(true);
  // const [state, dispatch] = useContext(AppContext);

  // useEffect(() => {
  //   if (state.customers.length) {
  //     setLoading(false)
  //   } else {
  //     async function fetchData() {
  //       const res = await api.customers.read(); // List of All customers
  //       if (res) {
  //         dispatch({ type: 'SET_CUSTOMERS', customers: res });
  //         setLoading(false);
  //       }
  //     }
  //     fetchData();
  //   };
  // }, [dispatch, state.customers.length]);

  const handleAddRoute = () => {
    alert("Add Route");
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
      <AppButton color="success" onClick={handleAddRoute}>
        Add Route
      </AppButton>
    </>
  );
};
export default AllRoutesView;
