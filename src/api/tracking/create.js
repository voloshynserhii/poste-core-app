import { api } from '../';

async function collectionCreate(payload) {
  const newOrder = JSON.stringify(payload);
  const res = await api.axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, {
    order: newOrder,
  });

  return {
    ...res
  };
}

export default collectionCreate;
