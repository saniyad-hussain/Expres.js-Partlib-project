import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { sendRecoveryMail } from "../../utils/sendRecoveryMail";

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
    marginBottom: 16,
  },
};

class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      errors: {}
    };
  }

  componentDidMount() {

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

  onSubmit = e => {
    e.preventDefault();
    sendRecoveryMail({ email: this.state.email });
  };

  render() {
    const { errors } = this.state;
    console.log(errors);

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div style={muiStyles.paper}>
          <Avatar style={muiStyles.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
        </Typography>
          <form style={muiStyles.form} noValidate onSubmit={this.onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={this.onChange}
              value={this.state.email}
              error={errors.email}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={muiStyles.submit}
            >
              Reset Password
          </Button>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default ForgotPassword;