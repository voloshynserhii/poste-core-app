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
  weight: {
    type: "string",
    presence: { allowEmpty: false },
  },
  dimensions: {
    type: "string",
    presence: { allowEmpty: false },
  },
  declaredValue: {
    type: "string",
    presence: { allowEmpty: true },
  },
  status: {
    type: "string",
    presence: { allowEmpty: false },
  },
  comments: {
    type: "string",
    presence: { allowEmpty: true },
  },
  description: {
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
          console.log(res);
          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              trackingNumber: res?.trackingNumber || "",
              referenceNumber: res?.referenceNumber || "",
              status: res?.status || "Pending",
              declaredValue: res?.declaredValue || "",
              weight: res?.weight || "",
              dimensions: res?.dimensions || "",
              quantity: res?.quantity || "",
              description: res?.description || "",
              comments: res?.comments || "",
              updateDate: Date.now(),
              collectionData: {
                city: res?.collectionData?.city || "",
              },
              deliveryData: {
                city: res?.deliveryData?.city || "",
              },
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
  console.log(values);
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

  const handleDelete = async (id) => {
    //show modal do you really want to delete order?
    const res = await api.orders.delete(id);
    if (res.status === 200) {
      history.replace("/tracking");
      //show modal
    }
    alert(res.data.message);
  };
  
  const onFieldChangeCollection = useCallback((event) => {

    const name = event.target?.name;
    const value = event.target?.value

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        collectionData: {
          [name]: value
        }
      },
      touched: {
        ...formState.touched,
        [name]: true,
      },
    }));
  }, [setFormState]);
  
  const onFieldChangeDelivery = useCallback((event) => {

    const name = event.target?.name;
    const value = event.target?.value

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        deliveryData: {
          [name]: value
        }
      },
      touched: {
        ...formState.touched,
        [name]: true,
      },
    }));
  }, [setFormState]);

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
                value={values?.trackingNumber}
                error={fieldHasError("trackingNumber")}
                helperText={
                  fieldGetError("trackingNumber") ||
                  "Display order tracking number"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                disabled
                label="Reference number"
                name="referenceNumber"
                value={values?.referenceNumber}
                error={fieldHasError("referenceNumber")}
                helperText={
                  fieldGetError("referenceNumber") ||
                  "Display order reference number"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                select
                required
                label="Status"
                name="status"
                value={values?.status}
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
                value={values?.declaredValue}
                error={fieldHasError("declaredValue")}
                helperText={
                  fieldGetError("declaredValue") ||
                  "Display declared value of the Order"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                label="Weight"
                name="weight"
                value={values?.weight}
                error={fieldHasError("weight")}
                helperText={
                  fieldGetError("weight") || "Display weight of the order"
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
                label="Dimensions"
                name="dimensions"
                value={values?.dimensions}
                error={fieldHasError("dimensions")}
                helperText={
                  fieldGetError("dimensions") ||
                  "Display dimensions of the Order"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Quantity"
                name="quantity"
                value={values?.quantity}
                error={fieldHasError("quantity")}
                helperText={
                  fieldGetError("quantity") || "Display quantity of the Order"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Description"
                name="description"
                value={values?.description}
                error={fieldHasError("description")}
                helperText={
                  fieldGetError("description") ||
                  "Display description of the Order"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Comments"
                name="comments"
                value={values?.comments}
                error={fieldHasError("comments")}
                helperText={
                  fieldGetError("comments") || "Display comments of the Order"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <div>
                <h3>Collection Address</h3>
                <TextField
                  label="City"
                  name="city"
                  value={values?.collectionData?.city || ""}
                  error={fieldHasError("comments")}
                  helperText={
                    fieldGetError("city") || "Display city of the Order"
                  }
                  onChange={onFieldChangeCollection}
                  {...SHARED_CONTROL_PROPS}
                />
              </div>
              <div>
                <h3>Delivery Address</h3>
                <TextField
                  label="City"
                  name="city"
                  value={values?.deliveryData?.city || ""}
                  error={fieldHasError("comments")}
                  helperText={
                    fieldGetError("city") || "Display city of the Order"
                  }
                  onChange={onFieldChangeDelivery}
                  {...SHARED_CONTROL_PROPS}
                />
              </div>
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
                <AppButton color="error" onClick={() => handleDelete(id)}>
                  Delete order
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default SingleOrderView;
