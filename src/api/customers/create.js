import { api } from '../';

async function collectionCreate(payload) {
  const newCustomer = JSON.stringify(payload);
  console.log(newCustomer);
  await api.axios.post(`${process.env.REACT_APP_API_URL}/api/customers`, {
    body: newCustomer,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    ...payload,
  };
}

export default collectionCreate;
