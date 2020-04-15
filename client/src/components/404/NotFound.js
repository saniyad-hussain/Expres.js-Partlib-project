import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';

class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: ''
    };
  }

  render() {

    return (
      <div className="container valign-wrapper">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            This page does not exist or You have no access to this page.
          </Grid>
          <Grid item xs={12}>
          </Grid>
        </Grid>
      </div>
    );
  }
}


export default NotFound;
