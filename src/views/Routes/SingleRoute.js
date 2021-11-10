import { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  LinearProgress,
  MenuItem,
} from "@material-ui/core";

import { AppContext } from "../../store";
// import api from "../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../utils/form";
import AppAlert from "../../components/AppAlert";
import AppButton from "../../components/AppButton";

const VALIDATE_FORM_ROUTE = {
  title: {
    type: "string",
    presence: { allowEmpty: false },
  },
};

const SingleRouteView = () => {
  const history = useHistory();
  const params = useParams();
  const [state, dispatch] = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ROUTE,
    });

  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [villages, setVillages] = useState([]);

  const values = formState.values;
  const id = params?.id;

  useEffect(() => {
    const regions = state.locations.filter(
      (location) => location.type === "region"
    );
    const cities = state.locations.filter(
      (location) => location.type === "city"
    );
    const villages = state.locations.filter(
      (location) => location.type === "village"
    );
    setRegions(regions);
    setCities(cities);
    setVillages(villages);
  }, [state.locations]);

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
            },
          }));
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
  ); // Don't pass formState here !!!

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
                    value={values.title}
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
                    defaultValue={values.type}
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
                    {cities.map((region) => (
                      <MenuItem value={region.name} key={region.name}>
                        {region.name}
                      </MenuItem>
                    ))}
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
                    {cities.map((region) => (
                      <MenuItem value={region.name} key={region.name}>
                        {region.name}
                      </MenuItem>
                    ))}
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
                    {regions.map((region) => (
                      <MenuItem value={region.name} key={region.name}>
                        {region.name}
                      </MenuItem>
                    ))}
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
              <Grid container justifycontent="center" alignItems="center">
                <AppButton onClick={handleCancel}>Cancel</AppButton>
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
