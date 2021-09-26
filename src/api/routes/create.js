import { api } from '../';

async function collectionCreate(payload) {
  const newRoute = JSON.stringify(payload);
  const res = await api.axios.post(`${process.env.REACT_APP_API_URL}/api/route`, {
    body: newRoute,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    ...res
  };
}

export default collectionCreate;
