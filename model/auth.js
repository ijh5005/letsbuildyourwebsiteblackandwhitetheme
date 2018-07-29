const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = auth = mongoose.model('auth', authSchema);
