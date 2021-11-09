import axiosInstance from './axios';
import firebaseInstance from './firebase';
import { loadToken } from './auth/utils';
import * as auth from './auth';
import * as info from './info';
import * as collection from './collection';
import * as orders from './tracking';
import * as users from './users';
import * as customers from './customers';
import * as routes from './routes';
import * as locations from './locations';

const api = {
  // Pre-configured HTTP request instances
  axios: axiosInstance,
  firebase: firebaseInstance,
  // fetch: fetch, // use custom fetch is needed

  // Properties
  token: () => loadToken(),
  get url() {
    return axiosInstance?.defaults?.baseURL;
  },

  // API "modules"
  auth,
  info,
  collection,
  orders,
  users,
  customers,
  routes,
  locations
};

export default api;
