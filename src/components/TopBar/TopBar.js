import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppIconButton from '../AppIconButton';

const useStyles = makeStyles((theme) => ({
  root: {
    //boxShadow: 'none',
    minWidth: '20rem',
  },
  toolbar: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  logo: {
    height: theme.spacing(4),
  },
  title: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    flexGrow: 1,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  buttons: {},
}));

/**
 * Renders TopBar for Logged and Anonymous users
 * @param {string} [prop.className] - optional className for <div> tag
 * @param {string} [props.title] - text of title in the middle of TopBar
 * @param {boolean} [props.isAuthenticated] - selector of Logged and Anonymous users
 * @param {func} [props.onMenu] - called when menu icon or logo is clicked
 * @param {func} [props.onNotifications] - called when notification icon is clicked
 */
const TopBar = ({ className, isAuthenticated, title = '', onMenu, onNotifications, ...restOfProps }) => {
  const classes = useStyles();
  // const iconMenu = isAuthenticated ? 'account' : 'menu';

  return (
    <AppBar {...restOfProps} className={clsx(classes.root, className)} component="div">
      <Toolbar className={classes.toolbar} disableGutters>
        <AppIconButton
          icon="logo"
          // color="primary"
          onClick={onMenu}
        />

        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>

        <div className={classes.buttons}>
          {isAuthenticated && (
            <AppIconButton icon="notifications" color="inherit" title="User Notifications" onClick={onNotifications} />
          )}
          {/* <AppIconButton icon={iconMenu} color="inherit" title="Open Menu" onClick={onMenu} /> */}
        </div>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  onMenu: PropTypes.func,
  onNotifications: PropTypes.func,
};

export default TopBar;
