import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import { logoutUser } from "../../actions/actions";

class Platform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableRows: []
    };
  }
  async componentDidMount() {
    console.log('this.props.auth');
    console.log(this.props.auth);

  }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {

    return (
      <div className="container valign-wrapper">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            Welcome to Platform Page!!
          </Grid>
          <Grid item xs={12}>

          </Grid>
        </Grid>
      </div>
    );
  }
}

Platform.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Platform);
