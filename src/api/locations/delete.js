import { api } from '..';

async function locationDelete(id) {
  const res = await api.axios.delete(`${process.env.REACT_APP_API_URL}/api/locations/${id}`);

  return res
}

export default locationDelete;
