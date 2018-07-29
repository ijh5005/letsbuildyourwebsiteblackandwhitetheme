//bring in express and set the view folder
const express = require('express');
const app = express();
//lets you read the request body
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routing/routes')
const authentication = require('./routing/authentication');

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
