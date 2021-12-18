import { useState, useEffect, useCallback, useContext } from "react";
import {
  makeStyles,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { AppContext } from "../../../store";
import api from "../../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../../utils/form";
import AppButton from "../../../components/AppButton";
import AppAlert from "../../../components/AppAlert";

const orderForm = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "20px 0 50px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: "3%",
  },
}));

const VALIDATE_FORM_ORDER = {
  weight: {
    type: "string",
    presence: { allowEmpty: false },
  },
  declaredValue: {
    type: "string",
    presence: { allowEmpty: true },
  },
};

const OrderForm = () => {
  const history = useHistory();
  const [state, dispatch] = useContext(AppContext);
  const classes = orderForm();
  const [orderSaved, setOrderSaved] = useState(false);
  const [foundCustomer, setFoundCustomer] = useState(null);

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ORDER,
      initialValues: {},
    });
  const values = formState.values;

  const random = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const formOrder = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        customer: {
          taxId: "",
        },
        trackingNumber: random(),
        referenceNumber: "",
        declaredValue: "",
        weight: "",
        dimensions: "",
        quantity: "",
        description: "",
        comments: "",
        collectionData: {
          region: null,
          city: null,
          point: null,
          address1: "",
          address2: "",
          contactName: "",
          contactPhone: "",
          contactEmail: "",
        },
        deliveryData: {
          region: null,
          city: null,
          point: null,
          address1: "",
          address2: "",
          contactName: "",
          contactPhone: "",
          contactEmail: "",
        },
      },
    }));
  }, [setFormState]);

  useEffect(() => {
    formOrder();
  }, [formOrder]);

  const saveRecord = async () => {
    if (foundCustomer) {
      const savedOrder = {
        ...formState.values,
        customer: foundCustomer._id,
      };
      // save changes in BD
      const res = await api.orders.create(savedOrder);
      const newOrder = res.data.data.order;
      if (res.status === 201) {
        dispatch({ type: "ADD_ORDER", payload: newOrder });
      }
      setOrderSaved(true);
    } else {
      return <AppAlert severity="No customer found in DB" />;
    }
  };
  const handleSave = () => {
    // Save without confirmation
    saveRecord();
    history.push("/tracking");
    return;
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

  const onFieldChangeCustomer = useCallback(
    (event) => {
      const name = event.target?.name;
      const value = event.target?.value;

      const existingCustomer = state?.customers?.find(
        (customer) => customer.taxId === value
      );
      if (existingCustomer) {
        setFoundCustomer(existingCustomer);
      }
      setFormState((formState) => ({
        ...formState,
        values: {
          ...formState.values,
          customer: {
            ...formState.values.customer,
            [name]: value,
          },
        },
        touched: {
          ...formState.touched,
          [name]: true,
        },
      }));
    },
    [setFormState, state?.customers]
  );

  const onAddressCollectionChange = useCallback(
    async (event) => {
      const name = event.target?.name;
      const value = event.target?.value;

      if (value === "new") {
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            collectionData: {
              region: null,
              city: null,
              point: null,
              address1: "",
              address2: "",
              contactName: "",
              contactPhone: "",
              contactEmail: "",
            },
          },
          touched: {
            ...formState.touched,
            [name]: false,
          },
        }));
      }
      const curAddress = await foundCustomer.addressList?.find(
        (address) => address._id === value
      );

      if (curAddress) {
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            collectionData: {
              region: curAddress?.region || null,
              city: curAddress?.city || null,
              point: curAddress?.point || null,
              address1: curAddress?.address1 || "",
              address2: curAddress?.address2 || "",
              contactName: curAddress?.contactName || "",
              contactPhone: curAddress?.contactPhone || "",
              contactEmail: curAddress?.contactEmail || "",
            },
          },
          touched: {
            ...formState.touched,
            [name]: true,
          },
        }));
      }
    },
    [setFormState, foundCustomer]
  );

  const onAddressDeliveryChange = useCallback(
    async (event) => {
      const name = event.target?.name;
      const value = event.target?.value;

      if (value === "new") {
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            deliveryData: {
              region: null,
              city: null,
              point: null,
              address1: "",
              address2: "",
              contactName: "",
              contactPhone: "",
              contactEmail: "",
            },
          },
          touched: {
            ...formState.touched,
            [name]: false,
          },
        }));
      }
      const curAddress = await foundCustomer.addressList?.find(
        (address) => address._id === value
      );

      if (curAddress) {
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            deliveryData: {
              region: curAddress?.region || null,
              city: curAddress?.city || null,
              point: curAddress?.point || null,
              address1: curAddress?.address1 || "",
              address2: curAddress?.address2 || "",
              contactName: curAddress?.contactName || "",
              contactPhone: curAddress?.contactPhone || "",
              contactEmail: curAddress?.contactEmail || "",
            },
          },
          touched: {
            ...formState.touched,
            [name]: true,
          },
        }));
      }
    },
    [setFormState, foundCustomer]
  );

  if (orderSaved) return null;

  return (
    <Card className={classes.root}>
      {!foundCustomer && (
        <AppAlert severity="error">No Customer found in DB</AppAlert>
      )}
      {foundCustomer && (
        <AppAlert severity="info">{`Customer ${foundCustomer.name} found`}</AppAlert>
      )}
      <CardHeader title="Add Order" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Customer TAX ID"
              name="taxId"
              value={values.customer?.taxId || ""}
              error={fieldHasError("taxId")}
              helperText={
                fieldGetError("taxId") || "Display tax ID of the Customer"
              }
              onChange={onFieldChangeCustomer}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              disabled
              label="Tracking number"
              name="trackingNumber"
              value={values.trackingNumber || ""}
              error={fieldHasError("referenceNumber")}
              helperText={
                fieldGetError("trackingNumber") ||
                "Display order tracking number"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              label="Reference number"
              name="referenceNumber"
              value={values.referenceNumber || ""}
              error={fieldHasError("referenceNumber")}
              helperText={
                fieldGetError("referenceNumber") ||
                "Display order reference number"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              label="Cash on delivery value"
              name="declaredValue"
              value={values?.declaredValue || ''}
              type="number"
              error={fieldHasError("declaredValue")}
              helperText={
                fieldGetError("declaredValue") ||
                "Declared value of the goods that should be charged on delivery"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Weight"
              name="weight"
              value={values?.weight || ""}
              type="number"
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
              value={values.dimensions || ""}
              error={fieldHasError("dimensions")}
              helperText={
                fieldGetError("dimensions") || "Display dimensions of the Order"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              label="Quantity"
              name="quantity"
              value={values?.quantity || ''}
              type="number"
              error={fieldHasError("quantity")}
              helperText={
                fieldGetError("quantity") || "Display quantity of the Order"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              type="textarea"
              multiline
              rows={1}
              maxRows={4}
              label="Description"
              name="description"
              value={values?.description || ''}
              // defaultValue={values.description}
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
              value={values?.comments || ''}
              // defaultValue={values.comments}
              error={fieldHasError("comments")}
              helperText={
                fieldGetError("comments") || "Display comments of the Order"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <h3>Collection Address</h3>
            <TextField
              select
              required
              label="Choose address"
              name="_id"
              defaultValue=""
              error={fieldHasError("_id")}
              helperText={
                fieldGetError("_id") || "Display the _id of a address"
              }
              onChange={onAddressCollectionChange}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="new">Add new address</MenuItem>
              {foundCustomer?.addressList?.map((option) => (
                <MenuItem key={option.title} value={option._id}>
                  {option.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              required
              label="Region"
              name="region"
              value={values?.collectionData?.region || ''}
              error={fieldHasError("region")}
              helperText={fieldGetError("region") || "Display the region"}
              onChange={onFieldChangeCollection}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="">---</MenuItem>
              {state.locations
                .filter((loc) => loc.type === "region")
                .map((location) => (
                  <MenuItem key={location._id} value={location._id}>{location.name}</MenuItem>
                ))}
            </TextField>
            <TextField
              select
              required
              label="City"
              name="city"
              value={values?.collectionData?.city || ''}
              error={fieldHasError("city")}
              helperText={fieldGetError("city") || "Display the city"}
              onChange={onFieldChangeCollection}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="">---</MenuItem>
              {state.locations
                .filter((loc) => loc.type === "city")
                .filter(
                  (loc) => loc.parent._id === values?.collectionData?.region
                )
                .map((location) => (
                  <MenuItem key={location._id} value={location._id}>{location.name}</MenuItem>
                ))}
            </TextField>
            <TextField
              select
              required
              label="End Point"
              name="point"
              value={values?.collectionData?.point || ''}
              error={fieldHasError("point")}
              helperText={
                fieldGetError("point") ||
                "Display a route point"
              }
              onChange={onFieldChangeCollection}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="">---</MenuItem>
              {state.locations
                .filter((loc) => loc.type === "point")
                .filter(
                  (loc) => loc.parent._id === values?.collectionData?.city
                )
                .map((location) => (
                  <MenuItem key={location._id} value={location._id}>{location.name}</MenuItem>
                ))}
            </TextField>
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
              label="Address secondary"
              name="address2"
              value={values?.collectionData?.address2 || ""}
              error={fieldHasError("address2")}
              helperText={
                fieldGetError("address2") ||
                "Display secondary address of the Order"
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
              type="number"
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <h3>Delivery Address</h3>
            <TextField
              select
              required
              label="Choose address"
              name="_id"
              defaultValue=""
              error={fieldHasError("_id")}
              helperText={
                fieldGetError("_id") || "Display the _id of a address"
              }
              onChange={onAddressDeliveryChange}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="new">Add new address</MenuItem>
              {foundCustomer?.addressList?.map((option) => (
                <MenuItem key={option.title} value={option._id}>
                  {option.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              required
              label="Region"
              name="region"
              value={values?.deliveryData?.region || ''}
              error={fieldHasError("region")}
              helperText={fieldGetError("region") || "Display the region"}
              onChange={onFieldChangeDelivery}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="">---</MenuItem>
              {state.locations
                .filter((loc) => loc.type === "region")
                .map((location) => (
                  <MenuItem key={location._id} value={location._id}>{location.name}</MenuItem>
                ))}
            </TextField>
            <TextField
              select
              required
              label="City"
              name="city"
              value={values?.deliveryData?.city || ''}
              error={fieldHasError("city")}
              helperText={fieldGetError("city") || "Display the city"}
              onChange={onFieldChangeDelivery}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="">---</MenuItem>
              {state.locations
                .filter((loc) => loc.type === "city")
                .filter(
                  (loc) => loc.parent._id === values?.deliveryData?.region
                )
                .map((location) => (
                  <MenuItem key={location._id} value={location._id}>{location.name}</MenuItem>
                ))}
            </TextField>
            <TextField
              select
              required
              label="End Point"
              name="point"
              value={values?.deliveryData?.point || ''}
              error={fieldHasError("point")}
              helperText={
                fieldGetError("point") ||
                "Display a route point"
              }
              onChange={onFieldChangeDelivery}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="">---</MenuItem>
              {state.locations
                .filter((loc) => loc.type === "point")
                .filter((loc) => loc.parent._id === values?.deliveryData?.city)
                .map((location) => (
                  <MenuItem key={location._id} value={location._id}>{location.name}</MenuItem>
                ))}
            </TextField>
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
              label="Address secondary"
              name="address2"
              value={values?.deliveryData?.address2 || ""}
              error={fieldHasError("address2")}
              helperText={
                fieldGetError("address2") ||
                "Display secondary address of the Order"
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
              type="number"
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
          </Grid>
        </Grid>
      </CardContent>
      <Grid container justifyContent="center" alignItems="center">
        <AppButton onClick={() => history.push('/tracking')}>Cancel</AppButton>
        <AppButton
          color="success"
          disabled={!formState.isValid}
          onClick={handleSave}
        >
          Save Order
        </AppButton>
      </Grid>
    </Card>
  );
};
export default OrderForm;
