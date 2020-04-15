import React, { Component } from "react";
import axios from "axios";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="/">
        Partlibrary
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const muiStyles = {
  paper: {
    marginTop: 64,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: 8,
    backgroundColor: '#dc004e',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: 8,
  },
  submit: {
    marginTop: 16,
    marginBottom: 16,
  },
};

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      password2: "",
      updated: true,
      isLoading: true,
      error: false,
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { token },
      },
    } = this.props;
    try {
      const response = await axios.get(`/api/users/reset/${token}`);
      console.log(response);
      if (response.data.message === 'password reset link is valid') {
        this.setState({
          email: response.data.email,
          updated: false,
          isLoading: false,
          error: false,
        });
        console.log(this.state);
      }
    } catch (error) {
      this.setState({
        updated: false,
        isLoading: false,
        error: true,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });

  };

  updatePassword = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const {
      match: {
        params: { token },
      },
    } = this.props;
    try {
      const response = await axios.put(
        '/api/users/updatePasswordViaEmail',
        {
          email,
          password,
          resetPasswordToken: token,
        },
      );
      console.log(response.data);
      if (response.data.message === 'password updated') {
        this.setState({
          updated: true,
          error: false,
        });
      } else {
        this.setState({
          updated: false,
          error: true,
        });
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  render() {
    const { error, password, password2, isLoading, updated } = this.state;
    if (isLoading) {
      return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div style={muiStyles.paper}>
            <Avatar style={muiStyles.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Please Wait...
            </Typography>
            <CircularProgress />
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      );
    }
    if (error) {
      return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div style={muiStyles.paper}>
            <Avatar style={muiStyles.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Password Reset Link is not valid or expired.
        </Typography>
            <form style={muiStyles.form} noValidate>
              <Grid container>
                <Grid item xs>
                  <Link to="/forgotPassword" variant="body2">
                    Send another reset link.
              </Link>
                </Grid>
                <Grid item>
                  <Link to="/login" variant="body2">
                    Try login again
                </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      );
    }
    if (updated) {
      return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div style={muiStyles.paper}>
            <Avatar style={muiStyles.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Password has been reset, please try logging in again.
            </Typography>
            <form style={muiStyles.form} noValidate>
              <Grid container>
                <Grid item>
                  <Link to="/login" variant="body2">
                    Login
                </Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      );
    }
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div style={muiStyles.paper}>
          <Avatar style={muiStyles.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change Password
        </Typography>
          <form style={muiStyles.form} noValidate onSubmit={this.updatePassword}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.onChange}
                  value={this.state.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"
                  autoComplete="current-password"
                  onChange={this.onChange}
                  value={this.state.password2}
                />
              </Grid>
              {/*  <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={password !== password2}
              style={muiStyles.submit}
            >
              Change Password
          </Button>
          </form></div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default ResetPassword;