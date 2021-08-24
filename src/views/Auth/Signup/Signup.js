import { useCallback, useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from '@material-ui/core';
import api from '../../../api';
import { useAppStore } from '../../../store';
import { AppButton, AppIconButton, AppLink } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, VALIDATION_PHONE, eventPreventDefault } from '../../../utils/form';
import { useHistory } from 'react-router-dom';
import { useFormStyles } from '../../styles';

const VALIDATE_FORM_SIGNUP = {
  nameFirst: {
    type: 'string',
  },
  nameLast: {
    type: 'string',
  },
  email: {
    presence: true,
    email: true,
  },
  phone: VALIDATION_PHONE,
  password: {
    presence: true,
    length: {
      minimum: 8,
      maximum: 32,
      message: 'must be between 8 and 32 characters',
    },
  },
};

const VALIDATE_EXTENSION = {
  confirmPassword: {
    equality: 'password',
  },
};

/**
 * Renders Signup Form view
 * url: /auth/signup/*
 */
const SignupView = () => {
  const classes = useFormStyles();
  const [state, dispatch] = useAppStore();
  const [validationSchema, setValidationSchema] = useState({
    ...VALIDATE_FORM_SIGNUP,
    ...VALIDATE_EXTENSION,
  });
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: validationSchema, // the state value, so could be changed in time
    initialValues: {
      nameFirst: '',
      nameLast: '',
      email: '',
      phone: state.verifiedPhone,
      password: '',
      confirmPassword: '',
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const history = useHistory();

  useEffect(() => {
    let newSchema;
    if (showPassword) {
      newSchema = VALIDATE_FORM_SIGNUP; // Validation without .confirmPassword
    } else {
      newSchema = { ...VALIDATE_FORM_SIGNUP, ...VALIDATE_EXTENSION }; // Full validation
    }
    setValidationSchema(newSchema);
  }, [showPassword, history, state.verifiedPhone]);

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleAgreeClick = useCallback(() => {
    setAgree((oldValue) => !oldValue);
  }, []);

  const handleFormSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      log.info('onSubmit() - formState.values:', formState.values);

      const result = await api.auth.signup(formState.values);
      // console.warn('api.auth.signup() - result:', result);
      if (!result) return; // Unsuccessful signup

      dispatch({ type: 'SIGN_UP' });
    },
    [dispatch, formState.values]
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.formBody}>
          <Card>
            <CardHeader title="Sign Up - Personal data" />
            <CardContent>
              <TextField
                autoFocus
                label="First Name"
                name="nameFirst"
                value={formState.values.nameFirst}
                error={fieldHasError('nameFirst')}
                helperText={fieldGetError('nameFirst') || ' ' /*|| 'Enter your first name'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Last Name"
                name="nameLast"
                value={formState.values.nameLast}
                error={fieldHasError('nameLast')}
                helperText={fieldGetError('nameLast') || ' ' /*|| 'Enter your last name'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Phone"
                name="phone"
                value={formState.values.phone}
                error={fieldHasError('phone')}
                helperText={fieldGetError('phone') || ' ' /*|| 'Enter mobile phone number'*/}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
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
              <TextField
                required
                type={showPassword ? 'text' : 'password'}
                label="Password"
                name="password"
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
              {!showPassword && (
                <TextField
                  required
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formState.values.confirmPassword}
                  error={fieldHasError('confirmPassword')}
                  helperText={fieldGetError('confirmPassword') || ' ' /*|| 'Re-enter password'*/}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                />
              )}
              <FormControlLabel
                control={<Checkbox required name="agree" checked={agree} onChange={handleAgreeClick} />}
                label={
                  <>
                    You must agree with{' '}
                    <AppLink to="/legal/terms" openInNewTab>
                      Terms of Use
                    </AppLink>{' '}
                    and{' '}
                    <AppLink to="/legal/privacy" openInNewTab>
                      Privacy Policy
                    </AppLink>{' '}
                    to use our service *
                  </>
                }
              />
              <Grid container Content="center" alignItems="center">
                <AppButton type="submit" disabled={!(formState.isValid && agree)}>
                  Confirm and Sign Up
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default SignupView;
