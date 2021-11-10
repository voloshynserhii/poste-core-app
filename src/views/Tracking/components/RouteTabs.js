import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { AppBar, Box, LinearProgress, Tabs, Tab } from "@material-ui/core";

import { AppContext } from "../../../store";
import RouteCheckboxes from "./RouteCheckboxes";
import api from "../../../api";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
}));

export default function FullWidthTabs({ orderId }) {
  const classes = useStyles();
  const theme = useTheme();
  const [state, dispatch] = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [routes, setRoutes] = useState();
  const [lastMileRoutes, setLastMileRoutes] = useState();
  const [transitRoutes, setTransitRoutes] = useState();
  const [collectionRoutes, setCollectionRoutes] = useState();
  const [peerRoutes, setPeerRoutes] = useState();

  useEffect(() => {
    if (state.routes.length) {
      setLoading(false);
      setRoutes(state.routes);
    } else {
      async function fetchData() {
        const res = await api.routes.read(); // List of All routes
        if (res) {
          dispatch({ type: "SET_ROUTES", routes: res });
          setLoading(false);
          setRoutes(res);
        }
      }
      fetchData();
    }
  }, [dispatch, state.orders.length, state.routes]);

  useEffect(() => {
    if (!!routes) {
      setLastMileRoutes(() => {
        return routes.filter((r) => r.type === "lastMile");
      });
      setTransitRoutes(() => {
        return routes.filter((r) => r.type === "transit");
      });
      setCollectionRoutes(() => {
        return routes.filter((r) => r.type === "collection");
      });
      setPeerRoutes(() => {
        return routes.filter((r) => r.type === "peer-to-peer");
      });
    }
  }, [routes]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  if (loading) return <LinearProgress />;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Last mile" {...a11yProps(0)} />
          <Tab label="Collection" {...a11yProps(1)} />
          <Tab label="Transit" {...a11yProps(2)} />
          <Tab label="Peer-topeer" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <RouteCheckboxes data={lastMileRoutes} orderId={orderId} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <RouteCheckboxes data={collectionRoutes} orderId={orderId} />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <RouteCheckboxes data={transitRoutes} orderId={orderId} />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <RouteCheckboxes data={peerRoutes} orderId={orderId} />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
