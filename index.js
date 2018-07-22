//bring in express and set the view folder
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/view'));

const path = require('path');
//set the port
const PORT = process.env.PORT || 3000;

//twilio
const accountSid = 'AC93d2af277ae58e64e46168894dcf38a1';
const authToken = '609fcb7194cd0923ad64d13e0f22107c';
const client = require('twilio')(accountSid, authToken);

//lets you read the request body
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.sendFile('/index.html');
});

app.post('/sendText', (req, res, next) => {
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
})

app.listen(PORT, () => console.log(`running on port ${PORT}`));
