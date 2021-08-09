import { useState, useCallback, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, useMediaQuery } from '@material-ui/core';
import { useAppStore } from '../../store';
import { ErrorBoundary } from '../../components';
import SideBar, { SIDEBAR_WIDTH } from '../../components/SideBar';
import TopBar from '../../components/TopBar';
import { TITLE_PRIVATE } from '../../consts';

const MOBILE_SIDEBAR_ANCHOR = 'left'; // 'right';
const DESKTOP_SIDEBAR_ANCHOR = 'left'; // 'right';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh', // Full screen height
    paddingTop: 56,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 64,
    },
  },
  header: {},
  shiftContent: {
    paddingLeft: DESKTOP_SIDEBAR_ANCHOR.includes('left') ? SIDEBAR_WIDTH : 0,
    paddingRight: DESKTOP_SIDEBAR_ANCHOR.includes('right') ? SIDEBAR_WIDTH : 0,
  },
  content: {
    flexGrow: 1, // Takes all possible space
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  footer: {},
}));

/**
 * Centralized place in the App to update document.title
 */

function updateDocumentTitle(title = '') {
  if (title) {
    document.title = `${title} - ${TITLE_PRIVATE}`;
  } else {
    document.title = TITLE_PRIVATE;
  }
  return document.title;
}

/**
 * "Link to Page" items in Sidebar
 */
const SIDE_BAR_PRIVATE_ITEMS = [
  {
    title: 'Home',
    href: '/',
    icon: 'home',
  },
  {
    title: 'Tracking',
    href: '/tracking',
    icon: 'game',
  },
  // {
  //   title: 'Operators',
  //   href: '/operator',
  //   icon: 'smile',
  // },
  // {
  //   title: 'Providers',
  //   href: '/provider',
  //   icon: 'provider',
  // },
  // {
  //   title: 'Categories',
  //   href: '/category',
  //   icon: 'category',
  // },
  {
    title: 'Profile',
    href: '/user',
    icon: 'account',
  },

  // {
  //   title: 'About',
  //   href: '/about',
  //   icon: 'info',
  // },
];

/**
 * Renders "Private Layout" composition for logger user
 */
const PrivateLayout = ({ children }) => {
  const [state] = useAppStore();
  const [openSideBar, setOpenSideBar] = useState(false);
  const [title, setTitle] = useState('');
  const theme = useTheme();
  const classes = useStyles();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), { defaultMatches: true });
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // Track location changes
    const currentItem = SIDE_BAR_PRIVATE_ITEMS.find((item) => item.href === location.pathname);
    const newTitle = currentItem?.title || '';
    // log.info('location changed:', location, currentItem, newTitle);
    updateDocumentTitle(newTitle);
    setTitle(newTitle);
  }, [location]);

  const handleLogoClick = useCallback(() => {
    // Navigate to '/' when clicking on Logo/Menu icon when the SideBar is already visible
    history.push('/');
  }, [history]);

  const handleSideBarOpen = useCallback(() => {
    if (!openSideBar) setOpenSideBar(true);
  }, [openSideBar]);

  const handleSideBarClose = useCallback(() => {
    if (openSideBar) setOpenSideBar(false);
  }, [openSideBar]);

  const classRoot = clsx({
    [classes.root]: true,
    [classes.shiftContent]: isDesktop,
  });
  const shouldOpenSideBar = isDesktop ? true : openSideBar;

  return (
    <Grid container direction="column" className={classRoot}>
      <Grid item className={classes.header} component="header">
        <TopBar
          isAuthenticated={state.isAuthenticated}
          title={title}
          onMenu={shouldOpenSideBar ? handleLogoClick : handleSideBarOpen}
        />

        <SideBar
          anchor={isDesktop ? DESKTOP_SIDEBAR_ANCHOR : MOBILE_SIDEBAR_ANCHOR}
          open={shouldOpenSideBar}
          variant={isDesktop ? 'persistent' : 'temporary'}
          items={SIDE_BAR_PRIVATE_ITEMS}
          onClose={handleSideBarClose}
        />
      </Grid>

      <Grid className={classes.content} component="main">
        <ErrorBoundary name="Content">{children}</ErrorBoundary>
      </Grid>
    </Grid>
  );
};

export default PrivateLayout;
