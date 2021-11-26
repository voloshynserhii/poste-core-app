import { useState, useCallback, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from "@material-ui/icons/Delete";

import api from "../../../api";
import { AppContext } from "../../../store";
import AddDataForm from "./AddDataForm";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function DataFormList({ data }) {
  const classes = useStyles();
  const [, dispatch] = useContext(AppContext);
  const [checked, setChecked] = useState([0]);
  const [editID, setEditID] = useState('');

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
  
  const handleDelete = useCallback(async(id) => {
    try {
      // save changes in BD
      const res = await api.locations.delete(id);
      if (res.status === 200) {
        dispatch({ type: "DELETE_LOCATION", payload: id });
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again later");
    }
  }, [dispatch]);

  return (
    <>
    {editID && <AddDataForm id={editID} onSave={() => setEditID('')} title="Edit location" onCancel={() => setEditID('')} />}
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
            <ListItemIcon title={`Edit ${value.name}`}>
              <EditIcon onClick={() => setEditID(value._id)} />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                title={`Delete ${value.name}`}
                onClick={() => handleDelete(value._id)} 
              >
                <DeleteIcon color="secondary"/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
    </>
  );
}
