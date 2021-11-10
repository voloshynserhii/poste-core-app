import { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Tab, Tabs } from "@material-ui/core";

import DataForm from "./components/DataForm";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 224,
    marginTop: 20,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function DataTabs({ data }) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Data tabs"
        className={classes.tabs}
      >
        <Tab label="Regions" {...a11yProps(0)} />
        <Tab label="Cities" {...a11yProps(1)} />
        <Tab label="Districts & Villages" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <DataForm data={data.filter((el) => el.type === "region")} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DataForm data={data.filter((el) => el.type === "city")} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DataForm data={data.filter((el) => el.type === "village")} />
      </TabPanel>
    </div>
  );
}
