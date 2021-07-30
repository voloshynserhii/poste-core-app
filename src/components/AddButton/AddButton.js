import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
// import api from '../../api';
import { AppButton } from '../AppButton';
import { ConfirmationDialog } from '../Dialogs';
import { capitalize } from '../../utils/string';

/**
 * Renders "Add Collection" button with "Confirm Adding" dialog
 * @class AddButton
 * @param {string} collection - name of Collection in database
 * @param {boolean} [noConfirmation] - open or not the Confirmation dialog
 * @param {string} [redirectTo] - the URL to open after successful operation
 */
const AddButton = ({ collection, noConfirmation = false, redirectTo = '', disabled, ...restOfProps }) => {
  const [modal, setModal] = useState();
  const history = useHistory();
  const title = capitalize(collection);

  const createRecord = useCallback(async () => {
    // const res = await api.collection.create(collection, { name: `New ${title}`, slug: `new-${collection}` });
    // const url = redirectTo
    //   ? redirectTo
    //   : collection[collection.length - 1] === 's'
    //   ? '/' + collection.slice(0, -1) 
    //   : '/' + collection;
    // history.push(`${url}/${res?.id}`);
  }, [history, collection, title, redirectTo]);

  const onDialogClose = useCallback((event, reason) => {
    setModal(null);
  }, []);

  const onDialogConfirm = useCallback(
    (data) => {
      createRecord();
      setModal(null);
    },
    []
  );

  const onButtonClick = useCallback(() => {
    if (noConfirmation) {
      // Save without confirmation
      createRecord();
      return;
    }

    // Show Confirmation dialog
    const dialog = (
      <ConfirmationDialog
        open
        title={`Add New ${title}?`}
        body={`Do you really want to add new ${title} into the Database?`}
        confirmButtonText="Confirm and Add"
        confirmButtonColor="success"
        onClose={onDialogClose}
        onConfirm={onDialogConfirm}
      />
    );
    setModal(dialog);
  }, [noConfirmation, title, onDialogClose, onDialogConfirm]);

  return (
    <>
      {modal}
      <AppButton color="success" disabled={disabled} onClick={onButtonClick} {...restOfProps} />
    </>
  );
};

export const PropTypesAppButton = {
  collection: PropTypes.string.isRequired,
  noConfirmation: PropTypes.bool,
  redirectTo: PropTypes.string,
};

export default AddButton;
