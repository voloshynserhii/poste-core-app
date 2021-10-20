import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function CheckboxesGroup({ data }) {
  const classes = useStyles();
  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
 
  return (
    <div className={classes.root} data={data}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          {!!data &&
            data.map((route) => (
              <FormControlLabel
                control={
                  <Checkbox
                    // checked={gilad}
                    onChange={handleChange}
                    name={route.title}
                  />
                }
                label={route.title}
              />
            ))}
        </FormGroup>
        {!data || data?.length === 0 && (
          <FormHelperText>No routes available</FormHelperText>
        )}
      </FormControl>
    </div>
  );
}
