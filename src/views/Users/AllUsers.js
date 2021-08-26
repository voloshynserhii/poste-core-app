import React, { useState, useEffect } from "react";
import { LinearProgress } from "@material-ui/core";

import AppButton from "../../components/AppButton";
import api from "../../api";

const AllUsersView = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [addUser, setAddUser] = useState(false);

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

  const handleAddUser = () => {
    setAddUser(true);
  };
  
  if (loading) return <LinearProgress />;

  return (
    <div>
      {users?.map((user, index) => (
        <div key={user._id}>
          <span> {index + 1}. </span>
          <span>{user.name}</span>
        </div>
      ))}
      <AppButton color="success" onClick={handleAddUser}>
        Add User
      </AppButton>
    </div>
  );
};
export default AllUsersView;
