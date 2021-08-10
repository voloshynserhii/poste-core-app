import { useEffect, useCallback } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';

import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';
import SaveButton from './SaveButton';
import AppButton from '../../../components/AppButton';

const VALIDATE_FORM_USER = {
  name: {
    type: 'string',
    presence: { allowEmpty: true },
  },
  email: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  password: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  currency: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  country: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  city: {
    type: 'string',
    presence: { allowEmpty: true },
  },
  lang: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  balance: {
    type: 'string',
    presence: { allowEmpty: true },
  },
  bonusBalance: {
    type: 'string',
    presence: { allowEmpty: true },
  },
};

const UserForm = ({ onCancel }) => {
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_USER,
    initialValues: { name: '', email: '', balance: '' },
  });
  const values = formState.values;

  const formUser = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        name: '',
        email: '',
        password: '',
        currency: 'USD',
        country: '',
        city: '',
        lang: 'en_us',
        balance: '0',
        bonusBalance: '0',
      },
    }));
  }, [setFormState]);

  useEffect(() => {
    formUser();
  }, [formUser]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardHeader title="Add User" />
          <CardContent>
            <TextField
              label="Name"
              name="name"
              value={values.name}
              error={fieldHasError('name')}
              helperText={fieldGetError('name') || 'Display name of the User'}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              required
              label="Email"
              name="email"
              value={values.email}
              error={fieldHasError('email')}
              helperText={fieldGetError('email') || 'Display email of the User'}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              required
              label="Password"
              name="password"
              value={values.password}
              error={fieldHasError('password')}
              helperText={fieldGetError('password') || 'Display password of the User'}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              required
              label="Currency"
              name="currency"
              value={values.currency}
              error={fieldHasError('currency')}
              helperText={fieldGetError('currency') || 'Display currency'}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              required
              label="Country"
              name="country"
              value={values.country}
              error={fieldHasError('country')}
              helperText={fieldGetError('country') || 'Display country of the User'}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              label="City"
              name="city"
              value={values.city}
              error={fieldHasError('city')}
              helperText={fieldGetError('city') || 'Display city of the User'}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              required
              label="Language"
              name="lang"
              value={values.lang}
              error={fieldHasError('lang')}
              helperText={fieldGetError('lang') || 'Display language of the User'}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              label="Balance"
              name="balance"
              value={values.balance}
              error={fieldHasError('balance')}
              helperText={fieldGetError('balance') || 'Balance of the User account '}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              label="Bonus balance"
              name="bonusBalance"
              value={values.bonusBalance}
              error={fieldHasError('bonusBalance')}
              helperText={fieldGetError('bonusBalance') || 'Bonus balance on the User account'}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <Grid container justifyContent="center" alignItems="center">
              <AppButton onClick={onCancel}>Cancel</AppButton>
              <SaveButton collection="users" disabled={!formState.isValid} payload={formState.values}>
                Save User
              </SaveButton>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
export default UserForm;
