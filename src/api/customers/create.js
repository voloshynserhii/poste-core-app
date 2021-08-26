import { api } from '../';

async function collectionCreate(payload) {
  const newUser = JSON.stringify(payload);
  console.log(newUser);
  await api.axios.post(`${process.env.REACT_APP_API_URL}/api/customers`, {
    body: newUser,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    ...payload,
  };
}

export default collectionCreate;
