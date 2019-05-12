const express = require('express');
const router = express.Router();

const keyConfig = require('../config/keyConfig');

const Auth = require('../model/auth');
const util = require('../util/util');

//twilio
//account info
const accountSid = 'AC93d2af277ae58e64e46168894dcf38a1';
//number info
const authToken = '609fcb7194cd0923ad64d13e0f22107c';
const client = require('twilio')(accountSid, authToken);

router.get('/', (req, res, next) => {
  res.sendFile('/index.html');
});

router.post('/sendText', (req, res, next) => {
  const message = req.body.message;
  const sendNumber = '8147530157';
  client.messages
        .create({
           body: message,
           from: '+12155157560',
           to: sendNumber
         })
        .then(message => {
          console.log(message.sid);
          res.status(200).send();
        })
        .catch(err => {
          res.json(err)
        })
        .done();
});

router.get('/signinpage', (req, res, next) => {
  res.sendFile('signin.html', { root: __dirname + '/../view/signin' });
});

module.exports = router;
