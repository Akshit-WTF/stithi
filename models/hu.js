var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var system = new Schema({
    service: String,
    uptime: Array
});

module.exports = mongoose.model('days', system);