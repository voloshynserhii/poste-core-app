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
    border: 'none'
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: "3%",
  },
}));

const VALIDATE_FORM_ADDRESS = {
  name: {
    type: "string",
    presence: { allowEmpty: false },
  },
  city: {
    type: "string",
    presence: { allowEmpty: false },
  },
  address1: {
    type: "string",
    presence: { allowEmpty: false },
  },
  contactPhone: {
    type: "string",
    presence: { allowEmpty: false },
  }
};

const RegisterCustomerForm = ({ onCancel, onAddAddress }) => {
  const classes = orderForm();

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ADDRESS,
      initialValues: {},
    });

  const formAddress = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
      },
    }));
  }, [setFormState]);

  console.log(formState);
  
  useEffect(() => {
    formAddress();
  }, [formAddress]);

  return (
    <>
      <CardHeader title="Add New Address" />
      <CardContent className={classes.grid}>
        <div>
          <TextField
            required
            label="Address name"
            name="title"
            error={fieldHasError("title")}
            helperText={
              fieldGetError("title") || "Display name of the Address object"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Region"
            name="region"
            error={fieldHasError("region")}
            helperText={fieldGetError("region") || "Display the region"}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            label="City"
            name="city"
            error={fieldHasError("city")}
            helperText={fieldGetError("city") || "Display the city"}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            label="Address"
            name="address1"
            error={fieldHasError("address1")}
            helperText={fieldGetError("address1") || "Display main address"}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
        </div>
        <div>
          <TextField
            label="Secondary dddress"
            name="address2"
            error={fieldHasError("address2")}
            helperText={
              fieldGetError("address2") || "Display secondary address"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Contact name"
            name="contactName"
            error={fieldHasError("contactName")}
            helperText={
              fieldGetError("contactName") || "Display contactName of the Order"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            label="Contact phone"
            name="contactPhone"
            error={fieldHasError("contactPhone")}
            helperText={
              fieldGetError("contactPhone") || "Display contact phone"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            label="Contact email"
            name="contactEmail"
            error={fieldHasError("contactEmail")}
            helperText={
              fieldGetError("contactEmail") || "Display contact Email"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
        </div>
      </CardContent>
        <AppButton
          color="light"
          disabled={!formState.isValid}
          onClick={onAddAddress}
        >
          Add address
        </AppButton>
    </>
  );
};
export default RegisterCustomerForm;
