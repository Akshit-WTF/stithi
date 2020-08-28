var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var system = new Schema({
  username    : String,
  password    : String
});

module.exports = mongoose.model('others', system);