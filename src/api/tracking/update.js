import { api } from "..";

async function collectionUpdate(id, payload) {
  const localUser = localStorage.getItem("userData");
  const user = JSON.parse(localUser);
  const updatedOrder = JSON.stringify(payload);

  const res = await api.axios.patch(
    `${process.env.REACT_APP_API_URL}/api/orders/${id}`,
    {
      order: updatedOrder,
      user,
    }
  );

  return res;
}

export default collectionUpdate;
