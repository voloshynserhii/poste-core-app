import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PropTypeId } from '../../views/Game/utils';
import { MenuItem, TextField } from '@material-ui/core';
import api from '../../api';
import { SHARED_CONTROL_PROPS } from '../../utils/form';

/**
 * Renders Select control to choose between items of specific Data Collection
 * @param {string} collection - name of the Data Collection
 * @param {string|number} id - id of selected record from Data Collection
 * @param {string|number} value - same as the .id prop
 * @param {string} noOptionTitle - when set this option appears in the top of the drop-down list
 */
const CollectionSelect = ({
  collection,
  id = '',
  value: propValue = '',
  name, // Just to pass as html id
  noOptionTitle = '[not set]',
  ...restOfProps
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const listFromApi = await api.collection.read(collection);
      const sortedList = listFromApi.sort(({ name: a }, { name: b }) => a.localeCompare(b));
      setOptions(sortedList);
    } catch (error) {
      log.error(error);
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderOptionsAsArray = () => {
    const result = options.map((collectionItem) => (
      <MenuItem key={collectionItem.id} value={collectionItem.id}>
        {collectionItem.name}
      </MenuItem>
    ));
    if (Boolean(noOptionTitle)) {
      result.unshift(
        <MenuItem key={noOptionTitle} value="">
          {noOptionTitle}
        </MenuItem>
      );
    }
    return result;
  };

  const value = String(id || propValue || '');

  return (
    <TextField
      select
      id={name}
      name={name}
      value={value}
      disabled={loading}
      SelectProps={{
        displayEmpty: true, // Show [not set] value when empty
      }}
      InputLabelProps={{
        shrink: true, // Don't cover input, because [not set] value is visible when empty
      }}
      {...SHARED_CONTROL_PROPS}
      {...restOfProps}
    >
      {loading ? <MenuItem>Loading...</MenuItem> : renderOptionsAsArray()}
    </TextField>
  );
};

CollectionSelect.propTypes = {
  collection: PropTypes.string,
  id: PropTypeId,
  value: PropTypeId,
  noOptionTitle: PropTypes.string,
};

export default CollectionSelect;
