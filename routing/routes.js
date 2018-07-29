const express = require('express');
const router = express.Router();

const keyConfig = require('../config/keyConfig');

const Auth = require('../model/auth');
const util = require('../util/util');

router.get('/', (req, res, next) => {
  res.sendFile('/index.html');
});

router.post('/sendText', (req, res, next) => {
  const message = req.body.message;
  const sendNumber = '8147530157';
  client.messages
        .create({
           body: message,
           from: '+12153525451',
           to: sendNumber
         })
        .then(message => {
          console.log(message.sid);
          res.status(200).send();
        })
        .catch(err => res.json(err))
        .done();
});

router.get('/signinpage', (req, res, next) => {
  res.sendFile('signin.html', { root: __dirname + '/../view/signin' });
});

module.exports = router;
