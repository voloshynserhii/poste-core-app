import { useState, useCallback, useEffect, useContext } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, TextField, LinearProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import api from "../../../api";
import { AppContext } from "../../../store";
import AppButton from "../../../components/AppButton";
import AddDataForm from "./AddDataForm";
import DataFormList from "./DataFormList";
import { setDate } from "date-fns";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
    },
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "10px",
    },
    searchField: {
      width: "100%",
    },
  })
);

export default function DataTabs(props) {
  const classes = useStyles();
  const [state, dispatch] = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [add, setAdd] = useState(false);
  const [selectedDataType, setSelectedDataType] = useState();
  const [data, setData] = useState([]);
  
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
  
  //filter locations by their parent
  useEffect(() => {
    // const filteredData = data.filter((item) => item.parent === selectedDataType);
    // setDate(filteredData)
    // console.log(filteredData);
  }, [selectedDataType]);
  
  // const handleChange = (event) => {
  //   if (!checked?.includes(event.target.name)) {
  //     setChecked([...checked, event.target.name]);
  //     //   props.onGetValues([...checked, event.target.name]);
  //   } else {
  //     const newChecked = checked.filter((item) => item !== event.target.name);
  //     setChecked(newChecked);
  //     //   props.onGetValues(newChecked);
  //   }
  // };

  const searchCheckbox = useCallback(
    (event) => {
      if (event.target.value) {
        const lowerData = data.map((item) => item.toLowerCase());
        const res = lowerData.filter((item) =>
          item.includes(event.target.value)
        );
        const result = res.map((item) => {
          const lower = item.toLowerCase().slice(1);
          const first = item.charAt(0).toUpperCase();
          return first + lower;
        });
        setData(result);
      } else {
        setData(props.checkboxList);
      }
    },
    [data, props.checkboxList]
  );
  const dataType = ["Adjaria", "Kakhetia", "default"];
  
  if (loading) return <LinearProgress />;
  
  return (
    <Grid container fullwidth="true" spacing={2}>
      {add && <AddDataForm onCancel={() => setAdd(false)} />}
      <Grid item sm={12} className={classes.container}>
        <TextField
          className={classes.searchField}
          id="search"
          placeholder="Search location"
          type="search"
          variant="outlined"
          InputProps={{
            style: {
              maxHeight: 40,
              margin: "0 15px",
              padding: "0",
            },
          }}
          onChange={searchCheckbox}
        />
        <span>or</span>
        <AppButton onClick={() => setAdd(true)}>add</AppButton>
      </Grid>
      <div className={classes.root}>
        {/* filter locations by parent location */}
        {props.type !== "region" && (
          <Autocomplete
            id="data"
            options={dataType}
            getOptionLabel={(option) => option.toUpperCase()}
            style={{ width: "100%" }}
            value={selectedDataType || null}
            onChange={(event, newValue) => {
              setSelectedDataType(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose parent location"
                variant="outlined"
              />
            )}
          />
        )}
        <DataFormList data={data.filter(data => data.type === props.type)} />
      </div>
    </Grid>
  );
}
