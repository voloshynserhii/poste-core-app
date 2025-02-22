import { useState, useCallback, useEffect, useContext } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Grid, TextField, LinearProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import api from "../../../api";
import { AppContext } from "../../../store";
import AppButton from "../../../components/AppButton";
import AddDataForm from "./AddDataForm";
import DataFormList from "./DataFormList";

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
  const [selectedRegion, setSelectedRegion] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [data, setData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [dataToRender, setDataToRender] = useState(null);

  useEffect(() => {
    if (state.locations.length) {
      setLoading(false);
      setData(state.locations);
    } else {
      async function fetchData() {
        const res = await api.locations.read(); // List of All locations
        console.log(res);
        if (!!res && res.length > 0) {
          dispatch({ type: "SET_LOCATIONS", locations: res });
          setLoading(false);
        } else if (!!res) {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [dispatch, state.locations]);

  //filter locations by their parent
  useEffect(() => {
    if (props.type !== "region") {
      const filteredData = data.filter((item) => item.type === "region");
      setRegions(filteredData);
    }
  }, [data, props.type]);

  //set city by its parent region
  useEffect(() => {
    if (selectedRegion) {
      const cities = selectedRegion.children;
      if (props.type === "point") {
        setCities(cities);
      } else {
        setDataToRender(cities);
      }
    }
  }, [selectedRegion, props.type]);

  //set data by its parent region
  useEffect(() => {
    if (selectedCity) {
      const points = selectedCity.children;
      setDataToRender(points);
    }
  }, [selectedCity]);

  const searchLocation = useCallback(
    (event) => {
      if (event.target.value) {
        const filteredData = state.locations.filter((item) => !!item.name);
        const result = filteredData.filter((obj) =>
          obj.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setData(result);
      } else {
        setData(state.locations);
      }
    },
    [state.locations]
  );

  return (
    <Grid container fullwidth="true" spacing={2}>
      {add && (
        <AddDataForm
          title="Add new location"
          onSave={(val) => setAdd(!val)}
          onCancel={() => setAdd(false)}
        />
      )}
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
          onChange={searchLocation}
        />
        <span>or</span>
        <AppButton onClick={() => setAdd(true)}>add</AppButton>
      </Grid>
      <div className={classes.root}>
        {/* filter locations by parent location */}
        {props.type !== "region" && (
          <Autocomplete
            id="regionData"
            options={regions}
            getOptionLabel={(option) => option.name.toUpperCase()}
            style={{ width: "100%" }}
            value={selectedRegion || null}
            onChange={(event, newValue) => {
              setSelectedRegion(newValue);
              setSelectedCity("");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Choose region" variant="outlined" />
            )}
          />
        )}
        {props.type === "point" && (
          <Autocomplete
            id="cityData"
            options={cities}
            getOptionLabel={(option) => option.name.toUpperCase()}
            style={{ width: "100%", marginTop: 20 }}
            value={selectedCity || null}
            onChange={(event, newValue) => {
              setSelectedCity(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Choose city" variant="outlined" />
            )}
          />
        )}
        {loading ? (
          <LinearProgress />
        ) : (
          <DataFormList
            data={
              !dataToRender
                ? data.filter((data) => data.type === props.type)
                : dataToRender
            }
          />
        )}
      </div>
    </Grid>
  );
}
