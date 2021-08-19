import { api } from '..';

async function collectionUpdateByFirebase(collection, id, payload) {
  delete payload.id;
  await api.firebase.database().ref(`/${collection}/${id}`).update(payload);
  return {
    id,
    ...payload,
  };
}

export default collectionUpdateByFirebase;