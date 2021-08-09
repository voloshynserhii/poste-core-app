import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { api } from '../../api';
import { AppButton } from '../AppButton';
import { ConfirmationDialog } from '../Dialogs';
import { PropTypeId } from '../utils';
import { capitalize } from '../../utils/string';

/**
 * Renders "Save Collection" button with "Confirm Save" dialog
 * @class SaveButton
 * @param {string} collection - name of Collection in database
 * @param {string|number} id - the ID of the record in Collection in database to save
 * @param {boolean} [noConfirmation] - open or not the Confirmation dialog
 */
const SaveButton = ({ collection, id, payload, disabled, noConfirmation = false, ...restOfProps }) => {
  const [modal, setModal] = useState();
  const title = capitalize(collection);

  const updateRecord = async () => {
    await api.collection.update(collection, id, payload);
  };

  const onDialogClose = useCallback((event, reason) => {
    setModal(null);
  }, []);

  const onDialogConfirm = (data) => {
    // Don't use useCallback here!!! The updateData() will be called with initial .data
    updateRecord();
    setModal(null);
  };

  const onButtonClick = () => {
    // Don't use useCallback here!!! The updateData() will be called with initial .data
    if (noConfirmation) {
      // Save without confirmation
      updateRecord();
      return;
    }

    // Show Confirmation dialog
    const dialog = (
      <ConfirmationDialog
        open
        title={`Save ${title}?`}
        body={`Do you really want to update the ${title} data in the Database?`}
        confirmButtonText="Confirm and Save"
        confirmButtonColor="success"
        onClose={onDialogClose}
        onConfirm={onDialogConfirm}
      />
    );
    setModal(dialog);
  };

  return (
    <>
      {modal}
      <AppButton color="success" disabled={disabled || Boolean(modal)} onClick={onButtonClick} {...restOfProps} />
    </>
  );
};

SaveButton.propTypes = {
  collection: PropTypes.string.isRequired,
  id: PropTypeId.isRequired,
  payload: PropTypes.object,
  noConfirmation: PropTypes.bool,
};

export default SaveButton;
