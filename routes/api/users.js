const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const nodemailer = require("nodemailer");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: 'Guest'
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// SEND   password reset link to email
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sky.blue.1991519@gmail.com",
    pass: "ourfutureisgreat"
  }
});

router.post('/reset-password', function (req, res) {
  console.log(req.body.email);
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });

      //Generate and set password reset token
      user.generatePasswordReset();

      // Save the updated user object
      user.save()
        .then(user => {
          // send email
          console.log(user);

          let link = "http://" + req.headers.host + "/reset/" + user.resetPasswordToken;
          const mailOptions = {
            from: `Partlibrary<sky.blue.1991519@gmail.com>`, // sender address
            to: user.email, // list of receivers
            subject: "Password change request", // Subject line
            html: `<html>
                    <body>
                      <h3>Hi ${user.name}</h3><br>
                      <h4>Please click on the following link ${link} to reset your password.<br>
                      If you did not request this, please ignore this email and your password will remain unchanged.
                      </h4>
                    </body>
                  </html>` // plain text body
          };
          transporter.sendMail(mailOptions, function (err, response) {
            if (err) {
              console.error('there was an error: ', err);
              res.send(err);
            }
            else {
              console.log('here is the response: ', response);
              res.status(200).json('recovery email sent');
            }
          });

        })
        .catch(err => res.status(500).json({ message: err.message }));
    })
    .catch(err => res.status(500).json({ message: err.message }));
});

router.get('/reset/:token', (req, res) => {
  console.log(req.params.token);
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  })
    .then(user => {
      if (user == null) {
        console.log('password reset link is invalid or has expired');
        res.status(403).send('password reset link is invalid or has expired'); s
      } else {
        console.log(user.email)
        res.status(200).send({
          email: user.email,
          message: 'password reset link is valid'
        });
      }
    })
    .catch(err => res.status(500).json({ message: err.message }));
});

router.put('/updatePasswordViaEmail', (req, res) => {
  const { email, password, resetPasswordToken } = req.body

  User.findOne({
    email: email,
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  }).then(user => {
    if (user == null) {
      console.error('password reset link is invalid or has expired');
      res.status(403).send('password reset link is invalid or has expired');
    } else if (user != null) {
      console.log('user exists in db', user);
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then(user => {
              console.log('password updated');
              res.status(200).send({ message: 'password updated' });
            })
            .catch(err => console.log(err));
        });
      })
    } else {
      console.error('no user exists in db to update');
      res.status(401).json('no user exists in db to update');
    }
  });
});

router.get('/getUsers', (req, res) => {
  User.find({})
    .then(users => {
      let UserArray = [];
      users.map((user) => {
        const userdata = {
          email: user.email,
          firstName: user.name.split(" ")[0],
          lastName: user.name.split(" ")[1],
          role: user.role || 'Guest'
        };
        UserArray.push(userdata);
      })
      res.json(UserArray);
    })
    .catch(err => res.status(500).json({ message: err.message }));
});

router.put('/updateRole', (req, res) => {
  const { email, role } = req.body

  User.findOne({
    email: email,
  }).then(user => {
    if (user == null) {
      res.status(403).send('Cannot find this user in DB');
    } else if (user != null) {
      console.log('user exists in db', user);
      user.role = role;
      user
        .save()
        .then(user => {
          console.log('role updated');
          res.status(200).send({ message: 'role updated' });
        })
        .catch(err => console.log(err));
    } else {
      console.error('no user exists in db to update');
      res.status(401).json('no user exists in db to update');
    }
  });
});

module.exports = router;
