import React, { useState, useEffect } from "react";
import { LinearProgress } from "@material-ui/core";

import api from "../../api";

const AllOrdersView = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await api.users.read(); // List of All users
      if (res) {
        setUsers(res);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LinearProgress />;

  return (
    <div>
      {users?.map((user, index) => (
        <div>
          <span> {index + 1}. </span>
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  );
};
export default AllOrdersView;
