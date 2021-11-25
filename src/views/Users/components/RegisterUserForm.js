import { useState, useEffect, useCallback, useContext } from "react";
import {
  makeStyles,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import { AppContext } from "../../../store";
import api from "../../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../../utils/form";
import AppButton from "../../../components/AppButton";

const userForm = makeStyles((theme) => ({
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

const VALIDATE_FORM_USER = {
  name: {
    type: "string",
    presence: { allowEmpty: false },
  },
  phone: {
    type: "string",
    presence: { allowEmpty: true },
  },
  email: {
    type: "string",
    presence: { allowEmpty: false },
  },
  password: {
    type: "string",
    presence: { allowEmpty: false },
  },
};

const RegisterUserForm = ({ onCancel }) => {
  const [, dispatch] = useContext(AppContext);
  const classes = userForm();
  const [userSaved, setUserSaved] = useState(false);
  const [curier, setCurier] = useState(false);
  const [dispatcher, setDispatcher] = useState(false);

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_USER,
      initialValues: {},
    });
  const values = formState.values;

  const formUser = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        name: "",
        email: "",
        password: "",
        phone: "",
      },
    }));
  }, [setFormState]);

  useEffect(() => {
    formUser();
  }, [formUser]);

  const saveRecord = async () => {
    let role;
    if (curier) role = "curier";
    if (dispatcher) role = "dispatcher";

    const newUser = {
      ...formState.values,
      role: role,
    };
    try {
      // save changes in BD
      const res = await api.users.create(newUser);
      const savedUser = res.data.data.user;
      if (res.status === 201) {
        dispatch({ type: "ADD_USER", payload: savedUser });
        setUserSaved(true);
      }
    } catch (err) {
      alert("Something went wrong. Please try another email address")
    }
  };
  const handleSave = () => {
    // Save without confirmation
    saveRecord();
    return;
  };

  if (userSaved) return null;

  return (
    <div className={classes.layer}>
      <Card className={classes.root}>
        <CardHeader title="Register new user" />
        <CardContent>
          <TextField
            required
            label="Name"
            name="name"
            value={values?.name || ''}
            error={fieldHasError("name")}
            helperText={fieldGetError("name") || "Provide a name of the user"}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            label="Email"
            name="email"
            value={values?.email || ''}
            defaultValue={values.email}
            error={fieldHasError("email")}
            helperText={fieldGetError("email") || "Provide email of the user"}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            label="Password"
            name="password"
            value={values?.password || ''}
            defaultValue={values.password}
            error={fieldHasError("password")}
            helperText={
              fieldGetError("password") || "Provide a password of the user"
            }
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            type="number"
            label="Phone"
            name="phone"
            value={values?.phone || ''}
            error={fieldHasError("phone")}
            helperText={fieldGetError("phone") || "Provide a phone of the user"}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={curier}
                onChange={() => {
                  setCurier((old) => !old);
                  if (dispatcher) {
                    setDispatcher(false);
                  }
                }}
                name="curier"
                color="primary"
              />
            }
            label="Curier"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={dispatcher}
                onChange={() => {
                  setDispatcher((prev) => !prev);
                  if (curier) {
                    setCurier(false);
                  }
                }}
                name="curier"
                color="primary"
              />
            }
            label="Dispatcher"
          />
          <Grid container justifyContent="center" alignItems="center">
            <AppButton onClick={onCancel}>Cancel</AppButton>
            <AppButton
              color="success"
              disabled={!formState.isValid}
              onClick={handleSave}
            >
              Save User
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
export default RegisterUserForm;
