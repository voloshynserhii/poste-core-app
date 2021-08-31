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
  company: {
    type: "string",
    presence: { allowEmpty: true },
  },
  name: {
    type: "string",
    presence: { allowEmpty: true },
  },
  phone: {
    type: "string",
    presence: { allowEmpty: false },
  },
  email: {
    type: "string",
    presence: { allowEmpty: false },
  },
  taxId: {
    type: "string",
    presence: { allowEmpty: false },
  },
  password: {
    type: "string",
    presence: { allowEmpty: true },
  },
  //   comments: {
  //     type: "string",
  //     presence: { allowEmpty: true },
  //   },
  //   description: {
  //     type: "string",
  //     presence: { allowEmpty: true },
  //   },
};

const RegisterCustomerForm = ({ onCancel }) => {
  const classes = orderForm();
  const [orderSaved, setOrderSaved] = useState(false);

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ORDER,
      initialValues: {},
    });
  const values = formState.values;

  const formOrder = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        company: "",
        name: "",
        email: "",
        password: "",
        // weight: "",
        // dimensions: "",
        // quantity: "",
        // description: "",
        // comments: "",
      },
    }));
  }, [setFormState]);
console.log(formState.values)
  useEffect(() => {
    formOrder();
  }, [formOrder]);

  const saveRecord = async () => {
    // save changes in BD
    await api.customers.create(formState.values);
    setOrderSaved(true);
  };
  const handleSave = () => {
    // Save without confirmation
    saveRecord();
    return;
  };

  if (orderSaved) return null;

  return (
    <div className={classes.layer}>
      <Card className={classes.root}>
        <CardHeader title="Register new customer" />
        <CardContent>
          <TextField
            required
            label="Name"
            name="name"
            value={values.name}
            error={fieldHasError("name")}
            helperText={fieldGetError("name") || "Display name of the customer"}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            label="Email"
            name="email"
            value={values.email}
            defaultValue={values.email}
            error={fieldHasError("email")}
            helperText={
              fieldGetError("email") || "Display email of the customer"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            label="Password"
            name="password"
            value={values.password}
            error={fieldHasError("password")}
            helperText={
              fieldGetError("password") || "Display password of the customer"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Phone"
            name="phone"
            value={values.phone}
            error={fieldHasError("phone")}
            helperText={
              fieldGetError("phone") || "Display phone of the customer"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Tax ID"
            name="taxId"
            value={values.taxId}
            error={fieldHasError("taxId")}
            helperText={
              fieldGetError("taxId") || "Display tax ID of the customer"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Company"
            name="company"
            value={values.company}
            error={fieldHasError("company")}
            helperText={
              fieldGetError("company") || "Display company name of the customer"
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
              Save Customer
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
export default RegisterCustomerForm;
