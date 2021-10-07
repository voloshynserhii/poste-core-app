import { localStorageSet } from "../utils/localStorage";

/**
 * Main reducer for global AppStore using "Redux styled" actions
 * @param {object} state - current/default state
 * @param {string} action.type - unique name of the action
 * @param {*} [action.payload] - optional data object or the function to get data object
 */
const AppReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        ...state,
        currentUser: action?.currentUser || action?.payload,
      };
    case "LOG_IN":
      return {
        ...state,
        isAuthenticated: true,
      };
    case "LOG_OUT":
      return {
        ...state,
        isAuthenticated: false,
        currentUser: undefined, // Also reset previous user data
      };
    case "SET_DARK_MODE": {
      const darkMode = action?.darkMode ?? action?.payload;
      localStorageSet("darkMode", darkMode);
      return {
        ...state,
        darkMode,
      };
    }
    case "SET_ORDERS":
      return {
        ...state,
        orders: action?.orders || action?.payload,
      };
    case "ADD_ORDER":
      const newOrderArr = [...state.orders, action.payload];
      return {
        ...state,
        orders: newOrderArr,
      };
    case "UPDATE_ORDER":
      let updatedOrder = { _id: action.id, ...action.updatedOrder };
      let orderArr = [...state.orders];
      let i = orderArr.findIndex((order) => order._id === action.id);
      orderArr.splice(i, 1, updatedOrder);
      return {
        ...state,
        orders: orderArr,
      };
    case "DELETE_ORDER":
      const deleteOrderId = action.payload;
      const orderArray = [...state.orders];
      const index = orderArray.indexOf((order) => order._id === deleteOrderId);
      const updatedOrderArr = orderArray.splice(index, 0);
      return {
        ...state,
        orders: updatedOrderArr,
      };
    case "SET_USERS":
      return {
        ...state,
        users: action?.users || action?.payload,
      };
    case "ADD_USER":
      const newUserArr = [...state.users, action.payload];
      return {
        ...state,
        users: newUserArr,
      };
    case "UPDATE_USER":
      let updatedUser = { _id: action.id, ...action.updatedUser };
      let userArr = [...state.users];
      let userIndex = userArr.findIndex((user) => user._id === action.id);
      userArr.splice(userIndex, 1, updatedUser);
      return {
        ...state,
        users: userArr,
      };
    case "DELETE_USER":
      const deleteUserId = action.payload;
      const userArray = [...state.users];
      const indexToDelete = userArray.indexOf(
        (user) => user._id === deleteUserId
      );
      const updatedUserArr = userArray.splice(indexToDelete, 0);
      return {
        ...state,
        users: updatedUserArr,
      };
    case "SET_CUSTOMERS":
      return {
        ...state,
        customers: action?.customers || action?.payload,
      };
    case "ADD_CUSTOMER":
      const newCustomerArr = [...state.customers, action.payload];
      return {
        ...state,
        customers: newCustomerArr,
      };
    case "UPDATE_CUSTOMER":
      let updatedCustomer = { _id: action.id, ...action.updatedCustomer };
      let customerArr = [...state.customers];
      let customerIndex = customerArr.findIndex(
        (customer) => customer._id === action.id
      );
      customerArr.splice(customerIndex, 1, updatedCustomer);
      return {
        ...state,
        customers: customerArr,
      };
    case "DELETE_CUSTOMER":
      const deleteCustomerId = action.payload;
      const customerArray = [...state.customers];
      const customerIndexToDelete = customerArray.indexOf(
        (customer) => customer._id === deleteCustomerId
      );
      const updatedCustomerArr = customerArray.splice(customerIndexToDelete, 0);
      return {
        ...state,
        customers: updatedCustomerArr,
      };
    case "SET_ROUTES":
      return {
        ...state,
        routes: action?.routes || action?.payload,
      };
    case "ADD_ROUTE":
      const newRouteArr = [...state.routes, action.payload];
      return {
        ...state,
        routes: newRouteArr,
      };
    case "UPDATE_ROUTE":
      let updatedRoute = { _id: action.id, ...action.updatedRoute };
      let routeArr = [...state.routes];
      let j = routeArr.findIndex((route) => route._id === action.id);
      routeArr.splice(j, 1, updatedRoute);
      return {
        ...state,
        routes: routeArr,
      };
    case "DELETE_ROUTE":
      const deleteRouteId = action.payload;
      const routeArray = [...state.routes];
      const delIndex = routeArray.indexOf(
        (route) => route._id === deleteRouteId
      );
      const updatedRouteArr = routeArray.splice(delIndex, 0);
      return {
        ...state,
        routes: updatedRouteArr,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default AppReducer;
