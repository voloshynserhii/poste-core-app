import { api } from '..';

async function collectionUpdate(collection, id, payload) {
  console.log(JSON.stringify(payload));
  await api.axios.patch(`https://cors-anywhere.herokuapp.com/${process.env.REACT_APP_API_URL}/${collection}/${id}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    id,
    ...payload,
  };
}

export default collectionUpdate;