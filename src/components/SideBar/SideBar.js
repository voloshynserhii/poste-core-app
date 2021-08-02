import { useContext } from "react";

import AddButton from "../AddButton";
import AuthContext from "../../store/auth-context";
import classes from "./sidebar.module.css";

const SideBar = (props) => {
  const authCtx = useContext(AuthContext);

  return (
    <aside className={classes.sidebar} data={props.data}>
        <h3>{props.title}</h3>
        <AddButton className={classes.addButton} collection={props.collection}>Create {props.collection}</AddButton>
    </aside>
  );
};

export default SideBar;