import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';

const APP_ALERT_SEVERITY = 'info'; // 'error' | 'info'| 'success' | 'warning'
const APP_ALERT_VARIANT = 'standard'; // 'filled' | 'outlined' | 'standard'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

/**
 * Application styled Alert component
 * @param {string} [className] - optional CSS class for styling
 * @param {string} [color] - color schema of Alert view: 'error' | 'info'| 'success' | 'warning'
 * @param {string} [severity] - color schema and icon of Alert view: 'error' | 'info'| 'success' | 'warning'
 * @param {string} [variant] - variant of Alert view: 'filled' | 'outlined' | 'standard'
 * @param {function} [onClose] - called when X button clicked
 */
const AppAlert = ({
  className,
  severity = APP_ALERT_SEVERITY,
  variant = APP_ALERT_VARIANT,
  onClose,
  ...restOfProps
}) => {
  const classes = useStyles();
  const classRoot = clsx(classes.root, className);

  return <MuiAlert className={classRoot} severity={severity} variant={variant} onClose={onClose} {...restOfProps} />;
};

AppAlert.propTypes = {
  className: PropTypes.string,
  severity: PropTypes.string,
  variant: PropTypes.string,
  onClose: PropTypes.func,
};

export default AppAlert;
