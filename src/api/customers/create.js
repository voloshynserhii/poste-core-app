import { api } from '../';

async function collectionCreate(payload) {
  const newCustomer = JSON.stringify(payload);
  const res = await api.axios.post(`${process.env.REACT_APP_API_URL}/api/customers`, {
    body: newCustomer,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    ...res
  };
}

export default collectionCreate;
