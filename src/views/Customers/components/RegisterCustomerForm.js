import { useState, useEffect, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  Grid,
  TextField,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";

import { AppContext } from "../../../store";
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
  const history = useHistory();
  const [state, dispatch] = useContext(AppContext);
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
    return;
  }, [setFormState]);

  useEffect(() => {
    formCustomer();
  }, [formCustomer]);

  const saveRecord = async () => {
    // save changes in BD
    try {
      const res = await api.customers.create({
        ...formState.values,
        addressList,
      });
      const newCustomer = res.data.data.customer;
      if (res.status === 201) {
        dispatch({ type: "ADD_CUSTOMER", payload: newCustomer });
      }
      history.push("/customer");
    } catch (err) {
      alert(
        "Something went wrong. Please try again with another email address"
      );
    }
  };

  const handleSave = () => {
    // Save without confirmation
    saveRecord();
    return;
  };

  const getAddressValues = (val) => {
    setAddressList((prev) => [...prev, val]);
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
              value={values.name || ""}
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
              value={values.email || ""}
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
              value={values.password || ""}
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
              value={values.phone || ""}
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
              value={values.taxId || ""}
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
              value={values.company || ""}
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
        <Typography variant="h4" component="h2" gutterBottom>
          Added addresses
        </Typography>
        <Grid container flex="true" spacing={3}>
          {addressList?.map((address, index) => (
            <Card key={address.title}>
              <CardContent>
                <Typography variant="h5" component="h2" color="secondary">
                  {address.title.toUpperCase()}
                </Typography>
                <Typography variant="h5" component="h6" color="primary">
                  Name: {address.contactName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  REGION:
                  {
                    state.locations.find((loc) => loc._id === address.region)
                      .name
                  }
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  CITY:
                  {state.locations.find((loc) => loc._id === address.city).name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  VILLAGE:
                  {
                    state.locations.find((loc) => loc._id === address.village)
                      .name
                  }
                </Typography>
                <Typography color="textSecondary">
                  ADDRESS1:{address.address1}
                </Typography>
                <Typography color="textSecondary">
                  PHONE:{address.contactPhone}
                </Typography>
                <Typography color="textSecondary">
                  EMAIL:{address.contactEmail}
                </Typography>
                <Typography variant="body2" component="p">
                  ADDRESS2:{address.address2 || "empty"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </CardContent>
      <AddressForm title="Add new address" onAddAddress={getAddressValues} />
      <Grid container justifyContent="center" alignItems="center">
        <AppButton onClick={() => history.push("/customer")}>Cancel</AppButton>
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
