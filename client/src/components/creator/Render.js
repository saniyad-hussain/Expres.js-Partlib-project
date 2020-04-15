import React, { Component } from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Button,
  Grid,
  IconButton,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Typography,
  OutlinedInput
} from '@material-ui/core';
import { connect } from "react-redux";
import { loadingModel } from "../../actions/actions";
import { savePartData } from "../../utils/partDataController";
import CircularProgress from '@material-ui/core/CircularProgress';

let STLLoader = require('three-stl-loader')(THREE);

const valueList = [
  'Type 1',
  'Type 2',
  'Type 3',
  'Type 4',
]

const muiStyles = {
  canvas: {
    height: '93vh'
  },
  stlButton: {
    width: "60%",
    margin: 10,
  },
  girdContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'auto',
  },
  pane: {
    maxHeight: '92vh',
    overflowY: 'scroll'
  },
  formControl: {
    width: "100%",
    height: 50,
    borderColor: "red"
  },
  inputSelectControl: {
    height: 30,
    marginBottom: 10,
    marginTop: 10,
  },
  marginControl: {
    marginRight: 10
  },
  meshControl: {
    marginBottom: 30
  },
  tag: {
    height: 30,
    margin: 10
  },
  select: {
    width: '100%',
  },
  partName: {
    marginTop: 20,
  },
  loadingIcon: {
    marginLeft: '36vw',
    marginTop: '43vh',
    position: 'absolute',
  }
};

const InputControl = ({ title, value, onChangeValue }) => {
  let axisColor;
  if (title === 'X') axisColor = 'red';
  if (title === 'Y') axisColor = 'lawngreen';
  if (title === 'Z') axisColor = 'blue';

  return (
    <FormControl style={muiStyles.formControl}>
      <Typography align='center' style={{ color: axisColor }}>
        {title}
      </Typography>
      <OutlinedInput
        type='number'
        style={{ ...muiStyles.inputSelectControl, ...muiStyles.marginControl }}
        value={value}
        onChange={({ target: { value } }) => onChangeValue(value)}
      />
    </FormControl>
  );
}
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

