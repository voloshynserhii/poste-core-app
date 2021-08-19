import { useEffect, useCallback } from "react";
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";

import { useAppForm, SHARED_CONTROL_PROPS } from "../../../utils/form";
import SaveButton from "./SaveButton";
import AppButton from "../../../components/AppButton";

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
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ORDER,
      initialValues: { weight: "" },
    });
  const values = formState.values;

  const formOrder = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={9}>
        <Card>
          <CardHeader title="Add Order" />
          <CardContent>
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
                fieldGetError("description") ||
                "Display description of the Order"
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
              <SaveButton
                collection="orders"
                disabled={!formState.isValid}
                payload={formState.values}
              >
                Save Order
              </SaveButton>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
export default OrderForm;
