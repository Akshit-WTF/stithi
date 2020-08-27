var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var system = new Schema({
  url          : String,
  uptime       : Array,
  delay        : String,
  status       : Boolean,
  name         : String,
  ping         : String
});

module.exports = mongoose.model('status', system);