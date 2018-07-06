//bring in express and set the view folder
const express = require('express');
const app = express();
app.use(express.static(__dirname + '/view'));

const path = require('path');
//set the port
const PORT = 3000;

app.get('/', (req, res, next) => {
  res.sendFile('/index.html');
});

app.listen(PORT);

console.log('running on port: ' + PORT);
