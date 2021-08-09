import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { AppButton } from '../../../components/AppButton';
import { ConfirmationDialog } from '../../../components/dialogs';
import USERS from '../utils';
/**
 * Renders "Save Collection" button with "Confirm Save" dialog
 * @class SaveButton
 * @param {string} collection - name of Collection in database
 * @param {string|number} id - the ID of the record in Collection in database to save
 */
const SaveButton = ({ collection, id, payload, disabled, noConfirmation = false, ...restOfProps }) => {
  const [modal, setModal] = useState();

  const updateRecord = async () => {
    // save changes in BD
    USERS.push({ id: Math.random().toString, name: payload.name, email: payload.email, balance: payload.balance });
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
        title={`Save ${collection}?`}
        body={`Do you really want to save the ${collection} data in the Database?`}
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
      <AppButton
        color="success"
        payload={payload}
        disabled={disabled || Boolean(modal)}
        onClick={onButtonClick}
        {...restOfProps}
      />
    </>
  );
};

SaveButton.propTypes = {
  collection: PropTypes.string.isRequired,
  payload: PropTypes.object,
  noConfirmation: PropTypes.bool,
};

export default SaveButton;
