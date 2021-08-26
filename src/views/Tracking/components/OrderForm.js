import { useState, useEffect, useCallback } from "react";
import {
  makeStyles,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";

import api from "../../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../../utils/form";
import AppButton from "../../../components/AppButton";

const orderForm = makeStyles((theme) => ({
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
}));

const VALIDATE_FORM_ORDER = {
  referenceNumber: {
    type: "string",
    presence: { allowEmpty: true },
  },
  weight: {
    type: "string",
    presence: { allowEmpty: true },
  },
  dimensions: {
    type: "string",
    presence: { allowEmpty: false },
  },
  declaredValue: {
    type: "string",
    presence: { allowEmpty: true },
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

const OrderForm = ({ onCancel }) => {
  const classes = orderForm();
  const [orderSaved, setOrderSaved] = useState(false);
  const [customer, setCustomer] = useState({taxNumber: '65363747'});

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
        customer: customer,
        trackingNumber: random(),
        referenceNumber: "",
        declaredValue: "",
        weight: "",
        dimensions: "",
        quantity: "",
        description: "",
        comments: "",
        collectionData: {
          region: "",
          city: "",
          address1: "",
          contactName: "",
          contactPhone: "",
          contactEmail: "",
        },
        deliveryData: {
          region: "",
          city: "",
          address1: "",
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
    // save changes in BD
    await api.orders.create("orders", formState.values);
    setOrderSaved(true);
  };
  const handleSave = () => {
    // Save without confirmation
    saveRecord();
    return;
  };
  
  const onFieldChangeCollection = useCallback(
    (event) => {
      const name = event.target?.name;
      const value = event.target?.value;
      console.log(name, value);

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
  
  // const onFieldChangeCustomer = useCallback(
  //   (event) => {
  //     const name = event.target?.name;
  //     const value = event.target?.value;

  //     setFormState((formState) => ({
  //       ...formState,
  //       values: {
  //         ...formState.values,
  //         customer: {
  //           ...formState.values.customer,
  //           [name]: value,
  //         },
  //       },
  //       touched: {
  //         ...formState.touched,
  //         [name]: true,
  //       },
  //     }));
  //   },
  //   [setFormState]
  // );

  if (orderSaved) return null;

  return (
    <div className={classes.layer}>
      <Card className={classes.root}>
        <CardHeader title="Add Order" />
        <CardContent>
          <TextField
              label="Customer TAX number"
              name="taxNumber"
              value={customer?.taxNumber || ""}
              error={fieldHasError("taxNumber")}
              helperText={
                fieldGetError("taxNumber") || "Display tax number of the Customer"
              }
              // onChange={onFieldChangeCustomer}
              {...SHARED_CONTROL_PROPS}
            />
          <TextField
            disabled
            label="Tracking number"
            name="trackingNumber"
            value={values.trackingNumber}
            error={fieldHasError("referenceNumber")}
            helperText={
              fieldGetError("trackingNumber") || "Display order tracking number"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Reference number"
            name="referenceNumber"
            value={values.referenceNumber}
            error={fieldHasError("referenceNumber")}
            helperText={
              fieldGetError("referenceNumber") ||
              "Display order reference number"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
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
            required
            label="Dimensions"
            name="dimensions"
            value={values.dimensions}
            defaultValue={values.dimensions}
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
            value={values.quantity}
            defaultValue={values.quantity}
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
            value={values.description}
            defaultValue={values.description}
            error={fieldHasError("description")}
            helperText={
              fieldGetError("description") || "Display description of the Order"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Comments"
            name="comments"
            value={values.comments}
            defaultValue={values.comments}
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
              helperText={fieldGetError("city") || "Display city of the Order"}
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
              helperText={fieldGetError("city") || "Display city of the Order"}
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
          <Grid container justifyContent="center" alignItems="center">
            <AppButton onClick={onCancel}>Cancel</AppButton>
            <AppButton
              color="success"
              disabled={!formState.isValid}
              onClick={handleSave}
            >
              Save Order
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
export default OrderForm;
