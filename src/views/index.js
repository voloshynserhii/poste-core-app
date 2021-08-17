/**
 * Note: Don't import/export all Views directly, use lazy loading!
 */
import React from 'react';
import { withSuspense } from '../components';
import NotFound from './NotFound';
import NotImplementedView from './NotImplemented';

const Welcome = withSuspense(React.lazy(() => import('./Welcome')));
const Settings = () => <NotImplementedView name="Settings" />; // Sample of non-implemented View
const MyProfile = withSuspense(React.lazy(() => import('./MyProfile')));

export { MyProfile, NotFound, Welcome, Settings };
