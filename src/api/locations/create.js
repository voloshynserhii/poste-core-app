import { api } from '../';

async function locationCreate(payload) {
  // const newLocation = JSON.stringify(payload);

  const res = await api.axios.post(`${process.env.REACT_APP_API_URL}/api/locations`, payload);

  return {
    ...res
  };
}

export default locationCreate;