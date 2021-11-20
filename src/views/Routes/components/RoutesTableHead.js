import React from 'react';
import PropTypes from 'prop-types';
import {Checkbox, TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';

const headCells = [
  { id: 'title', numeric: false, disablePadding: false, label: 'Title' },
  { id: 'type', numeric: false, disablePadding: true, label: 'Type' },
  { id: 'startPlace', numeric: false, disablePadding: true, label: 'Start place' },
  { id: 'finishPlace', numeric: false, disablePadding: false, label: 'Finish place' },
  { id: 'region', numeric: false, disablePadding: false, label: 'Region' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'locations', numeric: false, disablePadding: false, label: 'Locations' },
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
            inputProps={{ 'aria-label': 'select all desserts' }}
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
