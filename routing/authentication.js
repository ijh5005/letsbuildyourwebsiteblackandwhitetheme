const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const keyConfig = require('../config/keyConfig');
mongoose.connect(`mongodb://${keyConfig.dbuser}:${keyConfig.dbpassword}@ds147518.mlab.com:47518/authentication`)
        .then(() => {
          console.log('database connected');
        }).catch(err => console.log(err));

const Auth = require('../model/auth');
const util = require('../util/util');

router.post('/signup', (req, res, next) => {
  //cache username and password
  const { username, password } = req.body;
  //check if the user is in the database
  Auth.findOne({ username })
      .then(profile => {
        if(profile) {
          return res.status(400).json({ profile: 'user already exists' });
        }
        //generate a salt
        bcrypt.genSalt(10, function(err, salt) {
          //hash the password
            bcrypt.hash(password, salt, function(err, hash) {
              if(err) throw err;
              //store hash in your password DB.
              const auth = new Auth({ username, password: hash });
              auth.save();
              res.json({ profile: 'profile created' });
            });
        });
      })
});

router.post('/signin', (req, res, next) => {
  const { username, password } = req.body;
  Auth.findOne({ username })
      .then(profile => {
        if(!profile){
          return res.status(404).json({ profile: 'no user with that username exists' })
        }
        // Load hash from your password DB.
        const hash = profile['password'];
        // compare the password with the hash
        bcrypt.compare(password, hash, function(err, password) {
          if(err) throw err;
          if(!password){
            return res.status(400).json({ password: 'incorrect password' })
          }
          res.json({ password: 'correct password' });
        });
      })
})

module.exports = router;
