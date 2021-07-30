import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { buttonStylesByNames } from '../../utils/styles';

const APP_BUTTON_VARIANT = 'contained'; // | 'text' | 'outlined'

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'inline-block',
  },
  // Add "filled" styles for Material UI names 'primary', 'secondary', 'warning', and so on
  ...buttonStylesByNames(theme),
}));

/**
 * Application styled Material UI Button
 * @class AppButton
 * @param {string} [color] - name of color from Material UI palette 'primary', 'secondary', 'warning', and so on
 * @param {string} [children] - content to render, overrides .label and .text
 * @param {string} [label] - text to render, alternate to .text
 * @param {string} [text] - text to render, alternate to .label
 */
const AppButton = ({
  children,
  className,
  color = 'default',
  label,
  text,
  m = 0,
  mt = 1,
  mb = 1,
  ml = 1,
  mr = 1,
  ...restOfProps
}) => {
  const classes = useStyles();
  const classButton = clsx(classes[color], className);
  return (
    <Box {...{ m, mt, mb, ml, mr }} className={classes.box}>
      <Button className={classButton} variant={APP_BUTTON_VARIANT} {...restOfProps}>
        {children || label || text}
      </Button>
    </Box>
  );
};

export const PropTypesAppButton = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  label: PropTypes.string,
  m: PropTypes.number,
  mt: PropTypes.number,
  mb: PropTypes.number,
  ml: PropTypes.number,
  mr: PropTypes.number,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  text: PropTypes.string,
  onClick: PropTypes.func,
};

AppButton.propTypes = PropTypesAppButton;

export default AppButton;
