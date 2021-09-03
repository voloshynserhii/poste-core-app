import { api } from '../';

async function collectionCreate(payload) {
  const newOrder = JSON.stringify(payload);
  console.log(newOrder);
  await api.axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, {
    body: newOrder,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    ...payload,
  };
}

export default collectionCreate;
