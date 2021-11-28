import { useState, useEffect, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  makeStyles,
  MenuItem,
  Grid,
  TextField,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { AppContext } from "../../../store";
import api from "../../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../../utils/form";
import AppButton from "../../../components/AppButton";

const orderForm = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "20px 0 50px 0",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: "1fr 1fr"
  }
}));

const VALIDATE_FORM_ROUTE = {
  title: {
    type: "string",
    presence: { allowEmpty: false },
  },
};

const RegisterRouteForm = ({ onCancel }) => {
  const history = useHistory();
  const [state, dispatch] = useContext(AppContext);
  const classes = orderForm();
  const [locationsArr, setLocationsArr] = useState([]);

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
        terminal: "",
        status: "",
        locations: [],
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
      const res = await api.routes.create({
        ...formState.values,
        locations: locationsArr,
      });
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

  const handleAddLocation = (id) => {
    if (locationsArr.includes(id)) {
      const newArr = locationsArr.filter((location) => location !== id);
      setLocationsArr(newArr);
    } else {
      setLocationsArr((prev) => [...prev, id]);
    }
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
              value={values.title || ""}
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
              value={values.type || ""}
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
              label="Status"
              name="status"
              value={values.status || ""}
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
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Terminal"
              name="terminal"
              value={values.terminal || ""}
              error={fieldHasError("terminal")}
              helperText={
                fieldGetError("terminal") || "Display terminal of the route"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            >
              {!!state.locations &&
                state.locations
                  .filter((loc) => loc.type === "city")
                  .filter((loc) => loc.terminal)
                  .map((location) => (
                    <MenuItem value={location._id} key={location._id}>
                      {location.name}
                    </MenuItem>
                  ))}
            </TextField>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Locations</Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.grid}>
                {!!state.locations &&
                  state.locations
                    .filter((loc) => loc.type === "city")
                    .map((location) => (
                      <FormControlLabel
                        key={location._id}
                        control={
                          <Checkbox
                            checked={locationsArr.includes(location._id)}
                            onChange={() => handleAddLocation(location._id)}
                            name={location.name}
                            color="primary"
                          />
                        }
                        label={location.name}
                      />
                    ))}
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </CardContent>
      <Grid container justifyContent="center" alignItems="center">
        <AppButton onClick={() => history.push("/route")}>Cancel</AppButton>
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
