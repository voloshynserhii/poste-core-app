import { api } from "..";

async function addMultiplyOrders(ordersArr, routeId) {

  let arr = [];

  ordersArr.forEach(async (orderId) => {
    const addRouteToOrderResult = await api.axios.patch(
      `${process.env.REACT_APP_API_URL}/api/orders/route/${orderId}`,
      {
        params: routeId,
      }
    );
    if (addRouteToOrderResult.status === 200) arr.push(addRouteToOrderResult);
    if (ordersArr.length === arr.length) {
      const res = await api.axios.patch(
        `${process.env.REACT_APP_API_URL}/api/route/addOrder/${routeId}`,
        {
          params: ordersArr,
        }
      );
      return res;
    }
  });
  
}

export default addMultiplyOrders;
