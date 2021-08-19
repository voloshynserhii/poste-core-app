import { Grid } from '@material-ui/core';
// import { useAppStore } from '../store';
import { MyInfo } from '../components/MyInfo/';
import AppSection from '../components/AppSection';

/**
 * Renders "Me" aka "My Profile" page
 * url: /me
 */

const MyProfileView = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <AppSection title="My Profile in Database">
          <MyInfo />
        </AppSection>
      </Grid>
    </Grid>
  );
};

export default MyProfileView;
