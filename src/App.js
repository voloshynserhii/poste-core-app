import { AppStore } from './store';
import { AppRouter, AllRoutes } from './routes';
import { ErrorBoundary } from './components';
import { AppThemeProvider } from './theme';
import { AppSnackBarProvider } from './components/AppSnackBar';
import AppIdleTimer from './components/AppIdleTimer';

/**
 * Root Application Component
 * @class App
 */
const App = () => {
  return (
    <ErrorBoundary name="App">
      <AppStore>
        <AppIdleTimer />
        <AppThemeProvider>
          <AppSnackBarProvider>
            <AppRouter>
              <AllRoutes />
            </AppRouter>
          </AppSnackBarProvider>
        </AppThemeProvider>
      </AppStore>
    </ErrorBoundary>
  );
};

export default App;
