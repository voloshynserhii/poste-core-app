import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import RoutesTable from "./components/RoutesTable";

const useStyles = makeStyles((theme) => ({
  fixedButton: {
    position: "fixed",
    bottom: "3%",
    left: "25%",
  },
}));

const AllRoutesView = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleAddRoute = () => {
    history.push("/route/form");
  };

  return (
    <>
      <RoutesTable />
      <Fab
        className={classes.fixedButton}
        color="secondary"
        aria-label="add"
        onClick={handleAddRoute}
      >
        <AddIcon />
      </Fab>
    </>
  );
};
export default AllRoutesView;
