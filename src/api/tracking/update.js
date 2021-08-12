import { api } from '..';

async function collectionUpdate(collection, id, payload) {
  await api.axios.patch(`${process.env.REACT_APP_API_URL}/${collection}/${id}`, {
    payload
  });

  return {
    id,
    ...payload,
  };
}

export default collectionUpdate;