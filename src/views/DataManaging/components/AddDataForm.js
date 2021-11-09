import { useState, useEffect, useCallback, useContext } from "react";
import {
  makeStyles,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Checkbox,
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
  },
}));

const VALIDATE_FORM_LOCATION = {
  name: {
    type: "string",
    presence: { allowEmpty: false },
  },
};

const AddDataForm = ({ onCancel }) => {
  const [, dispatch] = useContext(AppContext);
  const classes = userForm();
  const [locationSaved, setLocationSaved] = useState(false);
  const [locationType, setLocationType] = useState("");

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
        type: "",
      },
    }));
  }, [setFormState]);

  useEffect(() => {
    formLocation();
  }, [formLocation]);

  const saveRecord = async () => {
    const newLocation = {
      ...formState.values,
      type: locationType,
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
            label="Location name"
            name="name"
            value={values?.name}
            error={fieldHasError("name")}
            helperText={fieldGetError("name") || "Provide a name of a location"}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <Grid container>
            <Typography style={{ margin: "auto" }}>
              Select type of a new location
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
