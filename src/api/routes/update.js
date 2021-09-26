import { api } from '..';

async function collectionUpdate(id, payload) {
  const updatedRoute = JSON.stringify(payload);
  
  const res = await api.axios.patch(`${process.env.REACT_APP_API_URL}/api/route/${id}`, {
    body: updatedRoute,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    id,
    ...res
  };
}

export default collectionUpdate;