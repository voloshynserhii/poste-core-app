import { api } from '..';

async function collectionUpdate(id, payload) {
  const updatedOrder = JSON.stringify(payload);
  
  const res = await api.axios.patch(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, {
    body: updatedOrder,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res;
}

export default collectionUpdate;