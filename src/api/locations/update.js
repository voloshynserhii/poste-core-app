import { api } from '..';

async function locationUpdate(id, payload) {
  const updatedLocation = JSON.stringify(payload);
  
  const res = await api.axios.patch(`${process.env.REACT_APP_API_URL}/api/locations/${id}`, {
    body: updatedLocation,
  });

  return {
    id,
    ...res
  };
}

export default locationUpdate;