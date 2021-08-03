import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import MainTable from "../MainTable";
import SideBar from "../SideBar";

import classes from "./StartingPageContent.module.css";

const StartingPageContent = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <section className={classes.starting}>
      {!isLoggedIn && <h1> Please log in</h1>}
      {isLoggedIn && (
        <>
          <div className={classes.wrapper}>
            <SideBar collection="order" data={null} title="Tracking" />
            <MainTable />
          </div>
        </>
      )}
    </section>
  );
};

export default StartingPageContent;
