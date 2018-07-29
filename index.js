//bring in express and set the view folder
const express = require('express');
const app = express();
//lets you read the request body
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routing/routes')
const authentication = require('./routing/authentication');

//twilio
const accountSid = 'AC93d2af277ae58e64e46168894dcf38a1';
const authToken = '609fcb7194cd0923ad64d13e0f22107c';
const client = require('twilio')(accountSid, authToken);

//middleware
app.use(express.static(__dirname + '/view'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use('/', routes);
app.use('/auth', authentication);


//set the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`running on port ${PORT}`));
