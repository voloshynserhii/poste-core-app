import { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  LinearProgress,
} from "@material-ui/core";

import { AppContext } from "../../store";
import api from "../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../utils/form";
import AppAlert from "../../components/AppAlert";
import AppButton from "../../components/AppButton";
import UpdateButton from "./components/UpdateButton";

const VALIDATE_FORM_USER = {
  name: {
    type: "string",
    presence: { allowEmpty: false },
  },
  email: {
    type: "string",
    presence: { allowEmpty: false },
  },
  phone: {
    type: "string",
    presence: { allowEmpty: true },
  },
};

const SingleUserView = () => {
  const [, dispatch] = useContext(AppContext);
  const history = useHistory();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_USER,
    });
  const values = formState.values;
  const id = params?.id;

  const fetchUserById = useCallback(
    async (id) => {
      setLoading(true);
      setError("");
      try {
        const res = await api.users.read(id);
        if (res) {
          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              name: res?.name || "",
              email: res?.email || "",
              phone: res?.phone || "",
              password: "",
              confirmPassword: "",
            },
          }));
          setRole(res?.role || '')
          setIsAvailable(res?.isAvailable)
          console.log(res);
        } else {
          setError(`User id: "${id}" not found`);
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
    fetchUserById(id);
  }, [fetchUserById, id]);

  const onAlertClose = useCallback(() => {
    setError("");
    history.replace("/user");
  }, [history]);

  const handleCancel = () => {
    history.replace("/user");
  };

  const handleDelete = async (id) => {
    //show modal do you really want to delete user?
    const res = await api.users.delete(id);
    if (res.status === 200) {
      dispatch({ type: "DELETE_USER", payload: id });
      history.replace("/user");
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
            <CardHeader title={`${role?.toUpperCase()} DETAILS`} />
            <CardContent>
              <TextField
                label="Name"
                name="name"
                value={values?.name}
                error={fieldHasError("name")}
                helperText={fieldGetError("name") || "Display name of the User"}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                disabled
                label="Email"
                name="email"
                value={values?.email}
                error={fieldHasError("email")}
                helperText={
                  fieldGetError("email") || "Display email of the User"
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
                  fieldGetError("phone") || "Display phone of the User"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="New password"
                name="password"
                value={values?.password}
                error={fieldHasError("password")}
                helperText={
                  fieldGetError("password") ||
                  "Provide a new password of the user"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Confirm password"
                name="confirmPassword"
                value={values?.confirmPassword}
                error={fieldHasError("confirmPassword")}
                helperText={
                  fieldGetError("confirmPassword") ||
                  "Confirm a new password of the user"
                }
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <Grid container>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={role === "curier"}
                      onChange={() => setRole('curier')}
                      name="curier"
                    />
                  }
                  label="Curier"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={role === 'dispatcher'}
                      onChange={() => setRole('dispatcher')}
                      name="dispatcher"
                    />
                  }
                  label="Dispatcher"
                />
                <Grid item xs={6} sm={6} style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isAvailable}
                        onChange={() => setIsAvailable(prev => !prev)}
                        name="isAvailable"
                      />
                    }
                    label={"Is Available?"}
                  />
                </Grid>
              </Grid>
              <Grid container justifycontent="center" alignItems="center">
                <AppButton onClick={handleCancel}>Cancel</AppButton>
                <UpdateButton
                  color="primary"
                  id={id}
                  payload={{...values, role, isAvailable}}
                >
                  Update user
                </UpdateButton>
                <AppButton color="error" onClick={() => handleDelete(id)}>
                  Delete user
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default SingleUserView;
