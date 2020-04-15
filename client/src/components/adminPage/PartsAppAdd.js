import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';


const muiStyles = {
  loadButton: {
    marginTop: 40,
    marginBottom: 'auto'
  },
  controlStyle: {
    margin: '0 auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeSelect: {
    minWidth: 200,
    marginTop: 10,
    marginBottom: 10
  },
  tag: {
    height: 40,
    margin: 10,
  },
  saveForm: {
    marginTop: 40
  },
  confirmButton: {
    marginTop: 20,
    marginLeft: '20%'
  }
};
const Types = [
  'Type 1',
  'Type 2',
  'Type 3'
]

const SelectControl = ({
  title,
  valueList,
  width,
  selectedValue,
  onChangeValue,
}) => (
    <FormControl style={muiStyles.typeSelect}>
      <FormControlLabel
        style={{ marginRight: 0, whiteSpace: 'nowrap' }}
        control={
          <Select
            onChange={({ target: { value } }) => onChangeValue(value)}
            value={selectedValue}
            input={<OutlinedInput style={{ height: 35, width, ...muiStyles.tag }} />}
          >
            {valueList &&
              valueList.map((item, index) => (
                <MenuItem key={`menu-${index}`} value={item}>
                  {item}
                </MenuItem>
              ))}
          </Select>
        }
        label={title}
        labelPlacement="start"
      />

    </FormControl>
  );

const InputTag = ({ title, value, onChangeValue }) => {

  return (
    <FormControl style={muiStyles.formControl}>
      <FormControlLabel
        style={{ marginRight: 0, whiteSpace: 'nowrap' }}
        control={
          <OutlinedInput
            style={{ ...muiStyles.tag }}
            value={value}
            onChange={({ target: { value } }) => onChangeValue(value)}
          />
        }
        label={title}
        labelPlacement="start"
      />
    </FormControl>
  );
}

class PartsAppAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      partAppData: null,
      partTypes: [],
      currentPartType: '',
      currentPart: null
    };
  }
  async componentDidMount() {
    console.log(this.props.auth);
  }


  displayData(data) {
    this.setState({ data });
  }

  setPartAppData(partAppData) {
    let partTyesArray = [];
    this.setState({ partAppData });
    partAppData.map(element => {
      partTyesArray.push(...Object.keys(element));
    });
    this.setState({ partTypes: partTyesArray });
    this.setState({ currentPartType: partTyesArray[0] });
    this.setState({ currentPart: partAppData[0] });
    console.log(partAppData);
  }

  changeCurrentPartType(value) {
    this.setState({ currentPartType: value });
    const { partAppData, partTypes } = this.state
    partTypes.map((partType, index) => {
      if (!!partType.includes(value)) {
        this.setState({ currentPart: partAppData[index] })
      }
    })
  }

  handleFileChange(event) {
    let files = event.target.files;
    if (!files.length) {
      alert('No file select');
      return;
    }
    let file = files[0];
    let that = this;
    let reader = new FileReader();
    reader.onload = function (e) {
      that.displayData(e.target.result);
      that.setPartAppData(JSON.parse(e.target.result));
    };
    reader.readAsText(file);
  }

  render() {
    const { data, partTypes, currentPartType, currentPart } = this.state;
    const { user } = this.props.auth;
    return (
      <Grid container style={{ height: '93vh' }}>
        <Grid item xs={12}>
          <input
            hidden
            accept=".json"
            id="outlined-button-file"
            name="file"
            type="file"
            onChange={(e) => this.handleFileChange(e)}
          />
          <label htmlFor="outlined-button-file">
            <Button
              variant="contained"
              color="default"
              component="span"
              style={muiStyles.loadButton}
              startIcon={<CloudUploadIcon />}
            >
              Load Part App Configuration(.json)
          </Button>
          </label>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="h6" component="h6">
            Text Preview
            </Typography>
          <TextField
            id="outlined-multiline-static"
            type="text"
            fullWidth
            defaultValue={data}
            multiline
            rows={35}
            variant="outlined"
          >
          </TextField>
        </Grid>
        <Grid container item xs={7}>
          <Grid item xs={10} style={muiStyles.controlStyle}>
            <Typography variant="h6" component="h6">
              Tag Preview
            </Typography>
            <SelectControl
              selectedValue={currentPartType}
              valueList={partTypes}
              onChangeValue={value => this.changeCurrentPartType(value)}>
            </SelectControl>
            <Grid item xs={12}>
              {
                currentPart &&
                <InputTag
                  title="Name"
                  value={currentPart[currentPartType].Name}
                  onChangeValue={value => this.displayData(data)}
                />
              }
              {
                !currentPart &&
                <InputTag
                  title="Name"
                  value={''}
                  onChangeValue={value => this.displayData(data)}
                />
              }
            </Grid>
            <Grid item xs={12}>
              {
                currentPart &&
                <SelectControl
                  title="Param"
                  selectedValue={currentPart[currentPartType].Param[0]}
                  valueList={[...currentPart[currentPartType].Param]}
                  width={223}
                  onChangeValue={value => this.displayData(data)}>
                </SelectControl>
              }
              {
                !currentPart &&
                <SelectControl
                  title="Param"
                  selectedValue={''}
                  valueList={[]}
                  width={223}
                  onChangeValue={value => this.displayData(data)}>
                </SelectControl>
              }
            </Grid>
            <Grid item xs={12}>
              {
                currentPart &&
                <InputTag
                  title="Machine"
                  value={currentPart[currentPartType].Machine}
                  onChangeValue={value => this.displayData(data)}
                />
              }
              {
                !currentPart &&
                <InputTag
                  title="Machine"
                  value={''}
                  onChangeValue={value => this.displayData(data)}
                />
              }
            </Grid>
            <Grid item xs={12} style={muiStyles.saveForm}>
              <Typography variant="h6" component="h6">
                Admin User: {user.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl style={muiStyles.formControl}>
                <FormControlLabel
                  style={{ marginRight: 0, whiteSpace: 'nowrap' }}
                  control={
                    <OutlinedInput
                      id="outlined-password-input"
                      type="password"
                      style={muiStyles.tag}
                      autoComplete="current-password"
                      variant="outlined"
                    />
                  }
                  label={'Password'}
                  labelPlacement="start"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="primary" style={muiStyles.confirmButton}>
                Confirm and Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

PartsAppAdd.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
)(PartsAppAdd);
