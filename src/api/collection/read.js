import { api } from '../';

async function collectionReadManyByFirebase(collection) {
  const ref = await api.firebase.database().ref(collection);
  const snapshot = await ref.get();
  const data = await snapshot.val();
  if (!data) return [];
  const result = Object.keys(data).map((item) => ({ id: item, ...data[item] }));
  return result;
}

async function collectionReadOneByFirebase(collection, id) {
  const ref = await api.firebase.database().ref(`${collection}/${id}`);
  const snapshot = await ref.get();
  const data = await snapshot.val();
  if (!data) return undefined;
  return {
    id,
    ...data,
  };
}
async function collectionReadOneOrMany(collection, id) {
  if (id) {
    return collectionReadOneByFirebase(collection, id);
  } else {
    return collectionReadManyByFirebase(collection);
  }
}

export default collectionReadOneOrMany;
