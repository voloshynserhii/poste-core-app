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
    presence: { allowEmpty: true },
  },
};

const ChangeMultipleForm = ({ orders, onUpdate, onCancel }) => {
  const [state, dispatch] = useContext(AppContext);
  const classes = userForm();
  const [ordersUpdated, setOrdersUpdated] = useState(false);

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] =
    useAppForm({
      validationSchema: VALIDATE_FORM_EDIT,
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
    try {
      // save changes in BD
      for (let i = 0; i < orders.length; i++) {
        const updatedOrder = state.orders.find(order => order._id === orders[i])
        const res = await api.orders.update(orders[i], values);
        if(res.status === 200) {
          dispatch({ type: 'UPDATE_ORDER', id: orders[i], updatedOrder: {...updatedOrder, ...res.data} });
        }
      }
      onUpdate(true)
    } catch (err) {
      alert("Something went wrong!")
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
          <CustomSelect name="status" data={statuses} title="Choose status" onChange={onFieldChange} />
          {values.status === "In Transit" && <CustomSelect title="Subtatus" data={statuses} onChange={onFieldChange} />}
          
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
