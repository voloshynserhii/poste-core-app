import { useState, useEffect, useCallback, useContext } from "react";
import {
  makeStyles,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
} from "@material-ui/core";

import { AppContext } from "../../../store";
import api from "../../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from "../../../utils/form";
import AppButton from "../../../components/AppButton";
import { statuses } from "../utils";

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

const ChangeMultipleForm = ({ onCancel }) => {
  const [, dispatch] = useContext(AppContext);
  const classes = userForm();
  const [userSaved, setUserSaved] = useState(false);
  const [curier, setCurier] = useState(false);
  const [dispatcher, setDispatcher] = useState(false);

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      initialValues: {},
      validationSchema: {},
    });
  const values = formState.values;

  const editForm = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        status: "",
      },
    }));
  }, [setFormState]);

  useEffect(() => {
    editForm();
  }, [editForm]);

  const saveRecord = async () => {
    let role;
    if (curier) role = "curier";
    if (dispatcher) role = "dispatcher";

    const newUser = {
      ...formState.values,
      role: role,
    };
    // try {
    //   // save changes in BD
    //   const res = await api.users.create(newUser);
    //   const savedUser = res.data.data.user;
    //   if (res.status === 201) {
    //     dispatch({ type: "ADD_USER", payload: savedUser });
    //     setUserSaved(true);
    //   }
    // } catch (err) {
    //   alert("Something went wrong. Please try another email address")
    // }
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
        <CardHeader title="Make changes for chosen orders" />
        <CardContent>
          <select
            // className={classes.selects}
            // value={region}
            // onChange={(event) => setRegion(event.target.value)}
          >
            Status
            <option value="">Choose status</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <Grid container justifyContent="center" alignItems="center">
            <AppButton onClick={onCancel}>Cancel</AppButton>
            <AppButton
              color="success"
              disabled={!formState.isValid}
              onClick={handleSave}
            >
              Save
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
export default ChangeMultipleForm;
