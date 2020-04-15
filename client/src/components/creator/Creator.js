import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Render from "./Render";



export default class Creator extends Component {

  changePane = (pane) => {
    this.setState({
      pane
    })
  }

  constructor() {
    super();
    this.state = {
      pane: 'import'
    };
  }

  render() {
    const {id, name } = this.props.match.params;
    return (
      <Grid container>
        { //!Object.keys(this.props.auth).includes('data') &&
          <Grid item xs={11}>
            <Render pane={this.state.pane}
              partId={id}
              partName={name}>
            </Render>
          </Grid>
        }

        <Grid container item xs={1}>
          <Grid item xs={12} >

            <Button id='import' variant="outlined" component="span" style={{ width: '100%' }}
              onClick={() => this.changePane('import')}>
              Import STLS
            </Button>
            <Button id='tag' variant="outlined" component="span" style={{ width: '100%' }}
              onClick={() => this.changePane('tag')}>
              Tags
            </Button>
            <Button id='save' variant="outlined" component="span" style={{ width: '100%' }}
              onClick={() => this.changePane('save')}>
              Save
            </Button>
          </Grid>

        </Grid>
      </Grid>
    );
  }
}
