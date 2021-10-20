import { api } from '..';

async function assignRoute(orderId, routeId) {
console.log(orderId, routeId);
  const res = await api.axios.patch(`${process.env.REACT_APP_API_URL}/api/orders/route/${orderId}`, {
    params: routeId,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res;
}

export default assignRoute;