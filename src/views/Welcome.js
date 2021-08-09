import React from 'react';
import Grid from '@material-ui/core/Grid';
import { FinalMessage } from '../components';

/**
 * Renders Welcome page/view
 * Url: /welcome and /
 */
const Welcome = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FinalMessage title="Welcome to Admin Panel"></FinalMessage>
      </Grid>
    </Grid>
  );
};

export default Welcome;
