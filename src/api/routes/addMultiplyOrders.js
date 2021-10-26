import { api } from "..";

async function addMultiplyOrders(ordersArr, routeId) {
  console.log(ordersArr, routeId);

  ordersArr.forEach(async (orderId) => {
    await api.axios.patch(
      `${process.env.REACT_APP_API_URL}/api/orders/route/${orderId}`,
      {
        params: routeId,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  });
  const res = await api.axios.patch(
    `${process.env.REACT_APP_API_URL}/api/route/addOrder/${routeId}`,
    {
      params: ordersArr,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res;
}

export default addMultiplyOrders;
