import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import { logoutUser } from "../../actions/actions";
import UserControlTable from "../layout/UserControlTable";
import PartsAdminTable from "../layout/PartsAdminTable";
import PartsAppAdd from "./PartsAppAdd";

import Button from '@material-ui/core/Button';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pane: 'userControl',
      partsSetting: 'add',
    };
  }
  async componentDidMount() {
    console.log(this.props.auth);
  }
  changePane = (pane) => {
    this.setState({
      pane
    })
  }
  changePartsSetting = (partsSetting) => {
    this.setState({
      partsSetting
    })
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    const { pane, partsSetting } = this.state;

    return (
      <Grid container style={{ height: '93vh' }}>
        {
          pane === 'userControl' &&
          <Grid item xs={9} style={{ margin: 'auto' }}>
            <UserControlTable></UserControlTable>
          </Grid>
        }
        {
          pane === 'partsSetting' &&
          <>
            <Grid item xs={8} style={{ margin: 'auto' }}>
              {
                partsSetting === 'view' &&
                <PartsAdminTable></PartsAdminTable>
              }
              {
                partsSetting === 'add' &&
                <PartsAppAdd></PartsAppAdd>
              }
            </Grid>
            <Grid container item xs={1} style={{ borderStyle: 'inset' }}>
              <Grid item xs={12} >
                <Button id='view' variant="outlined" component="span" style={{ width: '100%' }}
                  onClick={() => this.changePartsSetting('view')}>
                  View
            </Button>
                <Button id='add' variant="outlined" component="span" style={{ width: '100%' }}
                  onClick={() => this.changePartsSetting('add')}>
                  Add
            </Button>
              </Grid>
            </Grid>
          </>
        }
        {
          pane === 'platformSetting' &&
          <Grid item xs={9} style={{ margin: 'auto' }}>
            <UserControlTable user={user.email}></UserControlTable>
          </Grid>
        }
        <Grid container item xs={2} style={{ borderStyle: 'inset' }}>
          <Grid item xs={12} >
            <Button id='userControl' variant="outlined" component="span" style={{ width: '100%' }}
              onClick={() => this.changePane('userControl')}>
              User Management
            </Button>
            <Button id='partsSetting' variant="outlined" component="span" style={{ width: '100%' }}
              onClick={() => this.changePane('partsSetting')}>
              Parts App Settings
            </Button>
            <Button id='platformSetting' variant="outlined" component="span" style={{ width: '100%' }}
              onClick={() => this.changePane('platformSetting')}>
              Platform App Settings
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

AdminPage.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(AdminPage);
