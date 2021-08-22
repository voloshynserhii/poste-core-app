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
  
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ORDER,
      initialValues: {
        trackingNumber: "",
        referenceNumber: "",
        declaredValue: "",
        weight: "",
        dimensions: "",
        quantity: "",
        description: "",
        comments: "",
        collectionData: {
          city: "",
        },
        deliveryData: {
          city: "",
        },
      },
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
        trackingNumber: random(),
        referenceNumber: "",
        declaredValue: "",
        weight: "",
        dimensions: "",
        quantity: "",
        description: "",
        comments: "",
        collectionData: {
          city: "",
        },
        deliveryData: {
          city: "",
        },
      },
    }));
  }, [setFormState]);

  useEffect(() => {
    formOrder();
  }, [formOrder]);

  const saveRecord = async () => {
    // save changes in BD
    await api.orders.create('orders', formState.values);
    setOrderSaved(true);
  };
  const handleSave = () => {
    // Save without confirmation
    saveRecord();
    return;
  };

  if (orderSaved) return null;
  
  return (
    <div className={classes.layer} >
      <Card className={classes.root}>
        <CardHeader title="Add Order" />
        <CardContent>
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
