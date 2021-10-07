import { useState, useEffect, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  MenuItem,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";

import { AppContext } from "../../../store";
import api from "../../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../../utils/form";
import AppButton from "../../../components/AppButton";

const orderForm = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "20px 0 50px 0",
  },
}));

const VALIDATE_FORM_ROUTE = {
  title: {
    type: "string",
    presence: { allowEmpty: false },
  },
  //   taxId: {
  //     type: "string",
  //     presence: { allowEmpty: false },
  //   },
  //   password: {
  //     type: "string",
  //     presence: { allowEmpty: true },
  //   },
};

const RegisterRouteForm = ({ onCancel }) => {
  const history = useHistory();
  const [state, dispatch] = useContext(AppContext);
  const classes = orderForm();

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ROUTE,
      initialValues: {},
    });
  const values = formState.values;

  const formRoute = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        title: "",
        type: "",
        region: "",
        startPlace: "",
        finishPlace: "",
        status: "",
      },
    }));
    return;
  }, [setFormState]);

  useEffect(() => {
    formRoute();
  }, [formRoute]);

  const saveRecord = async () => {
    // save changes in BD
    try {
      const res = await api.routes.create(formState.values);
      const newRoute = res.data.data.route;
      if (res.status === 201) {
        dispatch({ type: "ADD_ROUTE", payload: newRoute });
      }
      history.push("/route");
    } catch (err) {
      alert("Something went wrong. Please try again!");
    }
  };

  const handleSave = () => {
    // Save without confirmation
    saveRecord();
    return;
  };

  return (
    <Card className={classes.root}>
      <CardHeader title="Add new route" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Title"
              name="title"
              value={values.title}
              error={fieldHasError("title")}
              helperText={fieldGetError("title") || "Display name of the route"}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              required
              select
              label="Type"
              name="type"
              defaultValue={values.type}
              error={fieldHasError("type")}
              helperText={fieldGetError("type") || "Display type of the route"}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="transit">Transit</MenuItem>
              <MenuItem value="lastMile">Last Mile</MenuItem>
              <MenuItem value="collection">Collection</MenuItem>
              <MenuItem value="peerToPeer">Peer-to-peer</MenuItem>
            </TextField>
            <TextField
              select
              label="Start place"
              name="startPlace"
              defaultValue={values.startPlace}
              error={fieldHasError("startPlace")}
              helperText={
                fieldGetError("startPlace") ||
                "Display start place of the route"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="tbilisi">Tbilisi</MenuItem>
              <MenuItem value="batumi">Batumi</MenuItem>
            </TextField>
            <TextField
              select
              label="Finish place"
              name="finishPlace"
              defaultValue={values.finishPlace}
              error={fieldHasError("finishPlace")}
              helperText={
                fieldGetError("finishPlace") ||
                "Display finish place of the route"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="tbilisi">Tbilisi</MenuItem>
              <MenuItem value="batumi">Batumi</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Region"
              name="region"
              defaultValue={values.region}
              error={fieldHasError("region")}
              helperText={
                fieldGetError("region") || "Display region of the route"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="adjaria">Adjaria</MenuItem>
              <MenuItem value="kakhetia">Kakhetia</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              name="status"
              defaultValue={values.status}
              error={fieldHasError("status")}
              helperText={
                fieldGetError("status") || "Display status of the route"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="onLoading">On loading</MenuItem>
              <MenuItem value="started">Started</MenuItem>
              <MenuItem value="finished">Finished</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </CardContent>
      <Grid container justifyContent="center" alignItems="center">
        <AppButton onClick={onCancel}>Cancel</AppButton>
        <AppButton
          color="success"
          disabled={!formState.isValid}
          onClick={handleSave}
        >
          Save Route
        </AppButton>
      </Grid>
    </Card>
  );
};
export default RegisterRouteForm;
