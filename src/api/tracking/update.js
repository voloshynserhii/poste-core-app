import { api } from '..';

async function collectionUpdate(collection, id, payload) {
  console.log(collection, id, payload);
  await api.axios.patch(`https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_API_URL}/${collection}/${id}`, {
    payload
  });

  return {
    id,
    ...payload,
  };
}

export default collectionUpdate;