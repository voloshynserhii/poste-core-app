import { useState, useCallback, useContext } from 'react';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';

import { AppContext } from "../../../store";
import api from "../../../api";
import { AppButton } from '../../../components/AppButton';
import { ConfirmationDialog } from '../../../components/Dialogs';

/**
 * Renders "Save Collection" button with "Confirm Save" dialog
 * @class SaveButton
 * @param {string|number} id - the ID of the record in Collection in database to save
 * @param {boolean} [noConfirmation] - open or not the Confirmation dialog
 */
const UpdateButton = ({ id, payload, disabled, noConfirmation = false, ...restOfProps }) => {
  const [, dispatch] = useContext(AppContext);
  const [modal, setModal] = useState();
  const history = useHistory();

  const updateRecord = async () => {
    const res = await api.routes.update(id, payload);
    if (res.status === 200) {
      dispatch({ type: "UPDATE_ROUTE", id: id, updatedRoute: res.data});
    }
  };

  const onDialogClose = useCallback((event, reason) => {
    setModal(null);
  }, []);

  const onDialogConfirm = (data) => {
    // Don't use useCallback here!!! The updateData() will be called with initial .data
    updateRecord();
    setModal(null);
    history.replace(`/route`);
  };

  const onButtonClick = () => {
    // Don't use useCallback here!!! The updateData() will be called with initial .data
    if (noConfirmation) {
      // Update without confirmation
      updateRecord();
      return;
    }

    // Show Confirmation dialog
    const dialog = (
      <ConfirmationDialog
        open
        title={`Save route?`}
        body={`Do you really want to update the route data in the Database?`}
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

UpdateButton.propTypes = {
  collection: PropTypes.string.isRequired,
  payload: PropTypes.object,
  noConfirmation: PropTypes.bool,
};

export default UpdateButton;
