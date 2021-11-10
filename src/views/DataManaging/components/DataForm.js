import { useState, useCallback } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  FormControl,
  FormGroup,
  Grid,
  TextField,
} from "@material-ui/core";

import AppButton from "../../../components/AppButton";
import AddDataForm from "./AddDataForm";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      display: "flex",
    },
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "10px",
    },
    formControl: {
      margin: "0",
    },
    searchField: {
      width: "100%",
    },
    formGroup: {
      display: "grid",
      fontSize: 12,
    },
  })
);

export default function DataTabs(props) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [add, setAdd] = useState(false);

  // const handleChange = (event) => {
  //   if (!checked?.includes(event.target.name)) {
  //     setChecked([...checked, event.target.name]);
  //     //   props.onGetValues([...checked, event.target.name]);
  //   } else {
  //     const newChecked = checked.filter((item) => item !== event.target.name);
  //     setChecked(newChecked);
  //     //   props.onGetValues(newChecked);
  //   }
  // };

  const searchCheckbox = useCallback(
    (event) => {
      if (event.target.value) {
        const lowerData = data.map((item) => item.toLowerCase());
        const res = lowerData.filter((item) =>
          item.includes(event.target.value)
        );
        const result = res.map((item) => {
          const lower = item.toLowerCase().slice(1);
          const first = item.charAt(0).toUpperCase();
          return first + lower;
        });
        setData(result);
      } else {
        setData(props.checkboxList);
      }
    },
    [data, props.checkboxList]
  );

  return (
    <Grid container fullwidth="true" spacing={2}>
      {add && <AddDataForm onCancel={() => setAdd(false)} />}
      <Grid item sm={12} className={classes.container}>
        <TextField
          className={classes.searchField}
          id="search"
          placeholder="Search location"
          type="search"
          variant="outlined"
          InputProps={{
            style: {
              maxHeight: 40,
              margin: "0 15px",
              padding: "0",
            },
          }}
          onChange={searchCheckbox}
        />
        <span>or</span>
        <AppButton onClick={() => setAdd(true)}>add</AppButton>
      </Grid>
      <div className={classes.root}>
        <FormControl
          required
          // error={error}
          component="fieldset"
          className={classes.formControl}
        >
          <FormGroup
            className={classes.formGroup}
            style={{
              gridTemplateColumns: `repeat(${props.columns || 2}, 1fr)`,
            }}
          >
            {!!props.data &&
              props.data.map((location) => <span>{location.name}</span>)}
          </FormGroup>
        </FormControl>
      </div>
    </Grid>
  );
}
