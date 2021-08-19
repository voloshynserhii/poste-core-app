import { api } from '../';

async function collectionCreate(collection, payload) {
  const newOrder = JSON.stringify(payload);
  
  await api.axios.post(`${process.env.REACT_APP_API_URL}/api/${collection}`, {
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
