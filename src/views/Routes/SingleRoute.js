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

  const values = formState.values;
  const id = params?.id;

  const fetchRouteById = useCallback(
    async (id) => {
      setLoading(true);
      setError("");
      try {
        const res = await state.routes.find((c) => c._id === id);
        if (res) {
          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              title: res?.title || "",
              status: res?.status || "",
              type: res?.type || "",
              region: res?.region || "",
              startPlace: res?.startPlace || "",
              finishPlace: res?.finishPlace || "",
            },
          }));
          setLocationsArr(res.locations.map((loc) => loc._id));
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
                    value={values.title || ""}
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
                    value={values.type || ""}
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
                    label="Region"
                    name="region"
                    value={!!values.region ? values.region._id : ""}
                    error={fieldHasError("region")}
                    helperText={
                      fieldGetError("region") || "Display region of the route"
                    }
                    onChange={onFieldChange}
                    {...SHARED_CONTROL_PROPS}
                  >
                    {!!state.locations &&
                      state.locations
                        .filter((loc) => loc.type === "region")
                        .map((location) => (
                          <MenuItem value={location._id} key={location._id}>
                            {location.name}
                          </MenuItem>
                        ))}
                  </TextField>
                  <TextField
                    select
                    label="Start place"
                    name="startPlace"
                    value={!!values.startPlace ? values.startPlace._id : ""}
                    error={fieldHasError("startPlace")}
                    helperText={
                      fieldGetError("startPlace") ||
                      "Display start place of the route"
                    }
                    onChange={onFieldChange}
                    {...SHARED_CONTROL_PROPS}
                  >
                    {!!state.locations &&
                      state.locations
                        .filter((loc) => loc.type === "city")
                        .map((location) => (
                          <MenuItem value={location._id} key={location._id}>
                            {location.name}
                          </MenuItem>
                        ))}
                  </TextField>
                  <TextField
                    select
                    label="Finish place"
                    name="finishPlace"
                    value={!!values.finishPlace ? values.finishPlace._id : ""}
                    error={fieldHasError("finishPlace")}
                    helperText={
                      fieldGetError("finishPlace") ||
                      "Display finish place of the route"
                    }
                    onChange={onFieldChange}
                    {...SHARED_CONTROL_PROPS}
                  >
                    {!!state.locations &&
                      state.locations
                        .filter((loc) => loc.type === "city")
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
                  payload={{ ...values, locations: locationsArr }}
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
