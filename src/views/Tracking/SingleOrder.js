import { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, LinearProgress, MenuItem } from '@material-ui/core';

import api from "../../api";
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import AppAlert from '../../components/AppAlert';
import AppButton from '../../components/AppButton';
import SaveButton from '../../components/SaveButton';

import { statuses } from './utils';

const VALIDATE_FORM_USER = {
  trackingNumber: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  weight: {
    type: 'string',
    presence: { allowEmpty: true },
  },
  collectionFrom: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  deliveryTo: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  status: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  submittedBy: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  assignedCurier: {
    type: 'string',
    presence: { allowEmpty: true },
  }
};

const SingleOrderView = () => {
  const history = useHistory();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [change, setChange] = useState(false);
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_USER,
    initialValues: { name: '', email: '', balance: 0 },
  });
  const values = formState.values;
  const id = params?.id;

  const fetchUserById = useCallback(
    async (id) => {
      setLoading(true);
      setError('');
      try {
        const res = await api.orders.read(id);

        if (res) {
          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              trackingNumber: res?.trackingNumber || '',
              weight: res?.weight || '0',
              collectionFrom: res?.collectionData.city || '',
              deliveryTo: res?.deliveryData.city || '',
              status: res?.status || 'Pending'
            },
          }));
        } else {
          setError(`Order id: "${id}" not found`);
        }
      } catch (error) {
        log.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [setFormState]
  ); // Don't pass formState here !!!

  useEffect(() => {
    fetchUserById(id);
  }, [fetchUserById]);

  const onAlertClose = useCallback(() => {
    setError('');
    history.replace('/tracking');
  }, [history]);

  const handleCancel = () => {
    history.replace('/tracking');
  };
  
  // const handleSave = useCallback(
  //   (payload) => {
  //     api.orders.update()
  //     // const user = USERS.find((item) => item.id === id);
  //     // const index = USERS.indexOf(user);
  //     // USERS.splice(index, 1);
  //     // const newUser = { ...user, name, password, lang };
  //     // USERS.push(newUser);
  //     // alert('User was saved successfully');
  //     history.push('/tracking');
  //   },
  //   [history, id]
  // );

  if (loading) return <LinearProgress />;

  return (
    <>
      {Boolean(error) && (
        <AppAlert severity="error" onClose={onAlertClose}>
          {error}
        </AppAlert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={9}>
          <Card>
            <CardHeader title="Order Details" />
            <CardContent>
              <TextField
                disabled
                label="Tracking number"
                name="trackingNumber"
                value={values.trackingNumber}
                error={fieldHasError('trackingNumber')}
                helperText={fieldGetError('trackingNumber') || 'Display order tracking number'}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                label="Weight"
                name="weight"
                value={values.weight}
                error={fieldHasError('weight')}
                helperText={fieldGetError('weight') || 'Display weight of the order'}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                label="Collection From"
                name="collectionFrom"
                value={values.collectionFrom}
                error={fieldHasError('collectionFrom')}
                helperText={fieldGetError('collectionFrom') || 'Display collectionFrom'}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                required
                label="Delivery To"
                name="deliveryTo"
                value={values.deliveryTo}
                error={fieldHasError('deliveryTo')}
                helperText={fieldGetError('deliveryTo') || 'Display deliveryTo'}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
                <TextField
                  select
                  required
                  label="Status"
                  name="status"
                  value={values.status}
                  defaultValue={values.status}
                  error={fieldHasError('status')}
                  helperText={fieldGetError('status') || 'Display status of the Order'}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                >
                  {statuses.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              <Grid container justifycontent="center" alignItems="center">
                <AppButton onClick={handleCancel}>Cancel</AppButton>
                <SaveButton collection="orders" color="primary" id={id} payload={formState.values}>Save</SaveButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default SingleOrderView;
