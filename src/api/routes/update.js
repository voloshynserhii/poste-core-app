import { api } from '..';

async function collectionUpdate(id, payload) {
  const updatedRoute = JSON.stringify(payload);
  console.log(payload, updatedRoute);
  const res = await api.axios.patch(`${process.env.REACT_APP_API_URL}/api/route/${id}`, {
    updatedRoute,
  });

  return {
    id,
    ...res
  };
}

export default collectionUpdate;