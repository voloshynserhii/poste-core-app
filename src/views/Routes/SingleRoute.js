import { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  LinearProgress,
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
  // dimensions: {
  //   type: "string",
  //   presence: { allowEmpty: false },
  // },
  // declaredValue: {
  //   type: "string",
  //   presence: { allowEmpty: true },
  // },
  // status: {
  //   type: "string",
  //   presence: { allowEmpty: false },
  // },
  // comments: {
  //   type: "string",
  //   presence: { allowEmpty: true },
  // },
  // description: {
  //   type: "string",
  //   presence: { allowEmpty: true },
  // },
};

const SingleRouteView = () => {
  const [state, ] = useContext(AppContext);
  const history = useHistory();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ROUTE,
    });
  const values = formState.values;
  const id = params?.id;
  
  const fetchRouteById = useCallback(
    async (id) => {
      setLoading(true);
      setError("");
      try {
        const res = await state.route.find(c => c._id === id);
        if (res) {
          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              title: res?.title || "",
              // email: res?.email || "",
              // phone: res?.phone || "Pending",
              // company: res?.company || "",
              // taxId: res?.taxId || "",
              // updateDate: Date.now()
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
    [setFormState, state.customers]
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
            <CardHeader title="Customer Details" />
            <CardContent>
              <TextField
                label="Name"
                name="name"
                value={values?.name}
                error={fieldHasError("name")}
                helperText={
                  fieldGetError("name") || "Display name of the Customer"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />

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
