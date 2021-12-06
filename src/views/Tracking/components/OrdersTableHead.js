import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox, TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';

const headCells = [
  { id: 'trackingNumber', numeric: false, disablePadding: true, label: 'Tracking Number' },
  { id: 'customer', numeric: false, disablePadding: true, label: 'Customer' },
  { id: 'curier', numeric: false, disablePadding: true, label: 'Curier' },
  { id: 'collectionFrom', numeric: false, disablePadding: false, label: 'Collection from' },
  { id: 'deliveryTo', numeric: false, disablePadding: false, label: 'Delivery to' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'submissionSource', numeric: false, disablePadding: false, label: 'Source' },
  { id: 'weight', numeric: false, disablePadding: false, label: 'Weight' },
  { id: 'declaredValue', numeric: false, disablePadding: false, label: 'Value' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Created' },
  { id: 'update', numeric: false, disablePadding: false, label: 'Last Update' },
  // { id: 'action', numeric: false, disablePadding: false, label: 'Actions' },
];

export default function OrdersTableHead(props) {
  const { classes, numSelected, order, orderBy, rowCount, onSelectAllClick, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
      <TableCell>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all orders' }}
          />
        </TableCell>
        <TableCell></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.date ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.date}
              direction={orderBy === headCell.date ? order : 'asc'}
              onClick={createSortHandler(headCell.date)}
            >
              {headCell.label}
              {orderBy === headCell.date ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrdersTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};
