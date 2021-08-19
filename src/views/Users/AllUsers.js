import React, { useState, useEffect } from 'react';
import { LinearProgress, Grid } from '@material-ui/core';

import UsersTable from './components/UsersTable';
import AddButton from './components/AddButton';
import UserForm from './components/UserForm';
import USERS from './utils';

const AllOperatorsView = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [addUser, setAddUser] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setUsers(USERS);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleAddUser = () => {
    setAddUser(true);
  };

  const handleCloseForm = () => {
    setAddUser(false);
  };

  if (loading) return <LinearProgress />;

  if (addUser) return <UserForm onCancel={handleCloseForm} />;

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <UsersTable data={users} />
        </Grid>
      </Grid>
      <AddButton collection="users" onClick={handleAddUser}>
        Add User
      </AddButton>
    </>
  );
};
export default AllOperatorsView;
