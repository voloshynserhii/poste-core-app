import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { buttonStylesByNames } from '../../utils/styles';
import AppIcon from '../AppIcon';

const useStyles = makeStyles((theme) => ({
  // Add styles for Material UI names 'primary', 'secondary', 'warning', and so on
  ...buttonStylesByNames(theme),
}));

function getValidMuiColor(color) {
  if (color && ['inherit', 'primary', 'secondary', 'default'].includes(color)) {
    return color;
  } else {
    return undefined;
  }
}

/**
 * Renders Material UI IconButton with SVG icon by given Name
 * @param {string} [props.icon] - name of Icon to render inside the IconButton
 */
const AppIconButton = ({ color, className, children, icon, title, ...restOfProps }) => {
  const classes = useStyles();
  const classButton = clsx(classes[color], className);
  const colorButton = getValidMuiColor(color);

  const renderIcon = () => (
    <IconButton className={classButton} color={colorButton} {...restOfProps}>
      <AppIcon icon={icon} />
      {children}
    </IconButton>
  );

  return title ? <Tooltip title={title}>{renderIcon()}</Tooltip> : renderIcon();
};

AppIconButton.propTypes = {
  icon: PropTypes.string,
};

export default AppIconButton;
