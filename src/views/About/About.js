import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useSnackbar } from 'notistack';
import { AppButton, AppAlert, AppLink, AppSection } from '../../components';
import AppSnackBar from '../../components/AppSnackBar';
import ButtonsSection from '../Sections/Buttons';
import TagsSection from '../Sections/Tags';
import DialogsSection from '../Sections/Dialogs';

/**
 * Renders "About" page
 * url: /about
 */
const AboutView = () => {
  const [snackbars, setSnackbars] = useState({
    info: false,
    success: false,
    error: false,
  });
  const [multiSnackbarCount, setMultiSnackbarCount] = useState(1);

  const { enqueueSnackbar /*, closeSnackbar*/ } = useSnackbar();

  const handleSnackBarShow = (name) => {
    setSnackbars({ ...snackbars, [name]: true });
  };

  const handleSnackBarHide = (name) => {
    setSnackbars({ ...snackbars, [name]: false });
  };

  const handleMultiSnackbarClick = () => {
    enqueueSnackbar('Multi SnackBar #' + multiSnackbarCount, {
      variant: ['info', 'success', 'warning', 'error'][Math.trunc(Math.random() * 4)],
    });
    setMultiSnackbarCount((value) => value + 1);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <AppSection title="Application">
          <p>
            This <AppLink href="https://reactjs.org/">React</AppLink> application is built using{' '}
            <AppLink href="https://material-ui.com/">Material UI</AppLink> components.
          </p>
        </AppSection>
      </Grid>

      <Grid item xs={12}>
        <ButtonsSection />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TagsSection />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TagsSection useTagCloud />
      </Grid>

      <Grid item xs={12}>
        <DialogsSection />
      </Grid>

      <Grid item xs={12} sm={6}>
        <AppSection title="Alerts">
          <AppAlert>severity="error" by default</AppAlert>
          <AppAlert severity="warning">severity="warning"</AppAlert>
          <AppAlert severity="info">severity="info"</AppAlert>
          <AppAlert severity="success">severity="success"</AppAlert>
        </AppSection>
      </Grid>

      <Grid item xs={12} sm={6}>
        <AppSection title="SnackBars">
          <Grid container justifyContent="center">
            <AppSnackBar autoOpen message={'By default the SnackBar shown for 5 seconds only'} />

            <AppButton label="Show Info SnackBar" onClick={() => handleSnackBarShow('info')} />
            <AppSnackBar key="1" open={snackbars.info} severity="info" onClose={() => handleSnackBarHide('info')}>
              SnackBar with severity="info"
            </AppSnackBar>

            <AppButton label="Show Success SnackBar" onClick={() => handleSnackBarShow('success')} />
            <AppSnackBar
              key="2"
              open={snackbars.success}
              severity="success"
              onClose={() => handleSnackBarHide('success')}
            >
              SnackBar with severity="success"
            </AppSnackBar>

            <AppButton label="Show Error SnackBar" onClick={() => handleSnackBarShow('error')} />
            <AppSnackBar
              key="3"
              open={snackbars.error}
              severity="error"
              autoHideDuration={null}
              onClose={() => handleSnackBarHide('error')}
            >
              SnackBar with severity="error" visible until user clicks on [X] button
            </AppSnackBar>

            <AppButton label="Multi SnackBar (Click few times)" onClick={handleMultiSnackbarClick} />
          </Grid>
        </AppSection>
      </Grid>
    </Grid>
  );
};

export default AboutView;
