import { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  LinearProgress
} from "@material-ui/core";

import api from "../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../utils/form";
import AppAlert from "../../components/AppAlert";
import AppButton from "../../components/AppButton";
import UpdateButton from "./components/UpdateButton";


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

const SingleCustomerView = () => {
  const history = useHistory();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_ORDER,
    });
  const values = formState.values;
  const id = params?.id;

  const fetchCustomerById = useCallback(
    async (id) => {
      setLoading(true);
      setError("");
      try {
        const res = await api.customers.read(id);
        console.log(res);
        if (res) {
          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              name: res?.name || "",
              email: res?.email || "",
              phone: res?.phone || "Pending",
              company: res?.company || "",
              taxId: res?.taxId || "",
              updateDate: Date.now(),
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
    fetchCustomerById(id);
  }, [fetchCustomerById, id]);

  const onAlertClose = useCallback(() => {
    setError("");
    history.replace("/customer");
  }, [history]);

  const handleCancel = () => {
    history.replace("/customer");
  };

  const handleDelete = async (id) => {
    //show modal do you really want to delete order?
    const res = await api.customers.delete(id);
    if (res.status === 200) {
      history.replace("/customer");
      //show modal
    }
    alert(res.data.message);
  };


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
            <CardHeader title="Customer Details" />
            <CardContent>
              <TextField
                label="Name"
                name="name"
                value={values?.name}
                error={fieldHasError("name")}
                helperText={
                  fieldGetError("name") ||
                  "Display name of the Customer"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Email"
                name="email"
                value={values?.email}
                error={fieldHasError("email")}
                helperText={
                  fieldGetError("email") ||
                  "Display email of the Customer"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Pnone"
                name="phone"
                value={values?.phone}
                error={fieldHasError("phone")}
                helperText={
                  fieldGetError("phone") ||
                  "Display phone of the Customer"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Company"
                name="company"
                value={values?.company}
                error={fieldHasError("company")}
                helperText={
                  fieldGetError("company") ||
                  "Display company name of the Customer"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Tax ID"
                name="taxId"
                value={values?.taxId}
                error={fieldHasError("taxId")}
                helperText={
                  fieldGetError("taxId") || "Display tax Id of the Customer"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <Grid container justifycontent="center" alignItems="center">
                <AppButton onClick={handleCancel}>Cancel</AppButton>
                <UpdateButton
                  collection="customers"
                  color="primary"
                  id={id}
                  payload={values}
                >
                  Update customer
                </UpdateButton>
                <AppButton color="error" onClick={() => handleDelete(id)}>
                  Delete customer
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default SingleCustomerView;
