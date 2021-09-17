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
import AddressForm from "./AddressForm";

const orderForm = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "20px 0 50px 0",
  },
}));

const VALIDATE_FORM_CUSTOMER = {
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
};

const RegisterCustomerForm = ({ onCancel }) => {
  const classes = orderForm();
  const [addressList, setAddressList] = useState([]);

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_CUSTOMER,
      initialValues: {},
    });
  const values = formState.values;

  const formCustomer = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        company: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        taxId: "",
      },
    }));
  }, [setFormState]);

  useEffect(() => {
    formCustomer();
  }, [formCustomer]);

  const saveRecord = async () => {
    // save changes in BD
    await api.customers.create(formState.values);
  };

  const handleSave = () => {
    // Save without confirmation
    saveRecord();
    return;
  };

  const getAddressValues = (val) => {
    setAddressList(prev => ([...prev, val]));
  };

  return (
    <Card className={classes.root}>
      <CardHeader title="Register new customer" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Name"
              name="name"
              value={values.name}
              error={fieldHasError("name")}
              helperText={
                fieldGetError("name") || "Display name of the customer"
              }
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
          </Grid>
          <Grid item xs={12} sm={6}>
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
                fieldGetError("company") ||
                "Display company name of the customer"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardContent>
        <h3>Added addresses</h3>
        <Grid container flex="true" spacing={3}>
        {addressList.map((address, index) => (
          <Grid item key={address.address1}>
            <div>TITLE:{address.title}</div>
            <div>REGION:{address.region}</div>
            <div>CITY:{address.city}</div>
            <div>ADDRESS1:{address.address1}</div>
            <div>PHONE:{address.contactPhone}</div>
            <div>EMAIL:{address.contactEmail}</div>
            <div>CONTACT NAME{address.contactName}</div>
          </Grid>
        ))}
        </Grid>
      </CardContent>

      <AddressForm title="Add new address" onAddAddress={getAddressValues} />
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
    </Card>
  );
};
export default RegisterCustomerForm;
