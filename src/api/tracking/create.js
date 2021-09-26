import { api } from '../';

async function collectionCreate(payload) {
  const newOrder = JSON.stringify(payload);
  const res = await api.axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, {
    body: newOrder,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    ...res
  };
}

export default collectionCreate;
