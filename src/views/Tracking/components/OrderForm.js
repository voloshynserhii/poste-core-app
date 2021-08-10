import { useEffect, useCallback } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';

import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';
import SaveButton from './SaveButton';
import AppButton from '../../../components/AppButton';

const VALIDATE_FORM_ORDER = {
  trackingNumber: {
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
    validationSchema: VALIDATE_FORM_ORDER,
    initialValues: { name: '', email: '', balance: '' },
  });
  const values = formState.values;

  const formOrder = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        trackingNumber: ''
      },
    }));
  }, [setFormState]);

  useEffect(() => {
    formOrder();
  }, [formOrder]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={9}>
        <Card>
          <CardHeader title="Add Order" />
          <CardContent>
            <TextField
              label="Weight"
              name="weight"
              value={values.weight}
              error={fieldHasError('weight')}
              helperText={fieldGetError('weight') || 'Display weight of the order'}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />

            <Grid container justifyContent="center" alignItems="center">
              <AppButton onClick={onCancel}>Cancel</AppButton>
              <SaveButton collection="users" disabled={!formState.isValid} payload={formState.values}>
                Save Order
              </SaveButton>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
export default UserForm;
