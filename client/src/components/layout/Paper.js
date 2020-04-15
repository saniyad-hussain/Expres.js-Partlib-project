import React from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(2),
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
  },
  button: {
    width: theme.spacing(25),
    height: theme.spacing(25),
    fontSize: 20
  },
  link: {
    textDecoration: 'none'
  }
}));

function SimplePaper(props) {
  const classes = useStyles();
  const { parts } = props;
  return (
    <div className={classes.root}>
      <Paper elevation={5}>
        <Link to="/creator" className={classes.link}>
          <Button className={classes.button}>
            Create
          </Button>
        </Link>
      </Paper>
      {parts && parts[2] &&
        <Paper elevation={5}>
          <Link to={`/creator/${parts[2]._id}/${parts[2].name}`} className={classes.link}>
            <Button className={classes.button}>
              {parts[2].name}
            </Button>
          </Link>
        </Paper>
      }
      {parts && parts[1] &&
        <Paper elevation={5}>
          <Link to={`/creator/${parts[1]._id}/${parts[1].name}`} className={classes.link}>
            <Button className={classes.button}>
              {parts[1].name}
            </Button>
          </Link>
        </Paper>
      }
      {parts && parts[0] &&
        <Paper elevation={5}>
          <Link to={`/creator/${parts[0]._id}/${parts[0].name}`} className={classes.link}>
            <Button className={classes.button}>
              {parts[0].name}
            </Button>
          </Link>
        </Paper>
      }
    </div>
  );
}

const mapStateToProps = state => ({
  parts: state.parts
});

export default connect(
  mapStateToProps,
)(SimplePaper);