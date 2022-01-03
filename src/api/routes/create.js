import { api } from '../';

async function routeCreate(payload) {
  const newRoute = JSON.stringify(payload);
  const res = await api.axios.post(`${process.env.REACT_APP_API_URL}/api/route`, {
    newRoute,
  });

  return {
    ...res
  };
}

export default routeCreate;
