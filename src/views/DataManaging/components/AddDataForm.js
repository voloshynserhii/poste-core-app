import { useState, useEffect, useCallback, useContext } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  makeStyles,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  FormControlLabel,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { AppContext } from "../../../store";
import api from "../../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../../utils/form";
import AppButton from "../../../components/AppButton";
import AppAlert from "../../../components/AppAlert";

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
    padding: 10,
  },
  selects: {
    width: "45%",
    height: 30,
    border: "none",
  },
}));

const VALIDATE_FORM_LOCATION = {
  name: {
    type: "string",
    presence: { allowEmpty: false },
  },
};

const AddDataForm = ({ onCancel, id, title, onSave }) => {
  const [state, dispatch] = useContext(AppContext);
  const classes = userForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationSaved, setLocationSaved] = useState(false);
  const [locationType, setLocationType] = useState("region");
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState();
  const [region, setRegion] = useState();
  const [parent, setParent] = useState();
  const [routesArr, setRoutesArr] = useState([]);

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
        code: "",
      },
    }));
  }, [setFormState]);

  const fetchLocationById = useCallback(
    async (id) => {
      setLoading(true);
      setError("");
      try {
        const res = await state.locations.find(
          (location) => location._id === id
        );
        console.log(res)
        if (res) {
          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              name: res?.name || "",
              nameGE: res?.nameGE || "",
              code: res?.code || "",
            },
          }));
          setLocationType(res?.type || "region");
          setParent(res?.parent?._id);
          if (res?.type === "city") setRegion(res?.parent?._id)
          if (res?.type === "village") {
            setCity(res?.parent?._id)
            setRegion(res?.parent?.parent)
          }
        } else {
          setError(`Location id: "${id}" not found`);
        }
      } catch (error) {
        log.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [setFormState, state.locations]
  );

  useEffect(() => {
    fetchLocationById(id);
  }, [fetchLocationById, id]);

  useEffect(() => {
    formLocation();
  }, [formLocation]);

  useEffect(() => {
    if (locationType !== "region") {
      const regions = state.locations.filter((loc) => loc.type === "region");
      setRegions(regions);
      setParent(region);
    }

    if (locationType === "village") {
      const cities = state.locations.filter((loc) => loc.type === "city");
      setCities(cities);
      setParent(city);
    }
  }, [locationType, state.locations, city, region]);

  const saveRecord = async () => {
    const newLocation = {
      ...formState.values,
      type: locationType,
      parent: parent,
    };
    try {
      if (!id) {
        // save changes in BD
        const res = await api.locations.create(newLocation);
        const savedLocation = res.data;
        if (res.status === 200) {
          dispatch({ type: "ADD_LOCATION", payload: savedLocation });
          setLocationSaved(true);
          onSave(true);
        }
      } else {
        // update changes in BD
        const res = await api.locations.update(id, newLocation);
        const updatedLocation = res.data;
        if (res.status === 200) {
          dispatch({ type: "UPDATE_LOCATION", payload: updatedLocation });
          setLocationSaved(true);
          onSave(true);
        }
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

  const onAlertClose = useCallback(() => {
    setError("");
  }, []);

  const handleAddRoute = (id) => {
    if (routesArr.includes(id)) {
      const newArr = routesArr.filter((route) => route !== id);
      setRoutesArr(newArr);
    } else {
      setRoutesArr((prev) => [...prev, id]);
    }
  };

  if (locationSaved) return null;
  if (loading) return <LinearProgress />;

  return (
    <>
      {Boolean(error) && (
        <AppAlert severity="error" onClose={onAlertClose}>
          {error}
        </AppAlert>
      )}
      <div className={classes.layer}>
        <Card className={classes.root}>
          <CardHeader title={title} />
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

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Routes</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {!!state.routes &&
                  state.routes.map((route) => (
                    <FormControlLabel
                      key={route._id}
                      control={
                        <Checkbox
                          checked={routesArr.includes(route._id)}
                          onChange={() => handleAddRoute(route._id)}
                          name={route.title}
                          color="primary"
                        />
                      }
                      label={route.title}
                    />
                  ))}
              </AccordionDetails>
            </Accordion>
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
                  label="Point"
                />
              </Grid>
              <Grid item sm={7} className={classes.selectContainer}>
                {locationType !== "region" && (
                  <select
                    className={classes.selects}
                    value={region}
                    onChange={(event) => setRegion(event.target.value)}
                  >
                    Regions
                    <option value="">Choose region</option>
                    
                    {regions.map((region) => (
                      <option key={region._id} value={region._id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                )}
                {locationType === "village" && (
                  <select
                    className={classes.selects}
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                  >
                    Cities
                    <option value="">Choose city</option>
                    {cities
                      .filter((c) => c.parent._id === region)
                      .map((city) => (
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
                {id ? "Update" : "Save"}
              </AppButton>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
export default AddDataForm;
