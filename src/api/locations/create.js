import { api } from '../';

async function locationCreate(payload) {
  const newLocation = JSON.stringify(payload);
  console.log(newLocation);
  const res = await api.axios.post(`${process.env.REACT_APP_API_URL}/api/locations`, payload);

  return {
    ...res
  };
}

export default locationCreate;