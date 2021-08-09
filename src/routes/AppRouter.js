import React from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Main Router of the Application
 */
const AppRouter = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

export default AppRouter;
