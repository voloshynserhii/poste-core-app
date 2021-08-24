import { useCallback, useState } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent, InputAdornment } from '@material-ui/core';
import api from '../../../api';
import { useAppStore } from '../../../store';
import { AppButton, AppLink, AppIconButton } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';
import { useFormStyles } from '../../styles';

const VALIDATE_FORM_LOGIN_EMAIL = {
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
    length: {
      minimum: 8,
      maximum: 32,
      message: 'must be between 8 and 32 characters',
    },
  },
};

/**
 * Renders Email view for Login flow
 * url: /auth/login/email/*
 */
const LoginEmailView = () => {
  const classes = useFormStyles();
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_LOGIN_EMAIL,
    initialValues: { email: '', password: '' },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [, dispatch] = useAppStore();
  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      log.debug('process.env.REACT_APP_MULTIPASS:', process.env.REACT_APP_MULTIPASS);
      const result = await api.auth.login(formState.values);
      if (result.error) {
        const message = result.error?.message?.replaceAll('_', ' ');
        alert(message);
        return;
      }
      dispatch({ type: 'LOG_IN' });
    },
    [dispatch, formState.values]
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Login with Email" />
            <CardContent>
              <TextField
                required
                label="Email"
                name="email"
                // value={(formState.values as FormStateValues)['email']}
                value={formState.values.email}
                error={fieldHasError('email')}
                helperText={fieldGetError('email') || ' ' /*|| 'Enter email address'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                type={showPassword ? 'text' : 'password'}
                label="Password"
                name="password"
                // value={(formState.values as FormStateValues)['password']}
                value={formState.values.password}
                error={fieldHasError('password')}
                helperText={fieldGetError('password') || ' ' /*|| 'Enter password'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AppIconButton
                        aria-label="toggle password visibility"
                        icon={showPassword ? 'visibilityon' : 'visibilityoff'}
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                        onClick={handleShowPasswordClick}
                        onMouseDown={eventPreventDefault}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Grid container justifyContent="center" alignItems="center">
                <AppButton type="submit" disabled={!formState.isValid}>
                  Login with Email
                </AppButton>
                <AppButton variant="text" component={AppLink} to="/auth/recovery/password">
                  Forgot Password?
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
