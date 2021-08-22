import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppLink from '../AppLink';
import api from '../../api';
import { useAppStore } from '../../store';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content',
  },
  avatar: {
    width: 64,
    height: 64,
    fontSize: '3rem',
  },
  name: {
    marginTop: theme.spacing(1),
  },
}));

/**
 * Renders User profile info
 * @param {string} [className] - optional className for <div> tag
 * @param {boolean} [showAvatar] - user's avatar picture is shown when true
 * @param {object} [user] - logged user data {name, email, avatar...}
 */
const UserInfo = ({ className, showAvatar = false, user: propsUser, ...restOfProps }) => {
  const classes = useStyles();
  const [user, setUser] = useState(propsUser);
  const [state, dispatch] = useAppStore();

  useEffect(() => {
    async function fetchCurrentUserInfo() {
      let { currentUser } = state;
      if (!currentUser) {
        currentUser = await api.info.me();
        if (currentUser) {
          // Update global store only if the data successfully fetched, otherwise we may have infinity loop of api calls
          dispatch({ type: 'SET_CURRENT_USER', currentUser });
        }
      }
      setUser(currentUser);
    }
    fetchCurrentUserInfo();
    return () => {
      setUser(null); // Cleanup when component is/will not mounted
    };
  }, [state, dispatch]);

  const fullName = user?.name?.trim() || [user?.nameFirst || '', user?.nameLast || ''].join(' ').trim();
  const srcAvatar = user?.avatar ? `${process.env.REACT_APP_API}/assets/${user?.avatar}` : undefined;

  return (
    <div {...restOfProps} className={clsx(classes.root, className)}>
      {showAvatar ? (
        <AppLink to="/user" underline="none">
          <Avatar alt={fullName || 'User Avatar'} className={classes.avatar} src={srcAvatar} />
        </AppLink>
      ) : null}
      <Typography className={classes.name} variant="h6">
        {user || 'Dispatcher'}
      </Typography>
    </div>
  );
};

UserInfo.propTypes = {
  className: PropTypes.string,
  showAvatar: PropTypes.bool,
  // user: PropTypes.shape({
  //   name: PropTypes.string,
  //   nameFirst: PropTypes.string,
  //   nameLast: PropTypes.string,
  //   avatar: PropTypes.string,
  //   email: PropTypes.string,
  //   phone: PropTypes.string,
  // }),
};

export default UserInfo;
