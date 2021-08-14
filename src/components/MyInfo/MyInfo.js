import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, Avatar, Typography } from '@material-ui/core';
import { useAppStore } from '../../store';
import { AppLink } from '..';
import { api } from '../../api';
import { loadCurrentUser } from '../../api/auth/utils';

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
 * Renders currently logger User info , with or without Avatar
 * @class MyInfo
 * @param {string} [className] - optional className for <div> tag
 * @param {boolean} [showAvatar] - user's avatar picture is shown when true
 */
const MyInfo = ({ className, showAvatar = false, ...restOfProps }) => {
  const classes = useStyles();
  const [user, setUser] = useState(loadCurrentUser());
  const [state, dispatch] = useAppStore();

  // Update current user info form API
  useEffect(() => {
    async function fetchCurrentUserInfo() {
      let { currentUser } = state;
      if (!currentUser) {
        currentUser = await api?.info?.me();
        if (currentUser) {
          // Update global store only if the data successfully fetched, otherwise we may have infinity loop of api calls
          dispatch({ type: 'CURRENT_USER', currentUser });
        }
      }
      setUser(currentUser);
    }
    fetchCurrentUserInfo();
    return () => {
      setUser(undefined); // Cleanup when component is/will not mounted
    };
  }, [state, dispatch]);

  const fullName = user?.name?.trim() || [user?.nameFirst || '', user?.nameLast || ''].join(' ').trim();
  const srcAvatar = user?.avatar ? user?.avatar : undefined;
  const userPhoneOrEmail = user?.phone || user?.email || 'Email address is hidden';

  return (
    <div {...restOfProps} className={clsx(classes.root, className)}>
      {showAvatar ? (
        <AppLink to="/me" underline="none">
          <Avatar alt={fullName || 'My Avatar'} className={classes.avatar} src={srcAvatar} />
        </AppLink>
      ) : null}
      <Typography className={classes.name} variant="h6">
        {fullName || 'Current User'}
      </Typography>
      <Typography variant="body2">{userPhoneOrEmail || 'Loading...'}</Typography>
    </div>
  );
};

MyInfo.propTypes = {
  className: PropTypes.string,
  showAvatar: PropTypes.bool,
};

export default MyInfo;
