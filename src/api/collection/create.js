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

export default collectionCreateByFirebase;
