import { Route, Switch } from 'react-router-dom';
import AllDataView from './AllData';
// import DataForm from './DataForm';

/**
 * Routes for "Data" view
 * url: /data/*
 */
const DataRoutes = () => {
  return (
    <Switch>
      {/* <Route path="/data/form" component={DataForm} /> */}
      <Route path="/data" component={AllDataView} />
      <Route component={AllDataView} />
    </Switch>
  );
};

export default DataRoutes;