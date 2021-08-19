import axiosInstance from './axios';
import firebaseInstance from './firebase';
import { loadToken } from './auth/utils';
import * as auth from './auth';
import * as info from './info';
import * as collection from './collection';
import * as orders from './tracking';

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
  orders
};

export default api;
