const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
let multer = require("multer");
let fs = require('fs-extra');

const users = require("./routes/api/users");
const data = require("./routes/api/data");

const app = express();
// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);
app.use(express.static('uploads'));
app.use("/", express.static(path.join(__dirname, "client/build")));
app.use("/api/users", users);
app.use("/api/data", data);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
// Routes

let storage = multer.diskStorage({
  //multers disk storage settings
  destination: (req, file, cb) => {
    console.log(file);
    let uid = req.params.uid;
    let path = `uploads/${uid}`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const datetimestamp = Date.now();
    // cb(null, datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    cb(null, file.originalname);
  }
});

let upload = multer({
  //multer settings
  storage: storage
}).single("file");

app.post("/uploads/:uid", function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    res.send(req.file);
  });
});


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
