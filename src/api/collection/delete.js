import { api } from '..';

async function collectionDeleteByFirebase(collection, id) {
  await api.firebase.database().ref(`${collection}/${id}`).remove();
}

export default collectionDeleteByFirebase;
