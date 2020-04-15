import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { setRecentParts } from "../../actions/actions";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { sendRecoveryMail } from "../../utils/sendRecoveryMail";


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const headCells = [
  { id: '_id', numeric: false, disablePadding: false, label: 'ID' },
  { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
  { id: 'firstName', numeric: true, disablePadding: false, label: 'Fisrt Name' },
  { id: 'lastName', numeric: true, disablePadding: false, label: 'Last Name' },
  { id: 'group', numeric: true, disablePadding: false, label: 'Group' },
  { id: 'reset', numeric: true, disablePadding: false, label: 'Reset' },
];
const GroupRoles = [
  'Admin',
  'Eng',
  'Quality',
  'Ops',
  'Viewer',
  'Guest'
]

const SelectControl = ({
  valueList,
  selectedValue,
  onChangeValue,
}) => (
    <FormControl style={{ minWidth: 100 }}>
      <Select
        onChange={({ target: { value } }) => onChangeValue(value)}
        value={selectedValue}
        input={<OutlinedInput style={{ height: 35 }} />}
      >
        {valueList &&
          valueList.map((item, index) => (
            <MenuItem key={`menu-${index}`} value={item}>
              {item}
            </MenuItem>
          ))}
      </Select>
    </FormControl >
  );

function UserControlTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className={classes.head}>
      <TableRow>

        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
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

UserControlTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  head: {
  },
  wrapper: {
    position: 'absolute',
    height: '30%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    right: '5vw' //loading position
  },
  checkboxLabel: {
    marginRight: 0,
    color: 'black'
  }
}));

function UserControlTable(props) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    fetch('/api/users/getusers')
      .then(results => results.json())
      .then(data => {
        console.log(data);
        setLoading(false);
        setRows(data);
      });
  }, []); //

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {

  };
  const changeRole = (value, index) => {
    setLoading(true);
    let newArr = [...rows]; // copying the old datas array
    newArr[index].role = value; // replace value with whatever you want to change it to
    setRows(newArr);
    const data = { email: rows[index].email, role: value };
    fetch('/api/users/updateRole', {
      method: 'PUT', // or 'POST'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }

  const resetPassword = (value) => {
    const data = { email: value };
    sendRecoveryMail(data);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <Paper className={classes.paper} elevation={5}>
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={'medium'}
          aria-label="enhanced table"
        >
          <UserControlTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {loading &&
              <TableRow className={`${classes.wrapper} ${classes.loading}`}>
                <CircularProgress />
              </TableRow>
            }
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, row._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                  >
                    <TableCell component="th" id={labelId} scope="row" padding="default">
                      {index + rowsPerPage * page}
                    </TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.firstName}</TableCell>
                    <TableCell align="center">{row.lastName}</TableCell>
                    <TableCell align="center">
                      <SelectControl
                        selectedValue={row.role}
                        valueList={GroupRoles}
                        onChangeValue={value => changeRole(value, index + rowsPerPage * page)}>
                      </SelectControl>
                    </TableCell>
                    <TableCell align="center" padding="checkbox">
                      <Button variant="contained" color="primary"
                        onClick={() => resetPassword(row.email)}>
                        Reset
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

const mapStateToProps = state => ({
  parts: state.parts
});

export default connect(
  mapStateToProps,
  { setRecentParts }
)(UserControlTable);
