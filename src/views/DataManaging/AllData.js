import { useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import DataTabs from "./DataTabs";

const AllDataView = () => {
  const [selectedDataType, setSelectedDataType] = useState();

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
    </>
  );
};
export default AllDataView;
