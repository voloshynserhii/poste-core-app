import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { AppButton } from '../../../components/AppButton';

/**
 * Renders "Add Collection" button with "Confirm Adding" dialog
 * @class AddButton
 * @param {string} collection - name of Collection in database
 */

const AddButton = ({ collection, ...restOfProps }) => {
  const history = useHistory();

  const onButtonClick = useCallback(() => {
    history.push(`/${collection}/create-${collection}`);
  }, [collection, history]);

  return (
    <>
      <AppButton color="success" onClick={onButtonClick} {...restOfProps} />
    </>
  );
};

export const PropTypesAppButton = {
  collection: PropTypes.string.isRequired,
};

export default AddButton;
