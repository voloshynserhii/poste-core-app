import { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, LinearProgress, MenuItem } from '@material-ui/core';

import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import AppAlert from '../../components/AppAlert';
import AppButton from '../../components/AppButton';
import ChangeBalanceForm from './components/ChangeBalanceForm';

import USERS, { languages } from './utils';

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

const SingleUserView = () => {
  const history = useHistory();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [change, setChange] = useState(false);
  const [lang, setLang] = useState([]);
  const [disabledName, setDisabledName] = useState(true);
  const [disabledPassword, setDisabledPassword] = useState(true);
  const [disabledLang, setDisabledLang] = useState(true);
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
        const res = USERS.find((item) => item.id === id);
        if (res) {
          setFormState((oldFormState) => ({
            ...oldFormState,
            values: {
              ...oldFormState.values,
              name: res?.name || '',
              email: res?.email || '',
              password: res?.password || '',
              currency: res?.currency || '',
              country: res?.country || '',
              city: res?.city || '',
              lang: res?.lang || '',
              balance: res?.balance || '',
              bonusBalance: res?.bonusBalance || '',
            },
          }));
        } else if (id === 'create-users') {
          setError(null);
        } else {
          setError(`User id: "${id}" not found`);
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
    setLang(() => {
      return [{ value: values.lang, label: values.lang }, ...languages];
    });
  }, [fetchUserById, id, values.lang]);

  const onAlertClose = useCallback(() => {
    setError('');
    history.replace('/tracking');
  }, [history]);

  const handleChangeBalance = () => {
    setChange(true);
  };
  const handleCancel = () => {
    history.replace('/tracking');
  };
  
  const handleSave = useCallback(
    (name, password, lang) => {
      const user = USERS.find((item) => item.id === id);
      const index = USERS.indexOf(user);
      USERS.splice(index, 1);
      const newUser = { ...user, name, password, lang };
      USERS.push(newUser);
      alert('User was saved successfully');
      history.push('/tracking');
    },
    [history, id]
  );

  if (loading) return <LinearProgress />;

  if (change) return <ChangeBalanceForm onCancel={() => setChange(false)} />;
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
            <CardHeader title="User Details" />
            <CardContent>
              <div style={{ display: 'flex' }}>
                <TextField
                  disabled={disabledName}
                  required
                  label="Name editable"
                  name="name"
                  value={values.name}
                  error={fieldHasError('name')}
                  helperText={fieldGetError('name') || 'Display name of the User'}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                />
                <AppButton 
                style={{ height: 50, marginTop: 10 }} 
                color={disabledName ? 'error' : 'secondary'}
                onClick={() => setDisabledName((prev) => !prev)}
                >
                  {disabledName ? 'Change' : 'Confirm'}
                </AppButton>
              </div>
              <TextField
                disabled
                required
                label="Email"
                name="email"
                value={values.email}
                error={fieldHasError('email')}
                helperText={fieldGetError('email') || 'Display email of the User'}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <div style={{ display: 'flex' }}>
                <TextField
                  disabled={disabledPassword}
                  required
                  label="Password"
                  name="password"
                  value={values.password}
                  error={fieldHasError('password')}
                  helperText={fieldGetError('password') || 'Display password of the User'}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                />
                <AppButton 
                style={{ height: 50, marginTop: 10 }} 
                color={disabledPassword ? 'error' : 'secondary'}
                onClick={() => setDisabledPassword((prev) => !prev)}
                >
                  {disabledPassword ? 'Change' : 'Confirm'}
                </AppButton>
              </div>
              <TextField
                disabled
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
                disabled
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
                disabled
                label="City"
                name="city"
                value={values.city}
                error={fieldHasError('city')}
                helperText={fieldGetError('city') || 'Display city of the User'}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <div style={{ display: 'flex' }}>
                <TextField
                  select
                  disabled={disabledLang}
                  required
                  label="Language"
                  name="lang"
                  value={values.lang}
                  defaultValue={values.lang}
                  error={fieldHasError('lang')}
                  helperText={fieldGetError('lang') || 'Display language of the User'}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                >
                  {lang.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <AppButton
                  style={{ height: 50, marginTop: 10 }}
                  color={disabledLang ? 'error' : 'secondary'}
                  onClick={() => setDisabledLang((prev) => !prev)}
                >
                  {disabledLang ? 'Change' : 'Confirm'}
                </AppButton>
              </div>
              <TextField
                disabled
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
                disabled
                required
                label="BonusBalance"
                name="bonusBalance"
                value={values.bonusBalance}
                error={fieldHasError('bonusBalance')}
                helperText={fieldGetError('bonusBalance') || 'Balance of the User account'}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
              <Grid container justifyContent="center" alignItems="center">
                <AppButton color="primary" onClick={() => handleSave(values.name, values.password, values.lang)}>
                  Save
                </AppButton>
                <AppButton onClick={handleCancel}>Cancel</AppButton>
                <AppButton color="error" id={params.id} payload={values} onClick={handleChangeBalance}>
                  Change Balance
                </AppButton>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default SingleUserView;
