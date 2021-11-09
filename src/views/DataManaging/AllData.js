import { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import api from "../../api";
import { AppContext } from "../../store";
import DataTabs from "./DataTabs";

const useStyles = makeStyles((theme) => ({
  fixedButton: {
    position: "fixed",
    bottom: "5%",
    right: "5%",
  },
}));

const AllDataView = () => {
  const [state, dispatch] = useContext(AppContext);
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState();

  useEffect(() => {
    if (state.locations.length) {
      setLoading(false);
      setData(state.locations);
    } else {
      async function fetchData() {
        const res = await api.locations.read(); // List of All routes
        console.log(res);
        if (res) {
          dispatch({ type: "SET_LOCATIONS", locations: res });
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [dispatch, state.routes]);
  
  const handleAddDataType = () => {
    alert("Do you want to add data type?")
    // history.push("/route/form");
  };

  const dataType = ["Locations", "Other"];

  return (
    <>
      <Autocomplete
        id="data"
        options={dataType}
        getOptionLabel={(option) => option.toUpperCase()}
        style={{ width: "100%" }}
        value={selectedDataType}
        onChange={(event, newValue) => {
          setSelectedDataType(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Choose data" variant="outlined" />
        )}
      />
      <DataTabs />
      <Fab
        className={classes.fixedButton}
        color="secondary"
        aria-label="add data type"
        onClick={handleAddDataType}
      >
        <AddIcon />
      </Fab>
    </>
  );
};
export default AllDataView;
