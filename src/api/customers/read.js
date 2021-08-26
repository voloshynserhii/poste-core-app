import { api } from '..';

async function collectionReadMany() {
  const ref = await api.axios(`${process.env.REACT_APP_API_URL}/api/customers`);
  const data = await ref.data.data.customers;
  if (!data) return [];
  return data;
}

async function collectionReadOne(id) {
  const ref = await api.axios(`${process.env.REACT_APP_API_URL}/api/customer/${id}`);
  const data = await ref.data.data.customer;
  if (!data) return undefined;
  return {
    id,
    ...data,
  };
}

async function collectionReadOneOrMany(id) {
  if (id) {
    return collectionReadOne(id);
  } else {
    return collectionReadMany();
  }
}

export default collectionReadOneOrMany;