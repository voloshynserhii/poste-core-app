import { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, LinearProgress } from '@material-ui/core';

import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';
import AppButton from '../../../components/AppButton';
import USERS from '../utils';

const VALIDATE_FORM_USER = {
  balance: {
    type: 'string',
    presence: { allowEmpty: false },
  },
  bonusBalance: {
    type: 'string',
    presence: { allowEmpty: true },
  },
};

const ChangeBalanceForm = ({ onCancel }) => {
  const history = useHistory();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: VALIDATE_FORM_USER,
    initialValues: { balance: 0, bonusBalance: 0 },
  });
  const values = formState.values;
  const id = params?.id;

  const fetchUserById = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const res = USERS.find((item) => item.id === id);
        if (res) {
          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              id: res?.id || id,
              balance: res?.balance || '',
              bonusBalance: res?.bonusBalance || '',
            },
          }));
        }
      } catch (error) {
        log.error(error);
      } finally {
        setLoading(false);
      }
    },
    [setFormState]
  ); // Don't pass formState here !!!

  useEffect(() => {
    fetchUserById(id);
  }, [fetchUserById, id]);

  const handleSave = useCallback(
    (balance, bonusBalance) => {
      const user = USERS.find((item) => item.id === id);
      const index = USERS.indexOf(user);
      USERS.splice(index, 1);
      const newUser = { ...user, balance, bonusBalance };
      USERS.push(newUser);
      alert('Balance was saved successfully');
      history.push('/tracking');
    },
    [history, id]
  );

  if (loading) return <LinearProgress />;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title="Add new balance" />
            <CardContent>
              <TextField
                required
                label="Balance"
                name="balance"
                value={values.balance}
                error={fieldHasError('balance')}
                helperText={fieldGetError('balance') || 'Balance of the User account'}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <TextField
                label="Bonus Balance"
                name="bonusBalance"
                value={values.bonusBalance}
                error={fieldHasError('bonusBalance')}
                helperText={fieldGetError('bonusBalance') || 'Bonus balance of the User account'}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <Grid container justifyContent="center" alignItems="center">
                <AppButton onClick={onCancel}>Cancel</AppButton>
                <AppButton color="primary" onClick={() => handleSave(values.balance, values.bonusBalance)}>
                  Save Balance
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default ChangeBalanceForm;
