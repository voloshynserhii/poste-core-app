import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import CallSplitIcon from "@material-ui/icons/CallSplit";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function DataFormList({ data }) {
  const classes = useStyles();
  const [checked, setChecked] = useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  console.log(data);

  return (
    <List className={classes.root}>
      {data.map((value) => {
        const labelId = `checkbox-list-label-${value}`;
        return (
          <ListItem
            key={value._id}
            role={undefined}
            fullwidth="true"
            dense
            button
            onClick={handleToggle(value)}
          >
            <ListItemIcon title={`Assign a parent location to ${value.name}`}>
              <CallSplitIcon onClick={(event) => console.log(value._id)} />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                title={`Delete ${value.name}`}
              >
                <DeleteIcon color="secondary" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
