import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import AppIcon from '../AppIcon';
import SideBarLink from './SideBarLink';
import { PropTypeSideBarItems } from './utils';

const useStyles = makeStyles((theme) => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    // color: theme.palette.button,
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    // fontWeight: theme.typography.fontWeightMedium,
    flexGrow: 1,
  },
  iconOrMargin: {
    // color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
}));

/**
 * Renders list of Navigation Items inside SideBar
 * @param {string} [prop.className] - optional className for <div> tag
 * @param {array} props.items - list of objects to render as navigation links
 * @param {boolean} [props.showIcons] - icons in links are visible when true
 * @param {func} [props.afterLinkClink] - optional callback called when some link was clicked
 */
const SideBarNavigation = ({ className, items, showIcons = false, afterLinkClick, ...restOfProps }) => {
  const classes = useStyles();
  const classRoot = clsx(classes.root, className);
  return (
    <nav>
      <List className={classRoot} {...restOfProps}>
        {items.map((link) => (
          <ListItem key={`${link.title}-${link.href}`} className={classes.item} disableGutters>
            <Button className={classes.button} component={SideBarLink} to={link.href} onClick={afterLinkClick}>
              <div className={classes.iconOrMargin}>{showIcons && link.icon ? <AppIcon icon={link.icon} /> : null}</div>
              {link.title}
            </Button>
          </ListItem>
        ))}
      </List>
    </nav>
  );
};

SideBarNavigation.propTypes = {
  className: PropTypes.string,
  items: PropTypeSideBarItems.isRequired,
  showIcons: PropTypes.bool,
  afterLinkClink: PropTypes.func,
};

export default SideBarNavigation;
