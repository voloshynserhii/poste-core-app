import { useState, useEffect, useCallback, useContext } from "react";
import {
  makeStyles,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@material-ui/core";

import { AppContext } from "../../../store";
import api from "../../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../../utils/form";
import AppButton from "../../../components/AppButton";

const userForm = makeStyles((theme) => ({
  root: {
    position: "absolute",
    width: "50%",
    left: "23vw",
    top: "10%",
    paddingBottom: 100,
    zIndex: 10001,
  },
  layer: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 10000,
    overflow: "scroll",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(1),
  },
  selectContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10
  },
  selects: {
    width: "45%",
    height: 30,
    border: 'none'
  }
}));

const VALIDATE_FORM_LOCATION = {
  name: {
    type: "string",
    presence: { allowEmpty: false },
  },
};

const AddDataForm = ({ onCancel }) => {
  const [state, dispatch] = useContext(AppContext);
  const classes = userForm();
  const [locationSaved, setLocationSaved] = useState(false);
  const [locationType, setLocationType] = useState("");
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [parent, setParent] = useState();

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_LOCATION,
      initialValues: { name: "" },
    });
  const values = formState.values;

  const formLocation = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        name: "",
        nameGE: "",
        type: "",
      },
    }));
  }, [setFormState]);

  useEffect(() => {
    formLocation();
  }, [formLocation]);

  useEffect(() => {
    if (locationType === "city") {
      const regions = state.locations.filter((loc) => loc.type === "region");
      setRegions(regions);
    }
    if (locationType === "village") {
      const cities = state.locations.filter((loc) => loc.type === "city");
      setCities(cities);
    }
  }, [locationType, state.locations]);

  const saveRecord = async () => {
    const newLocation = {
      ...formState.values,
      type: locationType,
      parent: parent
    };
    console.log(newLocation);
    try {
      // save changes in BD
      const res = await api.locations.create(newLocation);
      const savedLocation = res.data;
      if (res.status === 200) {
        dispatch({ type: "ADD_LOCATION", payload: savedLocation });
        setLocationSaved(true);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later");
    }
  };

  const handleSave = () => {
    // Save without confirmation
    saveRecord();
    return;
  };

  if (locationSaved) return null;

  return (
    <div className={classes.layer}>
      <Card className={classes.root}>
        <CardHeader title="Input all fields" />
        <CardContent>
          <TextField
            label="Location name in English"
            name="name"
            value={values?.name}
            error={fieldHasError("name")}
            helperText={
              fieldGetError("name") || "Provide a name of the location"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Location name in Georgian"
            name="nameGE"
            value={values?.nameGE}
            error={fieldHasError("nameGE")}
            helperText={
              fieldGetError("nameGE") ||
              "Provide a name of the location in Georgian"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Universal code of the location"
            name="code"
            value={values?.code}
            error={fieldHasError("code")}
            helperText={
              fieldGetError("code") ||
              "Provide a universal code of the location"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <Grid container style={{ marginTop: 20, marginBottom: 20 }}>
            <Typography style={{ margin: "auto" }}>
              Select type of the location
            </Typography>
            <Grid item className={classes.container} sm={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={locationType === "region"}
                    onChange={() => setLocationType("region")}
                    name="region"
                    color="primary"
                  />
                }
                label="Region"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={locationType === "city"}
                    onChange={() => setLocationType("city")}
                    name="city"
                    color="primary"
                  />
                }
                label="City"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={locationType === "village"}
                    onChange={() => setLocationType("village")}
                    name="village"
                    color="primary"
                  />
                }
                label="District or Village"
              />
            </Grid>
            <Grid item sm={7} className={classes.selectContainer}>
            {locationType !== "region" && (
              <select className={classes.selects} onChange={(event) => setParent(event.target.value)}>
                Regions
                {regions.map((region) => (
                  <option key={region._id} value={region._id}>
                    {region.name}
                  </option>
                ))}
              </select>
            )}
            {locationType === "village" && (
              <select className={classes.selects} onChange={(event) => setParent(event.target.value)}>
                Cities
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            )}
            </Grid>
          </Grid>

          <Grid container justifyContent="center" alignItems="center">
            <AppButton onClick={onCancel}>Cancel</AppButton>
            <AppButton
              color="success"
              disabled={!formState.isValid}
              onClick={handleSave}
            >
              Save
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
export default AddDataForm;
