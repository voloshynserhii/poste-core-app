import { useState, useEffect, useContext } from "react";
import { TextField, LinearProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import api from "../../api";
import { AppContext } from "../../store";
import DataTabs from "./DataTabs";

const AllDataView = () => {
  const [state, dispatch] = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedDataType, setSelectedDataType] = useState();

  useEffect(() => {
    if (state.locations.length) {
      setLoading(false);
      setData(state.locations);
    } else {
      async function fetchData() {
        const res = await api.locations.read(); // List of All locations
        if (res) {
          dispatch({ type: "SET_LOCATIONS", locations: res });
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [dispatch, state.locations]);

  const dataType = ["Locations", "Other"];

  if (loading) return <LinearProgress />;

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
      <DataTabs data={data} />
    </>
  );
};
export default AllDataView;
