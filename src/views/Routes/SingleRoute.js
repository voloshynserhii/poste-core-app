import { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
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

import { AppContext } from "../../store";
import UpdateButton from "./components/UpdateButton";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../utils/form";
import AppAlert from "../../components/AppAlert";
import AppButton from "../../components/AppButton";

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

const SingleRouteView = () => {
  const history = useHistory();
  const params = useParams();
  const classes = orderForm();
  const [state, dispatch] = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ROUTE,
    });
  const [locationsArr, setLocationsArr] = useState([]);
  const [operationDays, setOperationDays] = useState([]);

  const values = formState.values;
  const id = params?.id;

  const fetchRouteById = useCallback(
    async (id) => {
      setLoading(true);
      setError("");
      try {
        const res = await state.routes.find((c) => c._id === id);
        console.log(res);
        if (res) {
          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              title: res?.title || "",
              status: res?.status || "",
              curier: res?.curier || null,
              type: res?.type || "",
              terminal: res?.terminal || "",
              latestCollectionTime: res?.latestCollectionTime || "",
              latestDeliveryTime: res?.latestDeliveryTime || "",
            },
          }));
          setLocationsArr(res.locations.map((loc) => loc._id));
          setOperationDays(res.operationDays || []);
        } else {
          setError(`Route id: "${id}" not found`);
        }
      } catch (error) {
        log.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [setFormState, state.routes]
  );

  useEffect(() => {
    fetchRouteById(id);
  }, [fetchRouteById, id]);

  const onAlertClose = useCallback(() => {
    setError("");
    history.replace("/route");
  }, [history]);

  const handleCancel = () => {
    history.replace("/route");
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

  const handleDelete = async (id) => {
    //show modal do you really want to delete order?

    history.replace("/route");
  };

  if (loading) return <LinearProgress />;

  return (
    <>
      {Boolean(error) && (
        <AppAlert severity="error" onClose={onAlertClose}>
          {error}
        </AppAlert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Route Details" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    label="Title"
                    name="title"
                    value={values?.title || ""}
                    error={fieldHasError("title")}
                    helperText={
                      fieldGetError("title") || "Display name of the route"
                    }
                    onChange={onFieldChange}
                    {...SHARED_CONTROL_PROPS}
                  />
                  <TextField
                    required
                    select
                    label="Type"
                    name="type"
                    value={values?.type || ""}
                    error={fieldHasError("type")}
                    helperText={
                      fieldGetError("type") || "Display type of the route"
                    }
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
                    value={values?.status || ""}
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
                    value={values?.curier || ""}
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
                              checked={
                                !!operationDays && operationDays.includes(day)
                              }
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
                    value={values?.latestCollectionTime || "12:00"}
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
                    value={values?.latestDeliveryTime || "12:00"}
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
                    value={values?.terminal?._id || values?.terminal || ""}
                    error={fieldHasError("terminal")}
                    helperText={
                      fieldGetError("terminal") ||
                      "Display terminal of the route"
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
                      <Typography className={classes.heading}>
                        Locations
                      </Typography>
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
                                  onChange={() =>
                                    handleAddLocation(location._id)
                                  }
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
              <Grid container justifycontent="center" alignItems="center">
                <AppButton onClick={handleCancel}>Cancel</AppButton>
                <UpdateButton
                  color="primary"
                  id={id}
                  payload={{
                    ...values,
                    locations: locationsArr,
                    operationDays,
                  }}
                >
                  Update route
                </UpdateButton>
                <AppButton color="error" onClick={() => handleDelete(id)}>
                  Delete route
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default SingleRouteView;
