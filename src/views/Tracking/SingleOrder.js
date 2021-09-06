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
  const [state] = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({});
  const [assignedCurier, setAssignedCurier] = useState({});
  const [, setDispatcher] = useState({});
  const [, setLastModifiedBy] = useState({});

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
        console.log(res);
        if (res) {
          setCustomer(res?.customer);
          setAssignedCurier(res?.assignedCurier);
          setDispatcher(res?.dispatcher);
          setLastModifiedBy(res?.lastModifiedBy);

          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              customer: {
                _id: res?.customer?._id || "",
              },
              assignedCurier: {
                _id: res?.assignedCurier?._id || "",
              },
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
                region: res?.collectionData?.region || "",
                city: res?.collectionData?.city || "",
                address1: res?.collectionData?.address1 || "",
                contactName: res?.collectionData?.contactName || "",
                contactPhone: res?.collectionData?.contactPhone || "",
                contactEmail: res?.collectionData?.contactEmail || "",
              },
              deliveryData: {
                region: res?.deliveryData?.region || "",
                city: res?.deliveryData?.city || "",
                address1: res?.deliveryData?.address1 || "",
                contactName: res?.deliveryData?.contactName || "",
                contactPhone: res?.deliveryData?.contactPhone || "",
                contactEmail: res?.deliveryData?.contactEmail || "",
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

  const onFieldChangeCollection = useCallback(
    (event) => {
      const name = event.target?.name;
      const value = event.target?.value;

      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          collectionData: {
            ...formState.values.collectionData,
            [name]: value,
          },
        },
        touched: {
          ...formState.touched,
          [name]: true,
        },
      }));
    },
    [setFormState]
  );

  const onFieldChangeDelivery = useCallback(
    (event) => {
      const name = event.target?.name;
      const value = event.target?.value;

      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          deliveryData: {
            ...formState.values.deliveryData,
            [name]: value,
          },
        },
        touched: {
          ...formState.touched,
          [name]: true,
        },
      }));
    },
    [setFormState]
  );

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
              {customer?.name ? (
                <TextField
                  disabled
                  label="Customer"
                  name="name"
                  value={customer?.name}
                  error={fieldHasError("name")}
                  helperText={
                    fieldGetError("name") || "Display the name of a customer"
                  }
                  {...SHARED_CONTROL_PROPS}
                />
              ) : (
                <TextField
                  select
                  required
                  label="Customer"
                  name="customer"
                  defaultValue=""
                  error={fieldHasError("customer")}
                  helperText={
                    fieldGetError("customer") ||
                    "Display the name of a customer"
                  }
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                >
                  {state.customers?.map((option) => (
                    <MenuItem key={option.name} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              <TextField
                select
                required
                label="Assigned Curier"
                name="assignedCurier"
                defaultValue={assignedCurier._id}
                error={fieldHasError("assignedCurier")}
                helperText={
                  fieldGetError("assignedCurier") ||
                  "Display the name of assigned curier"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              >
                {state.users?.filter(user => user.role === "curier").map((option) => (
                  <MenuItem key={option.name} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
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
                value={values?.status || ""}
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
              />
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
                  label="Region"
                  name="region"
                  value={values?.collectionData?.region || ""}
                  error={fieldHasError("region")}
                  helperText={
                    fieldGetError("region") || "Display region of the Order"
                  }
                  onChange={onFieldChangeCollection}
                  {...SHARED_CONTROL_PROPS}
                />
                <TextField
                  label="City"
                  name="city"
                  value={values?.collectionData?.city || ""}
                  error={fieldHasError("city")}
                  helperText={
                    fieldGetError("city") || "Display city of the Order"
                  }
                  onChange={onFieldChangeCollection}
                  {...SHARED_CONTROL_PROPS}
                />
                <TextField
                  label="Address"
                  name="address1"
                  value={values?.collectionData?.address1 || ""}
                  error={fieldHasError("address1")}
                  helperText={
                    fieldGetError("address1") || "Display address of the Order"
                  }
                  onChange={onFieldChangeCollection}
                  {...SHARED_CONTROL_PROPS}
                />
                <TextField
                  label="Contact name"
                  name="contactName"
                  value={values?.collectionData?.contactName || ""}
                  error={fieldHasError("contactName")}
                  helperText={
                    fieldGetError("contactName") ||
                    "Display contactName of the Order"
                  }
                  onChange={onFieldChangeCollection}
                  {...SHARED_CONTROL_PROPS}
                />
                <TextField
                  label="Contact phone"
                  name="contactPhone"
                  value={values?.collectionData?.contactPhone || ""}
                  error={fieldHasError("contactPhone")}
                  helperText={
                    fieldGetError("contactPhone") ||
                    "Display contactPhone of the Order"
                  }
                  onChange={onFieldChangeCollection}
                  {...SHARED_CONTROL_PROPS}
                />
                <TextField
                  label="Contact email"
                  name="contactEmail"
                  value={values?.collectionData?.contactEmail || ""}
                  error={fieldHasError("contactEmail")}
                  helperText={
                    fieldGetError("contactEmail") ||
                    "Display contactEmail of the Order"
                  }
                  onChange={onFieldChangeCollection}
                  {...SHARED_CONTROL_PROPS}
                />
              </div>
              <div>
                <h3>Delivery Address</h3>
                <TextField
                  label="Region"
                  name="region"
                  value={values?.deliveryData?.region || ""}
                  error={fieldHasError("region")}
                  helperText={
                    fieldGetError("region") || "Display region of the Order"
                  }
                  onChange={onFieldChangeDelivery}
                  {...SHARED_CONTROL_PROPS}
                />
                <TextField
                  label="City"
                  name="city"
                  value={values?.deliveryData?.city || ""}
                  error={fieldHasError("city")}
                  helperText={
                    fieldGetError("city") || "Display city of the Order"
                  }
                  onChange={onFieldChangeDelivery}
                  {...SHARED_CONTROL_PROPS}
                />
                <TextField
                  label="Address"
                  name="address1"
                  value={values?.deliveryData?.address1 || ""}
                  error={fieldHasError("address1")}
                  helperText={
                    fieldGetError("address1") || "Display address of the Order"
                  }
                  onChange={onFieldChangeDelivery}
                  {...SHARED_CONTROL_PROPS}
                />
                <TextField
                  label="Contact name"
                  name="contactName"
                  value={values?.deliveryData?.contactName || ""}
                  error={fieldHasError("contactName")}
                  helperText={
                    fieldGetError("contactName") ||
                    "Display contactName of the Order"
                  }
                  onChange={onFieldChangeDelivery}
                  {...SHARED_CONTROL_PROPS}
                />
                <TextField
                  label="Contact phone"
                  name="contactPhone"
                  value={values?.deliveryData?.contactPhone || ""}
                  error={fieldHasError("contactPhone")}
                  helperText={
                    fieldGetError("contactPhone") ||
                    "Display contactPhone of the Order"
                  }
                  onChange={onFieldChangeDelivery}
                  {...SHARED_CONTROL_PROPS}
                />
                <TextField
                  label="Contact email"
                  name="contactEmail"
                  value={values?.deliveryData?.contactEmail || ""}
                  error={fieldHasError("contactEmail")}
                  helperText={
                    fieldGetError("contactEmail") ||
                    "Display contactEmail of the Order"
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
