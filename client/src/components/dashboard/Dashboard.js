import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import { logoutUser } from "../../actions/actions";
import SimplePaper from "../layout/Paper";
import EnhancedTable from "../layout/PartsTable";

class Dashboard extends Component {
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
    const { user } = this.props.auth;

    return (
      <div className="container valign-wrapper">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SimplePaper></SimplePaper>
          </Grid>
          <Grid item xs={12}>
            <EnhancedTable/>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
