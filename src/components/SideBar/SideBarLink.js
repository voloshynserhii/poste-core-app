import { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1, // takes all width
  },
  link: {
    color: theme.palette.text.secondary,
  },
  linkActive: {
    color: theme.palette.text.primary,
  },
}));

/**
 * Router link with styling to use in SideBar, highlighted for current url.
 */
const SideBarLink = forwardRef(({ className, ...restOfProps }, ref) => {
  const classes = useStyles();
  const classLink = clsx(className, classes.link);
  return (
    <div ref={ref} className={classes.root}>
      <NavLink exact className={classLink} activeClassName={classes.linkActive} {...restOfProps} />
    </div>
  );
});

export default SideBarLink;
