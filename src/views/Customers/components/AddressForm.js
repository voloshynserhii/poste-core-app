import { useState, useEffect, useCallback, useContext } from "react";
import {
  TextField,
  CardHeader,
  CardContent,
  Grid,
  MenuItem,
} from "@material-ui/core";

import api from "../../../api";
import { AppContext } from "../../../store";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../../utils/form";
import AppButton from "../../../components/AppButton";

const VALIDATE_FORM_ADDRESS = {
  title: {
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
  },
};

const RegisterCustomerForm = (props) => {
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ADDRESS,
      initialValues: {},
    });
  const [state] = useContext(AppContext);
  const [currentCustomer, setCurrentCustomer] = useState();
  const [addressList, setAddressList] = useState();
  const [updatedAddressID, setUpdatedAddressID] = useState("");
  const values = formState.values;

  const findCustomerAddress = useCallback(
    async (id) => {
      const curCustomer = await state.customers?.find((c) => c._id === id);
      setCurrentCustomer(curCustomer);
      if (curCustomer) {
        const addressArr = curCustomer.addressList;
        setAddressList(addressArr);
      }
    },
    [state.customers]
  );

  const formAddress = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
      },
    }));
  }, [setFormState]);

  useEffect(() => {
    findCustomerAddress(props.customerId);
    formAddress();
  }, [formAddress, findCustomerAddress, props.customerId]);

  console.log(values);
  const onAddressChange = useCallback(
    async (event) => {
      const name = event.target?.name;
      const value = event.target?.value;

      if (value === "new") {
        setUpdatedAddressID("");
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            title: "",
            region: "",
            city: "",
            address1: "",
            address2: "",
            contactName: "",
            contactPhone: "",
            contactEmail: "",
          },
          touched: {
            ...formState.touched,
            [name]: false,
          },
        }));
      }
      const curAddress = await addressList?.find(
        (address) => address._id === value
      );

      if (curAddress) {
        setUpdatedAddressID(curAddress._id);
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            title: curAddress?.title || "",
            region: curAddress?.region || "",
            city: curAddress?.city || "",
            address1: curAddress?.address1 || "",
            address2: curAddress?.address2 || "",
            contactName: curAddress?.contactName || "",
            contactPhone: curAddress?.contactPhone || "",
            contactEmail: curAddress?.contactEmail || "",
          },
          touched: {
            ...formState.touched,
            [name]: true,
          },
        }));
      }
    },
    [setFormState, addressList]
  );

  const handleDeleteAddress = useCallback(async () => {
    const curAddress = addressList.find(
      (address) => address._id === updatedAddressID
    );
    const index = addressList.indexOf(curAddress);
    addressList.splice(index, 1);
    try {
      await api.customers.update(props.customerId, {
        addressList: addressList,
      });
      alert("Address deleted");
    } catch (error) {
      alert(error.message);
    }
  }, [addressList, props.customerId, updatedAddressID]);

  return (
    <>
      <CardHeader title={props.title} />
      <CardContent>
        <Grid container spacing={2}>
          <TextField
            select
            required
            label="Choose address"
            name="_id"
            defaultValue=""
            error={fieldHasError("_id")}
            helperText={fieldGetError("_id") || "Display the _id of a address"}
            onChange={onAddressChange}
            {...SHARED_CONTROL_PROPS}
          >
            <MenuItem value="">---</MenuItem>
            <MenuItem value="new">Add new address</MenuItem>
            {currentCustomer?.addressList?.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.title}
              </MenuItem>
            ))}
          </TextField>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Address name"
              name="title"
              value={values?.title || ""}
              error={fieldHasError("title")}
              helperText={
                fieldGetError("title") || "Display name of the Address object"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              select
              required
              label="Region"
              name="region"
              value={values?.region || ""}
              error={fieldHasError("region")}
              helperText={fieldGetError("region") || "Display the region"}
              onChange={onFieldChange}
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
              value={values?.city || ""}
              error={fieldHasError("city")}
              helperText={fieldGetError("city") || "Display the city"}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="">---</MenuItem>
              {state.locations
                .filter((loc) => loc.type === "city")
                .filter((loc) => loc.parent._id === values.region)
                .map((location) => (
                  <MenuItem key={location._id} value={location._id}>{location.name}</MenuItem>
                ))}
            </TextField>
            <TextField
              select
              required
              label="End Point"
              name="point"
              value={values?.point || ""}
              error={fieldHasError("point")}
              helperText={
                fieldGetError("point") ||
                "Display a point or a district in a city"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            >
              <MenuItem value="">---</MenuItem>
              {state.locations
                .filter((loc) => loc.type === "point")
                .filter((loc) => loc.parent._id === values.city)
                .map((location) => (
                  <MenuItem key={location._id} value={location._id}>{location.name}</MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Address"
              name="address1"
              value={values?.address1 || ""}
              error={fieldHasError("address1")}
              helperText={fieldGetError("address1") || "Display main address"}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              label="Secondary address"
              name="address2"
              value={values?.address2 || ""}
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
              value={values?.contactName || ""}
              error={fieldHasError("contactName")}
              helperText={
                fieldGetError("contactName") ||
                "Display contact name of the person responsible for the order"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              type="number"
              required
              label="Contact phone"
              name="contactPhone"
              value={values?.contactPhone || ""}
              error={fieldHasError("contactPhone")}
              helperText={
                fieldGetError("contactPhone") ||
                "Display contact phone of the contact person"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              label="Contact email"
              name="contactEmail"
              value={values?.contactEmail || ""}
              error={fieldHasError("contactEmail")}
              helperText={
                fieldGetError("contactEmail") ||
                "Display contact Email of the contact person"
              }
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
          </Grid>
        </Grid>
      </CardContent>
      {updatedAddressID !== "" ? (
        <AppButton
          color="error"
          disabled={!formState.isValid}
          onClick={handleDeleteAddress}
        >
          Delete address
        </AppButton>
      ) : (
        <AppButton
          color="light"
          disabled={!formState.isValid}
          onClick={() => props.onAddAddress(formState.values)}
        >
          Add address
        </AppButton>
      )}
    </>
  );
};
export default RegisterCustomerForm;
