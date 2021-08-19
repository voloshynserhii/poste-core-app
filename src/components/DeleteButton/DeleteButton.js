import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { api } from '../../api';
import AppButton from '../AppButton';
import { ConfirmationDialog } from '../Dialogs';
import { PropTypeId } from '../utils';
import { capitalize } from '../../utils/string';

/**
 * Renders "Delete Collection" button with "Confirm Delete" dialog
 * @class DeleteButton
 * @param {string} collection - name of Collection in database
 * @param {string|number} id - the ID of the record in Collection in database to delete
 * @param {boolean} [noConfirmation] - open or not the Confirmation dialog
 * @param {string} [redirectTo] - the URL to open after successful operation, note: '/newEntityId' will be added to the end
 */
const DeleteButton = ({ collection, id, noConfirmation = false, redirectTo = '', disabled, ...restOfProps }) => {
  const history = useHistory();
  const [modal, setModal] = useState();
  const title = capitalize(collection);

  const deleteRecord = useCallback(async () => {
    await api.collection.delete(collection, id);
    const url = redirectTo
      ? redirectTo
      : collection[collection.length - 1] === 's'
      ? '/' + collection.slice(0, -1) // remove ending s: games -> game, etc.
      : '/' + collection;
    history.replace(url); // Don't use push here, because back navigation will not work for deleted game
  }, [history, id, collection, redirectTo]);

  const onDialogClose = useCallback((event, reason) => {
    setModal(null);
  }, []);

  const onDialogConfirm = useCallback(
    (data) => {
      deleteRecord();
      setModal(null);
    },
    [deleteRecord]
  );

  const onButtonClick = useCallback(() => {
    if (noConfirmation) {
      // Delete without confirmation
      deleteRecord();
      return;
    }

    // Show Confirmation dialog
    const dialog = (
      <ConfirmationDialog
        open
        title={`Delete ${title}?`}
        body={
          <>
            <div>Do you really want to delete the {title} data from the Database?</div>
            <div>Warning: the operation cannot be rolled back.</div>
          </>
        }
        confirmButtonText="Confirm and Delete"
        confirmButtonColor="error"
        onClose={onDialogClose}
        onConfirm={onDialogConfirm}
      />
    );
    setModal(dialog);
  }, [noConfirmation, title, deleteRecord, onDialogClose, onDialogConfirm]);

  return (
    <>
      {modal}
      <AppButton color="error" disabled={disabled || Boolean(modal)} onClick={onButtonClick} {...restOfProps} />
    </>
  );
};

DeleteButton.propTypes = {
  collection: PropTypes.string.isRequired,
  id: PropTypeId.isRequired,
  noConfirmation: PropTypes.bool,
  redirectTo: PropTypes.string,
};

export default DeleteButton;
