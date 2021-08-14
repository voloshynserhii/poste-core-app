import { useEffect, useCallback } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent } from '@material-ui/core';

import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';
import SaveButton from './SaveButton';
import AppButton from '../../../components/AppButton';

const VALIDATE_FORM_ORDER = {
  weight: {
    type: 'string',
    presence: { allowEmpty: true },
  }
};

const OrderForm = ({ onCancel }) => {
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_ORDER,
    initialValues: { weight: '' },
  });
  const values = formState.values;

  const formOrder = useCallback(() => {
    setFormState((oldFormState) => ({
      ...oldFormState,
      values: {
        ...oldFormState.values,
        weight: ''
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
export default OrderForm;
