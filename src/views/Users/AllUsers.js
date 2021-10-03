import React, { useState, useEffect, useContext } from "react";
import { LinearProgress, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { AppContext } from "../../store";
import api from "../../api";
import AppButton from "../../components/AppButton";
import RegisterUserForm from "./components/RegisterUserForm";
import UsersTable from "./components/UsersTable";

const AllUsersView = () => {
  const [loading, setLoading] = useState(true);
  const [addUser, setAddUser] = useState(false);
  const [state, dispatch] = useContext(AppContext);

  useEffect(() => {
    if (state.users.length) {
      setLoading(false);
    } else {
      async function fetchData() {
        const res = await api.users.read(); // List of All users
        if (res) {
          dispatch({ type: "SET_USERS", users: res });
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [dispatch, state.users.length]);

  const handleCloseForm = () => {
    setAddUser(false);
  };

  const handleAddUser = () => {
    setAddUser(true);
  };
  
  const userRoles = ["dispatcher", "admin", "driver"];
  
  if (loading) return <LinearProgress />;

  return (
    <div>
      {addUser && <RegisterUserForm onCancel={handleCloseForm} />}
      <Autocomplete
        id="userRoles"
        options={userRoles}
        getOptionLabel={(option) => option}
        style={{ width: "100%" }}
        renderInput={(params) => (
          <TextField {...params} label="Choose user role" variant="outlined" />
        )}
      />
      <UsersTable data={state.users} />
      <AppButton color="success" onClick={handleAddUser}>
        Add User
      </AppButton>
    </div>
  );
};
export default AllUsersView;
