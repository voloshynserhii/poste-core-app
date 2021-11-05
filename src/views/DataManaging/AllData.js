import { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import DataTabs from "./DataTabs";

const useStyles = makeStyles((theme) => ({
  fixedButton: {
    position: "fixed",
    bottom: "5%",
    right: "5%",
  },
}));

const AllDataView = () => {
  const classes = useStyles();
  const history = useHistory();
  const [selectedDataType, setSelectedDataType] = useState();

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
