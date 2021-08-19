import PropTypes from 'prop-types';

export const SIDEBAR_WIDTH = 240; // 240px

export const PropTypeSideBarItems = PropTypes.arrayOf(
  PropTypes.shape({
    title: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.string,
  })
);
