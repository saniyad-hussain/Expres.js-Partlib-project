import React from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Button,
  Toolbar,
  Typography
} from "@material-ui/core";

import { logoutUser } from "../../actions/actions";


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  button: {
    color: 'white',
  },
  link: {
    textDecoration: 'none'

  },
  title: {
    flexGrow: 1,
  },
  navText: {
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}));



function Navbar(props) {
  const classes = useStyles();
  const { user } = props.auth;
  const onLogoutClick = e => {
    e.preventDefault();
    props.logoutUser();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/" className={classes.link}>
            <Button className={classes.button}>Home</Button>
          </Link>

          {!user.role &&
            <Link to="/login" className={classes.link}>
              <Button className={classes.button}>Login</Button>
            </Link>
          }
          {user.role &&
            <>
              {(user.role !== 'Guest') &&
                <>
                  <Link to="/dashboard" className={classes.link}>
                    <Button className={classes.button}>Parts</Button>
                  </Link>
                  <Link to="/platform" className={classes.link}>
                    <Button className={classes.button}>Platform</Button>
                  </Link>
                </>
              }
              {(user.role === 'Admin') &&
                <Link to="/adminpage" className={classes.link}>
                  <Button className={classes.button}>Admin</Button>
                </Link>
              }
              <Link to="/logout" className={classes.link}>
                <Button className={classes.button} onClick={onLogoutClick}>Logout</Button>
              </Link>
              <Typography variant="h6" className={classes.navText}>
                Logged in as {user.email} - {user.role}
              </Typography>
            </>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);