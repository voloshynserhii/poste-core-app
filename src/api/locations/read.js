import { api } from '..';

async function locationsReadMany() {
  const ref = await api.axios(`${process.env.REACT_APP_API_URL}/api/locations/`);
  const data = await ref.data;
  if (!data) return [];
  return data;
}

async function locationsReadOne(id) {
  const ref = await api.axios(`${process.env.REACT_APP_API_URL}/api/locations/${id}`);
  const data = await ref.data;
  if (!data) return undefined;
  return {
    id,
    ...data,
  };
}

async function locationsReadOneOrMany(id) {
  if (id) {
    return locationsReadOne(id);
  } else {
    return locationsReadMany();
  }
}

export default locationsReadOneOrMany;