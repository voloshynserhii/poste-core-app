import { api } from '..';

async function orderDelete(id) {
  const res = await api.axios.delete(`${process.env.REACT_APP_API_URL}/api/orders/${id}`);
  console.log(res);
  return res
}

export default orderDelete;
