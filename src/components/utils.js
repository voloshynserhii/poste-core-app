import PropTypes from 'prop-types';

export const PropTypeId = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export const PropTypeCollectionData = PropTypes.shape({
  name: PropTypes.string,
  slug: PropTypes.string,
});
