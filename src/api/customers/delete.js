import { api } from '..';

async function userDelete(id) {
  const res = await api.axios.delete(`${process.env.REACT_APP_API_URL}/api/customer/${id}`);

  return res
}

export default userDelete;
