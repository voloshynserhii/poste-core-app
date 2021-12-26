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
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
}));

const VALIDATE_FORM_ROUTE = {
  title: {
    type: "string",
    presence: { allowEmpty: false },
  },
};

const OPERATION_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const RegisterRouteForm = ({ orders = [], onCancel }) => {
  const history = useHistory();
  const [state, dispatch] = useContext(AppContext);
  const classes = orderForm();
  const [locationsArr, setLocationsArr] = useState([]);
  const [operationDays, setOperationDays] = useState([]);
  const [newOrders, setNewOrders] = useState([]);

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
        latestCollectionTime: "12:00",
        latestDeliveryTime: "12:00",
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
        operationDays,
        orders: orders
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

  const handleOperationDays = (day) => {
    if (!operationDays.includes(day)) {
      setOperationDays((prev) => [...prev, day]);
    } else {
      const filteredOperationDays = operationDays.filter((op) => op !== day);
      setOperationDays(filteredOperationDays);
    }
  };

  const handleAddLocation = (id) => {
    if (locationsArr.includes(id)) {
      const newArr = locationsArr.filter((location) => location !== id);
      setLocationsArr(newArr);
    } else {
      setLocationsArr((prev) => [...prev, id]);
    }
  };
  
  useEffect(() => {
    orders.forEach((id) => {
      const res = state.orders.find((order) => order._id === id)
      setNewOrders((prev) => [...prev, res])
    })
  }, [orders, state.orders])
  console.log(newOrders)


  return (
    <Card className={classes.root}>
      <CardHeader title={`Add new route ${!!newOrders ? `for ${newOrders.map(order => order.trackingNumber)}` : ''}`} />
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
            <TextField
              select
              required
              label="Curier"
              name="curier"
              defaultValue=""
              error={fieldHasError("curier")}
              helperText={
                fieldGetError("curier") || "Display the name of a curier"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            >
              {state.users?.map((option) => (
                <MenuItem key={option.name} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Operation days
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.grid}>
                {OPERATION_DAYS.map((day) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={!!operationDays && operationDays.includes(day)}
                        onChange={() => handleOperationDays(day)}
                        name={day}
                        color="primary"
                      />
                    }
                    label={day}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="latestCollectionTime"
              label="Latest collection time"
              name="latestCollectionTime"
              type="time"
              defaultValue="12:00"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              error={fieldHasError("latestCollectionTime")}
              helperText={
                fieldGetError("latestCollectionTime") ||
                "Display latest collection time of the route"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              id="latestDeliveryTime"
              label="Latest delivery time"
              name="latestDeliveryTime"
              type="time"
              defaultValue="12:00"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              error={fieldHasError("latestDeliveryTime")}
              helperText={
                fieldGetError("latestDeliveryTime") ||
                "Display latest delivery time of the route"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
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
                    .filter((loc) => {
                      if(values?.terminal?.hasOwnProperty('_id')) {
                        return loc?.terminalCity?._id === values?.terminal?._id
                      } else {
                        return loc?.terminalCity?._id === values?.terminal
                      }
                    })
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
        <AppButton onClick={!!onCancel ? onCancel : () => history.push("/route")}>Cancel</AppButton>
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