const SelectControl = ({
  title,
  valueList,
  selectedValue,
  onChangeValue,
  classNames: {
    formControl: formControlClass,
    tag: tagClass,
    select: selectClass,
  }
}) => (
    <FormControl className={formControlClass}>
      <FormControlLabel
        style={{ marginRight: 0, whiteSpace: 'nowrap' }}
        control={
          <Select
            className={`${tagClass} ${selectClass}`}
            onChange={({ target: { value } }) => onChangeValue(value)}
            value={selectedValue}
            input={<OutlinedInput />}
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

let scene, camera;
class Render extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meshes: [],
      partName: props.partName || '',
      loading: false
    };

  }
  componentDidMount() {
    const { partId } = this.props;
    this.sceneSetup();
    this.addCustomSceneObjects();
    this.startAnimationLoop();
    window.addEventListener("resize", this.handleWindowResize);
    if (partId) {
      this.setState({ loading: true });
      fetch(`/api/data/stl/${partId}`)
        .then(results => results.json())
        .then(async data => {
          console.log(data);
          let totalmesh = [];
          await data.map(element => {
            let loader = new STLLoader();
            loader.load(`https://cors-anywhere.herokuapp.com/${element.azureURL}`, (geometry) => {
              let material = new THREE.MeshNormalMaterial();
              let mesh = new THREE.Mesh(geometry, material);
              mesh.name = element.name;
              mesh.partType = element.partType;
              mesh.nickName = element.nickName;
              mesh.tag1 = element.tag1;
              mesh.tag2 = element.tag2;
              mesh.position.x = element.position.x;
              mesh.position.y = element.position.y;
              mesh.position.z = element.position.z;
              scene.add(mesh);
              totalmesh.push(mesh);
              this.setState({ meshes: totalmesh });
              return element;
            });
          })
          this.setState({ loading: false });
        });
    }

  }
  componentWillReceiveProps(nextProps) {

    let meshes;
    const oldData = this.props.auth.data || null;
    const data = nextProps.auth.data || null;
    if ((oldData !== data) && data) {
      const { path, filename } = data;
      console.log(path);
      const modelPath = path.slice(7); //delete "uploads/" express static folder.
      console.log(modelPath);
      let loader = new STLLoader();
      loader.load(modelPath, (geometry) => {
        let material = new THREE.MeshNormalMaterial();
        let mesh = new THREE.Mesh(geometry, material);
        mesh.name = filename;
        mesh.filePath = path;
        scene.add(mesh);
        this.setState({ loading: false });
        meshes = scene &&
          scene.children.filter(element => {
            return element.type === 'Mesh';
          });
        this.setState({ meshes });
        const width = this.el.clientWidth;
        const height = this.el.clientHeight;
        this.renderer.setSize(width, height);
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
  // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  sceneSetup = () => {
    // get container dimensions and use them for scene sizing
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    camera.position.y = 125;
    camera.position.z = 125;
    camera.position.x = 125;
    //rotate the scene so that matching WebGL XYZ direction to common XYZ. RED: X, Green: Y, Blue: Z
    scene.rotation.x = -90 * Math.PI / 180;
    // is used here to set some distance from a cube that is located at z = 0

    //const helper = new THREE.CameraHelper( this.camera ); //Camera Helper
    //this.scene.add( helper );

    // OrbitControls allow a camera to orbit around the object
    // https://threejs.org/docs/#examples/controls/OrbitControls


    this.controls = new OrbitControls(camera, this.el);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.el.appendChild(this.renderer.domElement); // mount using React ref
  };

  // Here should come custom code.
  // Code below is taken from Three.js BoxGeometry example
  // https://threejs.org/docs/#api/en/geometries/BoxGeometry
  addCustomSceneObjects = () => {
    const size = 250;
    const divisions = 25;
    const gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.geometry.rotateX(Math.PI / 2); //rotate grid so thatit lays
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(130);
    scene.add(axesHelper);

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200 / 2, 0);
    lights[1].position.set(100 / 2, 200 / 2, 100);
    lights[2].position.set(-100 / 2, -200 / 2 / 2, -100 / 2);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);
    /*  let loader = new STLLoader();
       loader.load('https://cors-anywhere.herokuapp.com/https://bfmblob.blob.core.windows.net/partlibrary/stlfile.stl', (geometry) => {
         let material = new THREE.MeshNormalMaterial();
         let mesh = new THREE.Mesh(geometry, material);
         scene.add(mesh);
         window.alert('New model loaded sucessfully!');
       });
  */
  };

  startAnimationLoop = () => {

    this.renderer.render(scene, camera);

    // The window.requestAnimationFrame() method tells the browser that you wish to perform
    // an animation and requests that the browser call a specified function
    // to update an animation before the next repaint
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.renderer.setSize(width, height);
    camera.aspect = width / height;

    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    camera.updateProjectionMatrix();
  };
  saveData = () => {
    let meshData = [];
    const meshes = this.state.meshes;
    meshes.map((mesh, index) => {
      let newMesh = {};
      newMesh.position = mesh.position;
      newMesh.name = mesh.name || '';
      newMesh.filePath = mesh.filePath || '';
      newMesh.partType = mesh.partType || '';
      newMesh.nickName = mesh.nickName || '';
      newMesh.tag1 = mesh.tag1 || '';
      newMesh.tag2 = mesh.tag2 || '';
      meshData.push(newMesh);
    })
    const partData = {
      partName: this.state.partName,
      userId: this.props.auth.user.email,
      meshes: meshData
    };
    console.log(partData);
    savePartData(partData);
  }
  setPartName = (partName) => {
    this.setState({ partName });
  };
  setXPosition = (value, index) => {
    let { meshes } = this.state;
    meshes[index].position.x = value;
    this.setState(meshes);
  };
  setYPosition = (value, index) => {
    let { meshes } = this.state;
    meshes[index].position.y = value;
    this.setState(meshes);
  };
  setZPosition = (value, index) => {
    let { meshes } = this.state;
    meshes[index].position.z = value;
    this.setState(meshes);
  };
  setNickName = (value, index) => {
    let { meshes } = this.state;
    meshes[index].nickName = value;
    this.setState(meshes);
  };
  setTag1 = (value, index) => {
    let { meshes } = this.state;
    meshes[index].tag1 = value;
    this.setState(meshes);
  };
  setTag2 = (value, index) => {
    let { meshes } = this.state;
    meshes[index].tag2 = value;
    this.setState(meshes);
  };
  setPartType = (value, index) => {
    let { meshes } = this.state;
    meshes[index].partType = value;
    this.setState(meshes);
  };

  deleteStl = (index) => {
    let { meshes } = this.state;
    const selectedObject = scene.getObjectByName(meshes[index].name);
    scene.remove(selectedObject);
    meshes.splice(index, index + 1);
    this.setState(meshes);
  };

  handleChange(event) {
    let data = new FormData();
    const userId = this.props.auth.user.id;
    const file = event.target.files[0];
    data.append('file', file);
    this.props.loadingModel(userId, data);
    this.setState({ loading: true });
  }

  render() {
    const { meshes, partName, loading } = this.state;
    console.log(meshes);
    const { pane, classes } = this.props;
    return (
      <Grid container style={muiStyles.girdContainer}>
        <Grid item xs={10}>
          {loading &&
            <CircularProgress style={muiStyles.loadingIcon} size={80} />
          }
          <div style={muiStyles.canvas} ref={ref => (this.el = ref)} />
        </Grid>
        {(pane === 'import') &&
          <Grid container item xs={2} direction="row" style={muiStyles.pane}>
            <Grid item xs={12} align='center'>
              <input
                hidden
                accept=".stl"
                id="outlined-button-file"
                name="file"
                type="file"
                onChange={(e) => this.handleChange(e)}
              />
              <label htmlFor="outlined-button-file">
                <Button variant="outlined" component="span" className={classes.stlButton}>
                  Add a STL
                </Button>
              </label>
              {meshes.map((mesh, index) => (
                <Grid container item xs={12} key={index} style={muiStyles.meshControl}>
                  <Grid item xs={12} >
                    <Typography variant="h5">
                      {mesh.name}
                      <IconButton aria-label="delete" onClick={() => this.deleteStl(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Typography>

                  </Grid>
                  <Grid item xs={4}>
                    <InputControl
                      title="X"
                      value={mesh.position.x}
                      onChangeValue={value => this.setXPosition(value, index)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputControl
                      title="Y"
                      value={mesh.position.y}
                      onChangeValue={value => this.setYPosition(value, index)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputControl
                      title="Z"
                      value={mesh.position.z}
                      onChangeValue={value => this.setZPosition(value, index)}
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        }
        {(pane === 'tag') &&
          <Grid container item xs={2} direction="row" style={muiStyles.pane}>
            <Grid item xs={12} align='center'>
              {meshes.map((mesh, index) => (
                <Grid container item xs={12} key={index} style={muiStyles.meshControl}>
                  <Grid item xs={12} >
                    <Typography variant="h5" align='center'>
                      {mesh.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} >
                    <SelectControl
                      title="Part Type"
                      selectedValue={mesh.partType || ''}
                      valueList={valueList}
                      classNames={{
                        tag: classes.tag,
                        select: classes.select,
                        formControl: classes.formControl
                      }}
                      onChangeValue={value => this.setPartType(value, index)}>
                    </SelectControl>
                  </Grid>
                  <Grid item xs={12}>
                    <InputTag
                      title="Nick Name"
                      value={mesh.nickName}
                      onChangeValue={value => this.setNickName(value, index)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputTag
                      title="Tag 1"
                      value={mesh.tag1}
                      onChangeValue={value => this.setTag1(value, index)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputTag
                      title="Tag 2"
                      value={mesh.tag2}
                      onChangeValue={value => this.setTag2(value, index)}
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        }
        {(pane === 'save') &&
          <Grid container item xs={2} direction="row" style={muiStyles.pane}>
            <Grid item xs={12} align='center' style={muiStyles.partName}>
              <InputTag
                title="Part Name"
                value={partName}
                onChangeValue={value => this.setPartName(value)}
              />
            </Grid>
            <Grid item xs={12} align='center'>
              <Button variant="outlined" component="span" className={classes.stlButton}
                disabled={(meshes.length === 0) || (partName.length === 0)}
                onClick={() => this.saveData()}>
                Save Part
              </Button>
            </Grid>
          </Grid>
        }

      </Grid>
    );

  }
}

Render.propTypes = {
  loadingModel: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps, { loadingModel },
)(withStyles(muiStyles)(Render));
