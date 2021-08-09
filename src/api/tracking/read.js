import { api } from '../';

async function collectionReadMany() {
  const ref = await api.axios(`${process.env.REACT_APP_API_URL}/orders`);
  const data = await ref.data.data.orders;
  if (!data) return [];
  // const result = Object.keys(data).map((item) => ({ id: item, ...data[item] }));
  // console.log(result);
  return data;
}

async function collectionReadOne(id) {
  const ref = await api.axios(`${process.env.REACT_APP_API_URL}/orders/${id}`);
  const snapshot = await ref.get();
  const data = await snapshot.val();
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