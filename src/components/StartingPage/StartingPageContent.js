import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import MainTable from "../MainTable";
import classes from "./StartingPageContent.module.css";

const StartingPageContent = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <section className={classes.starting}>
      {!isLoggedIn && <h1> Please log in</h1>}
      {isLoggedIn && <MainTable />}
    </section>
  );
};

export default StartingPageContent;
