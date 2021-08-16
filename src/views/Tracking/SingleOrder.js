import { useState, useEffect, useCallback } from "react";
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

import api from "../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../utils/form";
import AppAlert from "../../components/AppAlert";
import AppButton from "../../components/AppButton";
import UpdateButton from "./components/UpdateButton";

import { statuses } from "./utils";

const VALIDATE_FORM_ORDER = {
  trackingNumber: {
    type: "string",
    presence: { allowEmpty: false },
  },
  weight: {
    type: "string",
    presence: { allowEmpty: true },
  },
  declaredValue: {
    type: "string",
    presence: { allowEmpty: true },
  },
  collectionFrom: {
    type: "string",
    presence: { allowEmpty: false },
  },
  deliveryTo: {
    type: "string",
    presence: { allowEmpty: false },
  },
  status: {
    type: "string",
    presence: { allowEmpty: false },
  },
  submittedBy: {
    type: "string",
    presence: { allowEmpty: false },
  },
  assignedCurier: {
    type: "string",
    presence: { allowEmpty: true },
  },
};

const SingleOrderView = () => {
  const history = useHistory();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ORDER,
    });
  const values = formState.values;
  const id = params?.id;

  const fetchOrderById = useCallback(
    async (id) => {
      setLoading(true);
      setError("");
      try {
        const res = await api.orders.read(id);
        if (res) {
          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              trackingNumber: res?.trackingNumber || "",
              weight: res?.weight || "0",
              status: res?.status || "Pending",
              declaredValue: res?.declaredValue || "",
            },
          }));
        } else {
          setError(`Order id: "${id}" not found`);
        }
      } catch (error) {
        log.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [setFormState]
  ); // Don't pass formState here !!!

  useEffect(() => {
    fetchOrderById(id);
  }, [fetchOrderById, id]);

  const onAlertClose = useCallback(() => {
    setError("");
    history.replace("/tracking");
  }, [history]);

  const handleCancel = () => {
    history.replace("/tracking");
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
        <Grid item xs={12} sm={9}>
          <Card>
            <CardHeader title="Order Details" />
            <CardContent>
              <TextField
                disabled
                label="Tracking number"
                name="trackingNumber"
                value={values.trackingNumber}
                error={fieldHasError("trackingNumber")}
                helperText={
                  fieldGetError("trackingNumber") ||
                  "Display order tracking number"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                label="Weight"
                name="weight"
                value={values.weight}
                error={fieldHasError("weight")}
                helperText={
                  fieldGetError("weight") || "Display weight of the order"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                select
                required
                label="Status"
                name="status"
                value={values.status}
                defaultValue={values.status}
                error={fieldHasError("status")}
                helperText={
                  fieldGetError("status") || "Display status of the Order"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              >
                {statuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Declared Value"
                name="declaredValue"
                value={values.declaredValue}
                defaultValue={values.declaredValue}
                error={fieldHasError("declaredValue")}
                helperText={
                  fieldGetError("declaredValue") ||
                  "Display declared value of the Order"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <Grid container justifycontent="center" alignItems="center">
                <AppButton onClick={handleCancel}>Cancel</AppButton>
                <UpdateButton
                  collection="orders"
                  color="primary"
                  id={id}
                  payload={values}
                >
                  Update order
                </UpdateButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default SingleOrderView;
