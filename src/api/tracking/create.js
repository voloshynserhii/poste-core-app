import { api } from '../';

async function collectionCreateByFirebase(collection, payload) {
  const id = await api.firebase.database().ref().child(collection).push().key;
  const updates = {};
  updates[`/${collection}/${id}`] = payload;
  await api.firebase.database().ref().update(updates);
  return {
    id,
    ...payload,
  };
}

async function collectionCreate(collection, payload) {
  console.log(JSON.stringify(payload));
  await api.axios.post(`${process.env.REACT_APP_API_URL}/api/${collection}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return {
    ...payload,
  };
}

export default collectionCreate;
