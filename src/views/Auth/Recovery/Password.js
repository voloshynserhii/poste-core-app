import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';
import api from '../../../api';
import { AppButton } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';
import { useFormStyles } from '../../styles';

const VALIDATE_FORM_RECOVERY_PASSWORD = {
  email: {
    presence: true,
    email: true,
  },
};

/**
 * Renders "Recover Password" view for Login flow
 * url: /auth/recovery/password
 * @param {string} [props.email] - pre-populated email in case the user already enters it
 */
const LoginEmailView = ({ email = '' }) => {
  const classes = useFormStyles();
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_RECOVERY_PASSWORD,
    initialValues: { email },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    log.info('onSubmit() - formState.values:', formState.values);

    await api.auth.recover(formState.values);
    //TODO: Show message with instructions for the user
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Recover Password" />
            <CardContent>
              <TextField
                required
                label="Email"
                name="email"
                value={formState.values.email}
                error={fieldHasError('email')}
                helperText={fieldGetError('email') || ' ' /*|| 'Enter email address'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <Grid container justifyContent="center" alignItems="center">
                <AppButton type="submit" disabled={!formState.isValid}>
                  Send Password Recovery Email
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginEmailView;
