import { Route } from 'react-router-dom';
import AboutRoutes from '../views/About';
import LegalRoutes from '../views/Legal';
import { NotFound } from '../views';

/**
 * List of routes available ether for logged or for anonymous users
 */
const SharedRoutes = () => {
  const renderRoutesAsArray = () => [
    <Route key="about" path="/about" component={AboutRoutes} />,
    <Route key="legal" path="/legal" component={LegalRoutes} />,
    <Route key="notfound" component={NotFound} />, // Must be last!
  ];

  // Routes correctly worked only as Array, fragments are not supported by <Switch> wrappers
  return renderRoutesAsArray();
};

export default SharedRoutes;
