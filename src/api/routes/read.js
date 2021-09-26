import { api } from '..';

async function collectionReadMany() {
  const ref = await api.axios(`${process.env.REACT_APP_API_URL}/api/route`);
  const data = await ref.data.data.routes;
  if (!data) return [];
  return data;
}

async function collectionReadOne(id) {
  const ref = await api.axios(`${process.env.REACT_APP_API_URL}/api/route/${id}`);
  const data = await ref.data.data.route;
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