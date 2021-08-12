import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const headCells = [
  { id: 'trackingNumber', numeric: false, disablePadding: true, label: 'Tracking Number' },
  { id: 'customer', numeric: false, disablePadding: false, label: 'Customer' },
  { id: 'collectionFrom', numeric: false, disablePadding: false, label: 'Collection from' },
  { id: 'deliveryTo', numeric: false, disablePadding: false, label: 'Delivery to' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Created' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'submissionSource', numeric: false, disablePadding: false, label: 'Source' },
  { id: 'submittedBy', numeric: false, disablePadding: false, label: 'Submitted By' },
  { id: 'assignedCurier', numeric: false, disablePadding: false, label: 'Curier' },
  { id: 'weight', numeric: false, disablePadding: false, label: 'Weight' },
  { id: 'declaredValue', numeric: false, disablePadding: false, label: 'Value' },
  // { id: 'action', numeric: false, disablePadding: false, label: 'Actions' },
];

export default function OrdersTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>#</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.date ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.date}
              direction={orderBy === headCell.date ? order : 'asc'}
              onClick={createSortHandler(headCell.date)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
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
