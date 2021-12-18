import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from "@material-ui/core";

import { AppContext } from "../../../store";
import api from "../../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function CheckboxesGroup({ data, orderId }) {
  const classes = useStyles();
  const [state, dispatch] = useContext(AppContext);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    const order = state.orders.find((order) => order._id === orderId);
    setChecked(order.routeData);
  }, [orderId, state.orders]);

  const handleChange = async (event) => {
    if (!checked?.includes(event.target.id)) {
      setChecked([...checked, event.target.id]);
      const res = await api.orders.assignRoute(orderId, event.target.id);
      
      //add dispatcher here!!!
    } else {
      const newChecked = checked.filter((item) => item !== event.target.id);
      const res = await api.orders.unassignRoute(orderId, event.target.id);
      
      //add dispatcher here!!!!
      setChecked(newChecked);
    }
  };

  return (
    <div className={classes.root} data={data}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          {!!data &&
            data.map((route) => (
              <FormControlLabel
                key={route._id}
                control={
                  <Checkbox
                    checked={checked?.includes(route?._id)}
                    onChange={handleChange}
                    name={route.title}
                    id={route._id}
                  />
                }
                label={route.title}
              />
            ))}
        </FormGroup>
        {!data ||
          (data?.length === 0 && (
            <FormHelperText>No routes available</FormHelperText>
          ))}
      </FormControl>
    </div>
  );
}
