import PropTypes from 'prop-types';
import { SvgIcon } from '@material-ui/core';
// SVG assets
import { ReactComponent as LogoIcon } from './logo.svg';
// Material Icons
import DefaultIcon from '@material-ui/icons/MoreHoriz';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import DayNightIcon from '@material-ui/icons/Brightness4';
import NightIcon from '@material-ui/icons/Brightness3';
import DayIcon from '@material-ui/icons/Brightness5';
import InfoIcon from '@material-ui/icons/Info';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import CategoryIcon from '@material-ui/icons/Category';
import BusinessIcon from '@material-ui/icons/Business';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import StorageIcon from '@material-ui/icons/Storage';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import EventNoteIcon from '@material-ui/icons/EventNote';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import PeopleIcon from '@material-ui/icons/People';

/**
 * How to use:
 * 1. Import all required MUI or other SVG icons into this file.
 * 2. Add icons with "unique lowercase names" into ICONS object.
 * 3. Use icons everywhere in the App by their names in <AppIcon name="xxx" /> component
 * Important: properties of ICONS object MUST be lowercase!
 * Note: You can use camelCase or UPPERCASE in the <AppIcon name="someIconByName" /> component
 */
const ICONS = {
  default: DefaultIcon,
  // logo: () => (
  //   <SvgIcon>
  //     <LogoIcon />
  //   </SvgIcon>
  // ),
  logo: () => (
    <img src="favicon/ms-icon-310x310.png" alt="logo-icon" style={{height: 40, width: 40}} />
  ),
  close: CloseIcon,
  dots: MoreVertIcon,
  menu: MenuIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  settings: SettingsIcon,
  logout: ExitToAppIcon,
  visibilityon: VisibilityIcon,
  visibilityoff: VisibilityOffIcon,
  notifications: NotificationsIcon,
  filter: FilterListIcon,
  smile: InsertEmoticonIcon,
  account: AccountCircle,
  search: SearchIcon,
  daynight: DayNightIcon,
  night: NightIcon,
  day: DayIcon,
  info: InfoIcon,
  signup: PersonAddIcon,
  login: PersonIcon,
  category: CategoryIcon,
  provider: BusinessIcon,
  home: HomeIcon,
  game: SportsEsportsIcon,
  data: StorageIcon,
  route: CallSplitIcon,
  tracking: EventNoteIcon,
  shipping: LocalShippingIcon,
  people: PeopleIcon
};

/**
 * Renders SVG icon by given Icon name
 * @param {string} [props.name] - name of the Icon to render
 * @param {string} [props.icon] - alternative to .name property
 */
const AppIcon = ({ name, icon, ...restOfProps }) => {
  const iconName = (name || icon || 'default').trim().toLowerCase();
  const ComponentToRender = ICONS[iconName] || DefaultIcon;
  return <ComponentToRender {...restOfProps} />;
};

AppIcon.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
};

export default AppIcon;
