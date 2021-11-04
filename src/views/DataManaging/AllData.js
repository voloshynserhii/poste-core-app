import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";


const useStyles = makeStyles((theme) => ({
  fixedButton: {
    position: "fixed",
    bottom: "5%",
    right: "5%",
  },
}));

const AllDataView = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleAddRoute = () => {
    // history.push("/route/form");
  };

  return (
    <>

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
export default AllDataView;
