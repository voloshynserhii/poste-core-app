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
import CustomSelect from "../../../components/CustomSelect";
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

const VALIDATE_FORM_EDIT = {
  status: {
    type: "string",
    presence: { allowEmpty: false },
  },
};

const ChangeMultipleForm = ({ orders, onUpdate, onCancel }) => {
  const [state, dispatch] = useContext(AppContext);
  const classes = userForm();
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(new Date().toISOString().slice(0, 10))
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState("12:00")
  

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_EDIT,
    });

  const values = formState.values;
  // const dayToday = new Date().toISOString().slice(0, 10);

  const editForm = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        status: "",
        statusDetail: "",
        expectedDeliveryAt: {
          date: expectedDeliveryDate,
          time: expectedDeliveryTime,
        },
      },
    }));
  }, [setFormState]);

  useEffect(() => {
    editForm();
  }, [editForm]);
  console.log(values);
  const saveRecord = async () => {
    try {
      // save changes in BD
      for (let i = 0; i < orders.length; i++) {
        const updatedOrder = state.orders.find(
          (order) => order._id === orders[i]
        );
        const res = await api.orders.update(orders[i], values);
        if (res.status === 200) {
          dispatch({
            type: "UPDATE_ORDER",
            id: orders[i],
            updatedOrder: { ...updatedOrder, ...res.data },
          });
        }
      }
      onUpdate(true);
    } catch (err) {
      alert("Something went wrong!");
    }
  };
  const handleSave = () => {
    // Save without confirmation
    saveRecord();
    return;
  };

  return (
    <div className={classes.layer}>
      <Card className={classes.root}>
        <CardHeader title="Make changes for chosen orders" />
        <CardContent>
          <CustomSelect
            title="Status*"
            name="status"
            value={values?.status || ""}
            data={statuses}
            onChange={onFieldChange}
          />
          {!!values.status && (
            <CustomSelect
              title="Status detail"
              name="statusDetail"
              value={values?.statusDetail || ""}
              data={
                statuses.find((status) => status.value === values.status)
                  .details || []
              }
              onChange={onFieldChange}
            />
          )}
          <TextField
            id="expectedDeliveryDate"
            label="Expected delivery date"
            type="date"
            name="date"
            value={expectedDeliveryDate}
            InputLabelProps={{
              shrink: true,
            }}
            error={fieldHasError("date")}
            helperText={
              fieldGetError("date") ||
              "Display expected delivery date for chosen orders"
            }
            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            id="expectedDeliveryTime"
            label="Expected delivery time"
            name="time"
            type="time"
            value={expectedDeliveryTime}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
              style: {
                height: 28,
              },
            }}
            error={fieldHasError("time")}
            helperText={
              fieldGetError("time") ||
              "Display expected delivery time for chosen orders"
            }
            onChange={(e) => setExpectedDeliveryTime(e.target.value)}
            {...SHARED_CONTROL_PROPS}
          />

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
