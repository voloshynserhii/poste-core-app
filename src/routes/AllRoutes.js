import { useEffect } from 'react';
import api from '../api';
import { isUserStillLoggedIn } from '../api/auth/utils';
import { useAppStore } from '../store';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

/**
 * Renders routes depending Logged or Anonymous users
 */
const AllRoutes = () => {
  const [state, dispatch] = useAppStore();

  useEffect(() => {
    // Check isn't token expired?
    const isLogged = isUserStillLoggedIn();
    log.info('AllRoutes() - isLogged:', isLogged);
    if (state.isAuthenticated && !isLogged) {
      // Token was expired, logout immediately!
      log.warn('Token was expired, logout immediately!');
      api.auth.logout();
      return; // Thats all for now, the App will be completely re-rendered soon
    }
    //needs to be fixed later (function isUserStillLoggedIn doesn't work properly)
    if (isLogged && !state.isAuthenticated) {
      // Valid token is present but we are not logged in somehow, lets fix it
      dispatch({ type: 'LOG_IN' });
    }
  }, [state.isAuthenticated, dispatch]); // Effect for every state.isAuthenticated change actually

  log.info('AllRoutes() - isAuthenticated:', state.isAuthenticated);

  return state.isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />; //change to !state.isAuthenticated to show Public routes
};

export default AllRoutes;
